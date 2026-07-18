import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideMapPin,
  LucidePencil,
  LucidePhone,
  LucideTrash2,
  LucideX,
} from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

import { AddressItem, AddressModalMode } from './models/address.model';
import { AddressPayload } from './models/address-api.model';
import { AddressesService } from './services/addresses.service';
import { GoogleMapsLoaderService } from './services/google-maps-loader.service';

type AddressModalView = 'list' | 'form';

@Component({
  selector: 'app-addresses',
  imports: [
    LucideArrowLeft,
    LucideArrowRight,
    LucideMapPin,
    LucidePencil,
    LucidePhone,
    LucideTrash2,
    LucideX,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './addresses.html',
  styleUrl: './addresses.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Addresses implements OnInit {
  private readonly addressesService = inject(AddressesService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly mapsLoader = inject(GoogleMapsLoaderService);

  @ViewChild('mapCanvas') private mapCanvas?: ElementRef<HTMLDivElement>;

  readonly addresses = this.addressesService.addresses;
  readonly isLoading = this.addressesService.isLoading;
  readonly selectedAddress = this.addressesService.selectedAddress;
  readonly modalOpen = signal(false);
  readonly modalView = signal<AddressModalView>('list');
  readonly modalMode = signal<AddressModalMode>('add');
  readonly modalStep = signal<1 | 2>(1);
  readonly editingAddressId = signal<string | null>(null);
  readonly deleteTarget = signal<AddressItem | null>(null);
  readonly mapLoaded = signal(false);

  readonly modalTitleKey = computed(() =>
    this.modalMode() === 'add'
      ? 'ADDRESSES.MODAL.ADD_TITLE'
      : 'ADDRESSES.MODAL.EDIT_TITLE',
  );

  readonly form = this.formBuilder.nonNullable.group({
    title: ['Home'],
    isPrimary: [false],
    city: ['', Validators.required],
    street: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]],
    latitude: [30.0444, Validators.required],
    longitude: [31.2357, Validators.required],
  });

  readonly mapCenter = computed(() => ({
    lat: this.form.controls.latitude.value,
    lng: this.form.controls.longitude.value,
  }));

  ngOnInit(): void {
    this.addressesService.loadAddresses();
  }

  openAddressesModal(): void {
    this.modalView.set('list');
    this.modalStep.set(1);
    this.modalOpen.set(true);
  }

  openAddModal(): void {
    this.modalView.set('form');
    this.modalMode.set('add');
    this.editingAddressId.set(null);
    this.modalStep.set(1);
    this.form.reset({
      title: 'Home',
      isPrimary: this.addresses().length === 0,
      city: '',
      street: '',
      phone: '',
      latitude: 30.0444,
      longitude: 31.2357,
    });
    this.modalOpen.set(true);
  }

  openEditModal(address: AddressItem): void {
    this.prepareEditModal(address);
    this.addressesService.getAddressById(address.id).subscribe({
      next: (freshAddress) => this.populateEditForm(freshAddress),
      error: () => undefined,
    });
  }

  private prepareEditModal(address: AddressItem): void {
    this.modalView.set('form');
    this.modalMode.set('edit');
    this.editingAddressId.set(address.id);
    this.modalStep.set(1);
    this.populateEditForm(address);
    this.modalOpen.set(true);
  }

  private populateEditForm(address: AddressItem): void {
    this.form.setValue({
      title: address.title,
      isPrimary: address.isPrimary,
      city: address.city,
      street: address.street,
      phone: address.phone,
      latitude: address.latitude,
      longitude: address.longitude,
    });
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  goToMapStep(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.modalStep.set(2);
    void this.mapsLoader.load().then(() => {
      this.mapLoaded.set(true);
      setTimeout(() => this.renderMap());
    });
  }

  goToDetailsStep(): void {
    this.modalStep.set(1);
  }

  useCurrentLocation(): void {
    navigator.geolocation?.getCurrentPosition((position) => {
      this.form.patchValue({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      this.renderMap();
    });
  }

  saveAddress(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.modalStep.set(1);
      return;
    }

    const value = this.form.getRawValue();
    const payload: AddressPayload = {
      title: value.title || 'Home',
      isPrimary: value.isPrimary,
      city: value.city,
      street: value.street,
      phone: value.phone,
      latitude: value.latitude,
      longitude: value.longitude,
    };

    const editingId = this.editingAddressId();
    const request =
      this.modalMode() === 'edit' && editingId
        ? this.addressesService.updateAddress(editingId, payload)
        : this.addressesService.addAddress(payload);

    request.subscribe({
      next: () => this.closeModal(),
      error: () => undefined,
    });
  }

  selectAddress(id: string): void {
    this.addressesService.selectAddress(id);
  }

  requestDelete(address: AddressItem): void {
    this.deleteTarget.set(address);
  }

  cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  confirmDelete(): void {
    const target = this.deleteTarget();

    if (!target) {
      return;
    }

    this.addressesService.deleteAddress(target.id).subscribe({
      next: () => this.deleteTarget.set(null),
      error: () => undefined,
    });
  }

  isSelected(address: AddressItem): boolean {
    return this.selectedAddress()?.id === address.id;
  }

  controlInvalid(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  private renderMap(): void {
    const element = this.mapCanvas?.nativeElement;
    const win = window as Window & { google?: any };

    if (!element || !win.google?.maps) {
      return;
    }

    const map = new win.google.maps.Map(element, {
      center: this.mapCenter(),
      disableDefaultUI: true,
      zoom: 13,
      zoomControl: true,
    });
    const marker = new win.google.maps.Marker({
      map,
      position: this.mapCenter(),
    });

    map.addListener(
      'click',
      (event: { latLng?: { lat: () => number; lng: () => number } }) => {
        if (!event.latLng) {
          return;
        }

        const position = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };

        this.form.patchValue({
          latitude: position.lat,
          longitude: position.lng,
        });
        marker.setPosition(position);
        map.panTo(position);
      },
    );
  }
}
