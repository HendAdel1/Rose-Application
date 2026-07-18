export interface AddressItem {
  id: string;
  label: string;
  city: string;
  street: string;
  phone: string;
  lat: number;
  lng: number;
}

export type AddressModalMode = 'add' | 'edit';
