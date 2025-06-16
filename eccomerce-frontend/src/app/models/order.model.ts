import { Product } from './product.model';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  date: Date;
  total: number;
  items: OrderItem[];
}

export interface CheckoutRequest {
  shippingAddress: string;
  paymentMethod: string;
}
