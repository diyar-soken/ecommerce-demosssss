export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  province: string;
  country: string;
  phoneNumber: string;
}

export interface Order {
  id: number;
  date: Date;
  total: number;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
}

export interface CheckoutRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}
