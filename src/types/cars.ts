

export interface CarType {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CarItem {
  id: number;
  name: string;
  images: string[];
  fuel_capacity: number;
  car_type: CarType;
  description: string;
  price_per_day: number;
  is_liked: boolean;
  original_price: number;
  fuel_type: string;
  transmission: string;
  capacity: number;
}