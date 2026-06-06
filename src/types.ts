export interface MenuItem {
  id: string;
  name: string;
  category: MenuItemCategory;
  price: number; // in KES
  calories: number; // in kcal
  image: string;
  description: string;
  popular: boolean;
  rating?: number;
}

export type MenuItemCategory =
  | 'Fried Chicken'
  | 'Burgers'
  | 'Wraps'
  | 'Fries'
  | 'Drinks'
  | 'Buckets'
  | 'Family Meals'
  | 'Desserts';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // percentage (e.g. 20) or KES (e.g. 150)
  minSpend?: number;
}

export interface OrderDetails {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  deliveryMethod: 'delivery' | 'pickup';
  address?: string;
  branch: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'mpesa' | 'visa' | 'mastercard';
  mpesaNumber?: string;
  status: 'pending' | 'mpesa_prompt' | 'preparing' | 'in_transit' | 'ready_for_pickup' | 'delivered';
  etaMinutes: number;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  coords: { lat: number; lng: number };
  phone: string;
  hours: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string; // Full-time / Part-time
  salaryRange?: string;
  description: string;
  requirements: string[];
}

export interface CareerApplication {
  fullName: string;
  email: string;
  phone: string;
  positionId: string;
  resumeUrl?: string;
  experienceYears: number;
  branchPreference: string;
  coverLetter: string;
}

export interface AIRecommendationRequest {
  budgetKES: number;
  dietary: 'none' | 'halal' | 'vegetarian' | 'spicy-lover';
  hungerLevel: 'snack' | 'medium' | 'starving';
  mood: 'adventure' | 'classic' | 'comfort' | 'family-deal';
}

export interface AIRecommendationResponse {
  recommendedItemIds: string[];
  reasoning: string;
  comboOfferDescription?: string;
  discountAppliedPercentage?: number;
}
