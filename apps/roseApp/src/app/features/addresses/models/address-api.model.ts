export interface AddressApiResponse<T> {
  status: boolean;
  code: number;
  message: string;
  payload: T;
}

export interface AddressDto {
  id?: string;
  _id?: string;
  title?: string;
  isPrimary?: boolean;
  city?: string;
  street?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}

export interface AddressPayload {
  title: string;
  isPrimary: boolean;
  city: string;
  street: string;
  phone: string;
  latitude: number;
  longitude: number;
}

export type AddressListPayload =
  | AddressDto[]
  | {
      data?: AddressDto[];
      items?: AddressDto[];
      addresses?: AddressDto[];
    };
