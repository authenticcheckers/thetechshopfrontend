export interface Product {
  id: number;
  name: string;
  description: string;
  specs: string | null;
  price: string;        // DB returns string
  stock: string | null;
  image_url: string;
}
