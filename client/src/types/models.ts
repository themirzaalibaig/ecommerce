// Base interface for all models
export interface BaseModel {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Role = 'admin' | 'user';

export type Size = 'xs' | 's' | 'm' | 'l' | 'xl';

export interface Image {
  url: string;
  public_id: string;
}

export interface User extends BaseModel {
  username: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  isActive: boolean;
  image: Image;
}

export interface Category extends BaseModel {
  name: string;
  slug: string;
  description: string;
  image: Image;
}

export interface Product extends BaseModel {
  name: string;
  slug: string;
  description: string;
  price: number;
  tags: string[];
  color: string[];
  thumbnail: Image;
  images: Image[];
  stock: number;
  category: Category;
  size: Size[];
  inStock: boolean;
  totalStock: number;
  totalSold: number;
}
