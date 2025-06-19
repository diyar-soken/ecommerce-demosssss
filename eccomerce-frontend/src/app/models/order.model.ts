export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
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
