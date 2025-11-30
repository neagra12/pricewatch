// lib/scrapers/amazon.ts
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

async function scrapeAmazon(query: string, category: Category): Promise<ScrapedProduct[]> {
  try {
    console.log(`Scraping Amazon for: ${query}`);
    
    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const products: ScrapedProduct[] = [];

    $('[data-component-type="s-search-result"]').each((index, element) => {
      if (products.length >= 10) return false;
      
      try {
        const $item = $(element);
        
        const name = $item.find('h2 a span').text().trim() ||
                    $item.find('.a-text-normal').text().trim();
        
        const priceWhole = $item.find('.a-price-whole').first().text().trim();
        const priceFraction = $item.find('.a-price-fraction').first().text().trim();
        const priceText = priceWhole + (priceFraction || '00');
        const price = parseFloat(priceText.replace(/[,$]/g, ''));
        
        let url = $item.find('h2 a').attr('href') || '';
        if (url && !url.startsWith('http')) {
          url = 'https://www.amazon.com' + url;
        }
        
        const imageUrl = $item.find('.s-image').attr('src');
        
        const inStock = !$item.text().includes('Currently unavailable');
        
        const brand = name.split(' ')[0];
        
        if (name && !isNaN(price) && price > 0) {
          console.log(`Found Amazon product: ${name} - $${price}`);
          products.push({
            name,
            brand,
            price,
            url: url || 'https://www.amazon.com',
            imageUrl,
            inStock,
            category,
            specs: {
              scraped_at: new Date().toISOString(),
            },
          });
        }
      } catch (err) {
        console.error('Error parsing Amazon product:', err);
      }
    });

    if (products.length === 0) {
      console.log('No products found on Amazon, returning mock data');
      return generateMockAmazonProducts(category);
    }

    console.log(`Successfully scraped ${products.length} Amazon products`);
    return products;

  } catch (error) {
    console.error('Error scraping Amazon:', error);
    return generateMockAmazonProducts(category);
  }
}

function generateMockAmazonProducts(category: Category): ScrapedProduct[] {
  const mockProducts: Record<Category, ScrapedProduct[]> = {
    LAPTOP: [
      {
        name: 'Acer Aspire 5 A515-57-53T1 Slim Laptop - 15.6" Full HD IPS Display - 12th Gen Intel i5-1235U - 8GB DDR4 - 512GB NVMe SSD',
        brand: 'Acer',
        price: 499.99,
        url: 'https://www.amazon.com',
        imageUrl: 'https://m.media-amazon.com/images/I/71czGb00k5L._AC_SL1500_.jpg',
        inStock: true,
        category: 'LAPTOP',
        specs: { processor: 'Intel i5', ram: '8GB', storage: '512GB SSD' },
      },
      {
        name: 'Lenovo IdeaPad 3 Laptop, 15.6" FHD Touchscreen Display, Intel Core i5-1135G7, 20GB RAM, 1TB PCIe SSD',
        brand: 'Lenovo',
        price: 629.99,
        url: 'https://www.amazon.com',
        imageUrl: 'https://m.media-amazon.com/images/I/61z40AcpiEL._AC_SL1280_.jpg',
        inStock: true,
        category: 'LAPTOP',
        specs: { processor: 'Intel i5', ram: '20GB', storage: '1TB SSD' },
      },
      {
        name: 'MSI GF63 Thin Gaming Laptop - Intel Core i5-11400H - NVIDIA GeForce GTX 1650 - 15.6" 144Hz Display - 8GB RAM - 256GB NVMe SSD',
        brand: 'MSI',
        price: 699.99,
        url: 'https://www.amazon.com',
        imageUrl: 'https://m.media-amazon.com/images/I/81xrUB3EQML._AC_SL1500_.jpg',
        inStock: true,
        category: 'LAPTOP',
        specs: { processor: 'Intel i5', ram: '8GB', gpu: 'GTX 1650' },
      },
    ],
    HEADPHONE: [
      {
        name: 'Sony WH-1000XM4 Wireless Premium Noise Canceling Overhead Headphones with Mic - Black',
        brand: 'Sony',
        price: 279.99,
        url: 'https://www.amazon.com',
        imageUrl: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg',
        inStock: true,
        category: 'HEADPHONE',
        specs: { type: 'over-ear', wireless: true, noiseCancellation: true },
      },
      {
        name: 'Bose QuietComfort 45 Bluetooth Wireless Noise Cancelling Headphones - Triple Black',
        brand: 'Bose',
        price: 279.00,
        url: 'https://www.amazon.com',
        imageUrl: 'https://m.media-amazon.com/images/I/51JNo76GFOL._AC_SL1200_.jpg',
        inStock: true,
        category: 'HEADPHONE',
        specs: { type: 'over-ear', wireless: true, noiseCancellation: true },
      },
      {
        name: 'Anker Soundcore Life Q30 Hybrid Active Noise Cancelling Headphones with Multiple Modes',
        brand: 'Anker',
        price: 79.99,
        url: 'https://www.amazon.com',
        imageUrl: 'https://m.media-amazon.com/images/I/61L1e+1rGVL._AC_SL1500_.jpg',
        inStock: true,
        category: 'HEADPHONE',
        specs: { type: 'over-ear', wireless: true, noiseCancellation: true },
      },
    ],
    MONITOR: [
      {
        name: 'ASUS VA24EHE 23.8" Monitor, 1080P Full HD, 75Hz, IPS, Adaptive-Sync/FreeSync, Eye Care',
        brand: 'ASUS',
        price: 109.99,
        url: 'https://www.amazon.com',
        imageUrl: 'https://m.media-amazon.com/images/I/81SBIk7YloL._AC_SL1500_.jpg',
        inStock: true,
        category: 'MONITOR',
        specs: { screenSize: '23.8"', resolution: '1920x1080', refreshRate: '75Hz' },
      },
      {
        name: 'LG 27GN800-B 27 Inch Ultragear Gaming Monitor with 1 ms Response Time, QHD (2560 x 1440)',
        brand: 'LG',
        price: 279.99,
        url: 'https://www.amazon.com',
        imageUrl: 'https://m.media-amazon.com/images/I/81e89YiCDeL._AC_SL1500_.jpg',
        inStock: true,
        category: 'MONITOR',
        specs: { screenSize: '27"', resolution: '2560x1440', refreshRate: '144Hz' },
      },
      {
        name: 'Samsung 32" M8 Smart Monitor & Streaming TV (Warm White) 4K UHD',
        brand: 'Samsung',
        price: 449.99,
        url: 'https://www.amazon.com',
        imageUrl: 'https://m.media-amazon.com/images/I/71hZDIvHFbL._AC_SL1500_.jpg',
        inStock: true,
        category: 'MONITOR',
        specs: { screenSize: '32"', resolution: '3840x2160', refreshRate: '60Hz' },
      },
    ],
  };

  return mockProducts[category] || [];
}

export async function scrapeAmazonLaptops(query: string = 'laptop'): Promise<ScrapedProduct[]> {
  return scrapeAmazon(query, 'LAPTOP');
}

export async function scrapeAmazonHeadphones(query: string = 'headphones'): Promise<ScrapedProduct[]> {
  return scrapeAmazon(query, 'HEADPHONE');
}

export async function scrapeAmazonMonitors(query: string = 'monitor'): Promise<ScrapedProduct[]> {
  return scrapeAmazon(query, 'MONITOR');
}