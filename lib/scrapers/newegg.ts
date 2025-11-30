// lib/scrapers/newegg.ts
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Category } from '@prisma/client';

export interface ScrapedProduct {
  name: string;
  brand: string;
  model?: string;
  price: number;
  url: string;
  imageUrl?: string;
  inStock: boolean;
  category: Category;
  specs: Record<string, any>;
}

async function scrapeNewegg(query: string, category: Category): Promise<ScrapedProduct[]> {
  try {
    console.log(`Scraping Newegg for: ${query}`);
    
    const searchUrl = `https://www.newegg.com/p/pl?d=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const products: ScrapedProduct[] = [];

    $('.item-cell').each((index, element) => {
      if (products.length >= 10) return false;
      
      try {
        const $item = $(element);
        
        const name = $item.find('.item-title').text().trim();
        
        const priceText = $item.find('.price-current strong').text().trim() + 
                         $item.find('.price-current sup').text().trim();
        const price = parseFloat(priceText.replace(/[$,]/g, ''));
        
        let url = $item.find('.item-title').attr('href') || '';
        
        const imageUrl = $item.find('.item-img img').attr('src');
        
        const inStock = !$item.text().includes('OUT OF STOCK');
        
        const brand = name.split(' ')[0];
        
        if (name && !isNaN(price) && price > 0) {
          console.log(`Found Newegg product: ${name} - $${price}`);
          products.push({
            name,
            brand,
            price,
            url: url || 'https://www.newegg.com',
            imageUrl,
            inStock,
            category,
            specs: {
              scraped_at: new Date().toISOString(),
            },
          });
        }
      } catch (err) {
        console.error('Error parsing Newegg product:', err);
      }
    });

    if (products.length === 0) {
      console.log('No products found on Newegg, returning mock data');
      return generateMockNeweggProducts(category);
    }

    console.log(`Successfully scraped ${products.length} Newegg products`);
    return products;

  } catch (error) {
    console.error('Error scraping Newegg:', error);
    return generateMockNeweggProducts(category);
  }
}

function generateMockNeweggProducts(category: Category): ScrapedProduct[] {
  const mockProducts: Record<Category, ScrapedProduct[]> = {
    LAPTOP: [
      {
        name: 'ASUS TUF Gaming F15 FX507ZC4-ES51 15.6" 144 Hz Intel Core i5 12th Gen 12500H 2.50 GHz NVIDIA GeForce RTX 3050',
        brand: 'ASUS',
        price: 799.99,
        url: 'https://www.newegg.com',
        imageUrl: 'https://c1.neweggimages.com/ProductImageCompressAll1280/34-235-286-V01.jpg',
        inStock: true,
        category: 'LAPTOP',
        specs: { processor: 'Intel i5', ram: '8GB', gpu: 'RTX 3050' },
      },
      {
        name: 'MSI Thin GF63 15.6" FHD 144Hz Gaming Laptop: Intel Core i5-12450H RTX 4050 16GB 512GB NVMe SSD',
        brand: 'MSI',
        price: 799.00,
        url: 'https://www.newegg.com',
        imageUrl: 'https://c1.neweggimages.com/ProductImageCompressAll1280/34-156-092-V01.jpg',
        inStock: true,
        category: 'LAPTOP',
        specs: { processor: 'Intel i5', ram: '16GB', gpu: 'RTX 4050' },
      },
      {
        name: 'Acer Nitro 5 AN515-58-57Y8 Gaming Laptop Intel Core i5 12th Gen 12500H NVIDIA GeForce RTX 3050 Ti',
        brand: 'Acer',
        price: 849.99,
        url: 'https://www.newegg.com',
        imageUrl: 'https://c1.neweggimages.com/ProductImageCompressAll1280/34-316-952-V01.jpg',
        inStock: true,
        category: 'LAPTOP',
        specs: { processor: 'Intel i5', ram: '16GB', gpu: 'RTX 3050 Ti' },
      },
    ],
    HEADPHONE: [
      {
        name: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Bluetooth Headphones - Black',
        brand: 'Sony',
        price: 329.99,
        url: 'https://www.newegg.com',
        imageUrl: 'https://c1.neweggimages.com/ProductImageCompressAll1280/26-159-675-V01.jpg',
        inStock: true,
        category: 'HEADPHONE',
        specs: { type: 'over-ear', wireless: true, noiseCancellation: true },
      },
      {
        name: 'HyperX Cloud II Gaming Headset - 7.1 Surround Sound - Memory Foam Ear Pads',
        brand: 'HyperX',
        price: 69.99,
        url: 'https://www.newegg.com',
        imageUrl: 'https://c1.neweggimages.com/ProductImageCompressAll1280/26-738-003-V05.jpg',
        inStock: true,
        category: 'HEADPHONE',
        specs: { type: 'over-ear', wireless: false, noiseCancellation: false },
      },
      {
        name: 'Logitech G Pro X Gaming Headset with Blue VO!CE Mic Technology - Black',
        brand: 'Logitech',
        price: 89.99,
        url: 'https://www.newegg.com',
        imageUrl: 'https://c1.neweggimages.com/ProductImageCompressAll1280/26-197-417-V03.jpg',
        inStock: true,
        category: 'HEADPHONE',
        specs: { type: 'over-ear', wireless: false, noiseCancellation: false },
      },
    ],
    MONITOR: [
      {
        name: 'ASUS TUF Gaming VG27AQ 27" WQHD (2560 x 1440) 165Hz G-SYNC Compatible IPS Gaming Monitor',
        brand: 'ASUS',
        price: 279.99,
        url: 'https://www.newegg.com',
        imageUrl: 'https://c1.neweggimages.com/ProductImageCompressAll1280/24-281-035-V01.jpg',
        inStock: true,
        category: 'MONITOR',
        specs: { screenSize: '27"', resolution: '2560x1440', refreshRate: '165Hz' },
      },
      {
        name: 'AOC C24G1 24" Curved Frameless Gaming Monitor, FHD 1920x1080, 1ms, 144Hz, FreeSync',
        brand: 'AOC',
        price: 159.99,
        url: 'https://www.newegg.com',
        imageUrl: 'https://c1.neweggimages.com/ProductImageCompressAll1280/24-160-375-V01.jpg',
        inStock: true,
        category: 'MONITOR',
        specs: { screenSize: '24"', resolution: '1920x1080', refreshRate: '144Hz' },
      },
      {
        name: 'MSI Optix G273QPF 27" WQHD 2560 x 1440 (2K) 165Hz 1ms Rapid IPS Gaming Monitor',
        brand: 'MSI',
        price: 269.99,
        url: 'https://www.newegg.com',
        imageUrl: 'https://c1.neweggimages.com/ProductImageCompressAll1280/24-475-113-V01.jpg',
        inStock: true,
        category: 'MONITOR',
        specs: { screenSize: '27"', resolution: '2560x1440', refreshRate: '165Hz' },
      },
    ],
  };

  return mockProducts[category] || [];
}

export async function scrapeNeweggLaptops(query: string = 'laptop'): Promise<ScrapedProduct[]> {
  return scrapeNewegg(query, 'LAPTOP');
}

export async function scrapeNeweggHeadphones(query: string = 'headphones'): Promise<ScrapedProduct[]> {
  return scrapeNewegg(query, 'HEADPHONE');
}

export async function scrapeNeweggMonitors(query: string = 'monitor'): Promise<ScrapedProduct[]> {
  return scrapeNewegg(query, 'MONITOR');
}