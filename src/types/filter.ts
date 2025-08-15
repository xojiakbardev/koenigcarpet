export interface IFilterCarType{
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  cars_count: number
}
export interface FilterData {
  car_types: IFilterCarType[];
  max_price: number;
  min_price: number;
  capacities: number[];
}
