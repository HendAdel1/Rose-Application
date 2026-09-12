import { describe, it, expect } from 'vitest';
import { OccasionMapper } from './occasion.mapper';
import { OccasionDto } from '../models/occasion.model';

describe('OccasionMapper', () => {
  it('should map a single OccasionDto to OccasionRow', () => {
    const dto: OccasionDto = {
      _id: 'occ-123',
      title: 'Mother Day',
      productsCount: 15,
      description: 'Gifts for mothers',
      image: 'https://cdn/mom.png',
      immutable: true,
    };

    const row = OccasionMapper.toUiModel(dto);

    expect(row).toEqual({
      id: 'occ-123',
      name: 'Mother Day',
      products: 15,
      description: 'Gifts for mothers',
      image: 'https://cdn/mom.png',
      immutable: true,
      raw: dto,
    });
  });

  it('should map a list of OccasionDto items', () => {
    const dtoList: OccasionDto[] = [
      { id: '1', title: 'A', _count: { products: 2 } },
      { _id: '2', title: 'B', productCount: 3 },
    ];

    const list = OccasionMapper.toUiModelList(dtoList);

    expect(list.length).toBe(2);
    expect(list[0].id).toBe('1');
    expect(list[0].products).toBe(2);
    expect(list[1].id).toBe('2');
    expect(list[1].products).toBe(3);
  });

  it('should handle empty or null lists gracefully', () => {
    expect(OccasionMapper.toUiModelList([] as any)).toEqual([]);
    expect(OccasionMapper.toUiModelList(null as any)).toEqual([]);
  });
});
