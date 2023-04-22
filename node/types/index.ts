import { Request } from "express";

interface CategoryType {
  name: string;
  slug: string;
  subCategories: string[];
}
interface ProductType {
  name: string;
  slug: string;
  price: number;
  category: string[];
  description: string;
  rating: number;
  images: string[];
  reviews: string[];
  weight: number;
  count: number;
  shop: string;
  guarantee: number;
  expirationData: string;
  dateOfManufacture: string;
}
interface AdminType {
  login: string;
  password: string;
}
type NodeRequest = Request & {
  user?: string;
  vendor?: string;
};
export type { CategoryType, ProductType, AdminType, NodeRequest };
