import { BaseEntity } from './base.entity';
import { Entity, Column } from 'typeorm';

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;
}
