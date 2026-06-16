import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { DeleteProductUseCase } from './delete-product.use-case';
import { IProductRepository } from '../../../domain/ports/out/product.repository.port';
import { ProductNotFoundException } from '../../../domain/exceptions/product-not-found.exception';
import { Product } from '../../../domain/aggregates/product.aggregate';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
  let mockRepo: IProductRepository;

  beforeEach(() => {
    mockRepo = {
      findById: mock(async () => null),
      findAll: mock(async () => []),
      save: mock(async () => undefined),
      delete: mock(async () => undefined),
    };
    useCase = new DeleteProductUseCase(mockRepo);
  });

  it('deletes product when found', async () => {
    const product = Product.create({
      name: 'W',
      description: 'D',
      price: 1,
      stock: 1,
    });
    mockRepo.findById = mock(async () => product);
    await useCase.execute(product.id);
    expect(mockRepo.delete).toHaveBeenCalledWith(product.id);
  });

  it('throws ProductNotFoundException and does not delete when not found', async () => {
    await expect(useCase.execute('missing')).rejects.toThrow(
      ProductNotFoundException,
    );
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });
});
