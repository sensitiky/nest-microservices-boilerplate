import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Smartphone X',
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest smartphone with advanced features',
  })
  description: string;

  @ApiProperty({
    description: 'Product price in USD',
    example: 999.99,
    minimum: 0,
  })
  price: number;

  @ApiProperty({
    description: 'Product stock quantity',
    example: 100,
    minimum: 0,
  })
  stock: number;

  @ApiProperty({
    description: 'Product creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Product last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Smartphone X',
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest smartphone with advanced features',
  })
  description: string;

  @ApiProperty({
    description: 'Product price in USD',
    example: 999.99,
    minimum: 0,
  })
  price: number;

  @ApiProperty({
    description: 'Product stock quantity',
    example: 100,
    minimum: 0,
  })
  stock: number;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'Smartphone X',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Latest smartphone with advanced features',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Product price in USD',
    example: 999.99,
    minimum: 0,
  })
  price?: number;

  @ApiPropertyOptional({
    description: 'Product stock quantity',
    example: 100,
    minimum: 0,
  })
  stock?: number;
}
