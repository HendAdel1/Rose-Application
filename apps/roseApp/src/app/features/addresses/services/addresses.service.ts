import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, finalize, map, take, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { toAddressItem, toAddressItems } from '../mappers/address.mapper';
import {
  AddressApiResponse,
  AddressDto,
  AddressListPayload,
  AddressPayload,
} from '../models/address-api.model';
import { AddressItem } from '../models/address.model';

@Injectable({ providedIn: 'root' })
export class AddressesService {
  private readonly http = inject(HttpClient);
  private readonly addressesUrl = `${environment.apiBaseUrl}/addresses`;
  private readonly items = signal<AddressItem[]>([]);
  private readonly selectedAddressId = signal<string | null>(null);

  readonly addresses = this.items.asReadonly();
  readonly isLoading = signal(false);
  readonly selectedAddress = computed(
    () =>
      this.items().find((address) => address.id === this.selectedAddressId()) ??
      this.items()[0] ??
      null,
  );

  selectAddress(id: string): void {
    this.selectedAddressId.set(id);
  }

  loadAddresses(): void {
    this.isLoading.set(true);
    this.http
      .get<AddressApiResponse<AddressListPayload> | AddressDto[]>(
        this.addressesUrl,
      )
      .pipe(
        map(toAddressItems),
        take(1),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (addresses) => {
          this.items.set(addresses);
          this.ensureSelectedAddress();
        },
        error: () => undefined,
      });
  }

  getAddressById(id: string): Observable<AddressItem> {
    return this.http
      .get<
        AddressApiResponse<AddressDto> | AddressDto
      >(`${this.addressesUrl}/${id}`)
      .pipe(
        map(toAddressItem),
        tap((address) => this.upsertAddress(address)),
      );
  }

  addAddress(address: AddressPayload): Observable<AddressItem> {
    return this.http
      .post<
        AddressApiResponse<AddressDto> | AddressDto
      >(this.addressesUrl, address)
      .pipe(
        map(toAddressItem),
        tap((createdAddress) => {
          this.upsertAddress(createdAddress);
          this.selectedAddressId.set(createdAddress.id);
        }),
      );
  }

  updateAddress(id: string, updates: AddressPayload): Observable<AddressItem> {
    return this.http
      .patch<
        AddressApiResponse<AddressDto> | AddressDto
      >(`${this.addressesUrl}/${id}`, updates)
      .pipe(
        map(toAddressItem),
        tap((updatedAddress) => {
          this.upsertAddress({
            ...updatedAddress,
            id: updatedAddress.id || id,
          });
          this.selectedAddressId.set(updatedAddress.id || id);
        }),
      );
  }

  deleteAddress(id: string): Observable<void> {
    return this.http.delete<void>(`${this.addressesUrl}/${id}`).pipe(
      tap(() => {
        this.items.update((addresses) =>
          addresses.filter((address) => address.id !== id),
        );

        if (this.selectedAddressId() === id) {
          this.selectedAddressId.set(this.items()[0]?.id ?? null);
        }
      }),
    );
  }

  private upsertAddress(address: AddressItem): void {
    if (!address.id) {
      return;
    }

    this.items.update((addresses) => {
      const exists = addresses.some((item) => item.id === address.id);
      return exists
        ? addresses.map((item) => (item.id === address.id ? address : item))
        : [address, ...addresses];
    });
  }

  private ensureSelectedAddress(): void {
    const addresses = this.items();

    if (!addresses.length) {
      this.selectedAddressId.set(null);
      return;
    }

    const selectedExists = addresses.some(
      (address) => address.id === this.selectedAddressId(),
    );

    if (!selectedExists) {
      this.selectedAddressId.set(
        addresses.find((address) => address.isPrimary)?.id ?? addresses[0].id,
      );
    }
  }
}
