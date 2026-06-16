export interface UpdateProductCommand {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}
