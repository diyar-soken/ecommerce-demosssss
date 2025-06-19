import { Product } from './product.model';

export interface CartItem {
  id: number;
  product?: Product; // Opzionale per compatibilità con il server
  productId?: number; // Per il carrello locale
  productName?: string; // Per il carrello locale
  productPrice?: number; // Per il carrello locale
  productImageUrl?: string; // Per il carrello locale
  quantity: number;
}
