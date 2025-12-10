export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  specs?: string; // ✅ add specs as optional
}
