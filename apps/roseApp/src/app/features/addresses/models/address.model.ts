export interface AddressItem {
  id: string;
  title: string;
  isPrimary: boolean;
  city: string;
  street: string;
  phone: string;
  latitude: number;
  longitude: number;
}

export type AddressModalMode = 'add' | 'edit';
