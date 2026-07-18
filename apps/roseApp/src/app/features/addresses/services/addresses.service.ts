import { Injectable, computed, signal } from '@angular/core';

import { AddressItem } from '../models/address.model';

@Injectable({ providedIn: 'root' })
export class AddressesService {
  private readonly items = signal<AddressItem[]>([
    {
      id: 'giza',
      label: 'Home',
      city: 'Giza',
      street: '21 Ahmed Mohamed St., King Faisal St., Giza',
      phone: '+201012346578',
      lat: 30.0131,
      lng: 31.2089,
    },
    {
      id: 'cairo',
      label: 'Work',
      city: 'Cairo',
      street: '14 Omar Ibn Alkhatab St., Ramsis St., Cairo',
      phone: '+201112345678',
      lat: 30.0444,
      lng: 31.2357,
    },
    {
      id: 'alexandria',
      label: 'Family',
      city: 'Alexandria',
      street: '16 El-Gaish Rd, San Stefano, El-Raml 2, Alexandria',
      phone: '+201512345678',
      lat: 31.2001,
      lng: 29.9187,
    },
  ]);

  private readonly selectedAddressId = signal('cairo');

  readonly addresses = this.items.asReadonly();
  readonly selectedAddress = computed(
    () =>
      this.items().find((address) => address.id === this.selectedAddressId()) ??
      this.items()[0] ??
      null,
  );

  selectAddress(id: string): void {
    this.selectedAddressId.set(id);
  }

  addAddress(address: Omit<AddressItem, 'id'>): void {
    const id = crypto.randomUUID();
    this.items.update((addresses) => [...addresses, { ...address, id }]);
    this.selectedAddressId.set(id);
  }

  updateAddress(id: string, updates: Omit<AddressItem, 'id'>): void {
    this.items.update((addresses) =>
      addresses.map((address) => (address.id === id ? { ...updates, id } : address)),
    );
    this.selectedAddressId.set(id);
  }

  deleteAddress(id: string): void {
    this.items.update((addresses) => addresses.filter((address) => address.id !== id));

    if (this.selectedAddressId() === id) {
      this.selectedAddressId.set(this.items()[0]?.id ?? '');
    }
  }
}
