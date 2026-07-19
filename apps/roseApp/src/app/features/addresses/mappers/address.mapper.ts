import {
  AddressApiResponse,
  AddressDto,
  AddressListPayload,
} from '../models/address-api.model';
import { AddressItem } from '../models/address.model';

export function toAddressItems(
  response: AddressApiResponse<AddressListPayload> | AddressDto[],
): AddressItem[] {
  const payload = Array.isArray(response) ? response : response.payload;
  const addresses = Array.isArray(payload)
    ? payload
    : (payload.data ?? payload.items ?? payload.addresses ?? []);

  return addresses.map(toAddressItem).filter((address) => address.id);
}

export function toAddressItem(
  response: AddressApiResponse<AddressDto> | AddressDto,
): AddressItem {
  const address = 'payload' in response ? response.payload : response;

  return {
    id: address.id ?? address._id ?? '',
    title: address.title ?? 'Home',
    isPrimary: Boolean(address.isPrimary),
    city: address.city ?? '',
    street: address.street ?? '',
    phone: address.phone ?? '',
    latitude: Number(address.latitude ?? 30.0444),
    longitude: Number(address.longitude ?? 31.2357),
  };
}
