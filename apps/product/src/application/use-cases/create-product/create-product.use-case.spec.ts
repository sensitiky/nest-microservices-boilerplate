import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { CreateProductUseCase } from './create-product.use-case';
import { IProductRepository } from '../../../domain/ports/out/product.repository.port';
import { InvalidPriceException } from '../../../domain/exceptions/invalid-price.exception';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let mockRepo: IProductRepository;

  beforeEach(() => {
    mockRepo = {
      findById: mock(async () => null),
      findAll: mock(async () => []),
      save: mock(async () => undefined),
      delete: mock(async () => undefined),
    };
    useCase = new CreateProductUseCase(mockRepo);
  });

  it('creates product and returns snapshot-able product', async () => {
    const product = await useCase.execute({
      name: 'Widget',
      description: 'Desc',
      price: 9.99,
      stock: 10,
    });
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    expect(product.name).toBe('Widget');
  });

  it('throws InvalidPriceException for negative price', async () => {
    await expect(
      useCase.execute({
        name: 'Widget',
        description: 'Desc',
        price: -1,
        stock: 10,
      }),
    ).rejects.toThrow(InvalidPriceException);
  });
});
