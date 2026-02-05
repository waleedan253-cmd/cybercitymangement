// Type definitions for CyberCity application

export interface LaptopRange {
  id: string;
  name: string;
  min_price: number;
  max_price: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Laptop {
  id: string;
  range_id: string;
  image_url: string;
  image_name: string | null;
  upload_order: number;
  created_at: string;
}

export interface LaptopWithRange extends Laptop {
  laptop_ranges: LaptopRange;
}

export interface UploadFormData {
  rangeId: string;
  rangeName: string;
  minPrice: number;
  maxPrice: number;
  description: string;
  images: File[];
}

export interface RangeFilterData {
  rangeId: string;
  laptops: Laptop[];
  range: LaptopRange;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type PriceRangeOption = {
  label: string;
  value: string;
  minPrice: number;
  maxPrice: number;
};
