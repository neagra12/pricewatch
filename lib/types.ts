## TypeScript Types (src/lib/types.ts)

```typescript
export type Category = 'LAPTOP' | 'HEADPHONE' | 'MONITOR';
export type Retailer = 'AMAZON' | 'BESTBUY' | 'NEWEGG' | 'BH_PHOTO';

export interface LaptopSpecs {
  processor: string;
  ram: string;
  storage: string;
  screenSize: string;
  gpu?: string;
  weight?: string;
}

export interface HeadphoneSpecs {
  type: 'over-ear' | 'on-ear' | 'in-ear';
  wireless: boolean;
  noiseCancellation: boolean;
  batteryLife?: string;
}

export interface MonitorSpecs {
  screenSize: string;
  resolution: string;
  refreshRate: string;
  panelType: string;
  ports: string[];
}

export interface ProductWithPrices {
  id: string;
  name: string;
  brand: string;
  category: Category;
  specs: LaptopSpecs | HeadphoneSpecs | MonitorSpecs;
  imageUrl?: string;
  prices: {
    retailer: Retailer;
    price: number;
    url: string;
    inStock: boolean;
  }[];
  lowestPrice?: number;
  highestPrice?: number;
}
```