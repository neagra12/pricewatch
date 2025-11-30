// app/api/scrape/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  scrapeBestBuyLaptops, 
  scrapeBestBuyHeadphones, 
  scrapeBestBuyMonitors 
} from '@/lib/scrapers/bestbuy';
import { 
  scrapeAmazonLaptops, 
  scrapeAmazonHeadphones, 
  scrapeAmazonMonitors 
} from '@/lib/scrapers/amazon';
import { 
  scrapeNeweggLaptops, 
  scrapeNeweggHeadphones, 
  scrapeNeweggMonitors 
} from '@/lib/scrapers/newegg';

export async function POST(request: NextRequest) {
  try {
    const { category, query } = await request.json();

    console.log(`=== Starting scrape for ${category} ===`);

    let bestBuyProducts: any[] = [];
    let amazonProducts: any[] = [];
    let neweggProducts: any[] = [];

    // Choose scraper based on category
    if (category === 'LAPTOP') {
      [bestBuyProducts, amazonProducts, neweggProducts] = await Promise.all([
        scrapeBestBuyLaptops(query || 'laptop'),
        scrapeAmazonLaptops(query || 'laptop'),
        scrapeNeweggLaptops(query || 'laptop'),
      ]);
    } else if (category === 'HEADPHONE') {
      [bestBuyProducts, amazonProducts, neweggProducts] = await Promise.all([
        scrapeBestBuyHeadphones(query || 'headphones'),
        scrapeAmazonHeadphones(query || 'headphones'),
        scrapeNeweggHeadphones(query || 'headphones'),
      ]);
    } else if (category === 'MONITOR') {
      [bestBuyProducts, amazonProducts, neweggProducts] = await Promise.all([
        scrapeBestBuyMonitors(query || 'monitor'),
        scrapeAmazonMonitors(query || 'monitor'),
        scrapeNeweggMonitors(query || 'monitor'),
      ]);
    }

    console.log(`BestBuy: ${bestBuyProducts.length}, Amazon: ${amazonProducts.length}, Newegg: ${neweggProducts.length}`);

    const results = [];

    // Helper function to save product
    const saveProduct = async (product: any, retailer: string) => {
      console.log(`Processing: ${product.name} - $${product.price} from ${retailer}`);
      
      const dbProduct = await prisma.product.create({
        data: {
          name: product.name,
          brand: product.brand,
          model: product.model,
          category: product.category,
          specs: product.specs,
          imageUrl: product.imageUrl,
          prices: {
            create: {
              retailer: retailer as any,
              price: product.price,
              url: product.url,
              inStock: product.inStock,
            }
          },
          priceHistory: {
            create: {
              retailer: retailer as any,
              price: product.price,
            }
          }
        },
        include: {
          prices: true,
        }
      });

      console.log(`✓ Saved ${dbProduct.name} with price $${dbProduct.prices[0].price}`);
      return dbProduct;
    };

    // Process all products
    for (const product of bestBuyProducts) {
      const saved = await saveProduct(product, 'BESTBUY');
      results.push(saved);
    }

    for (const product of amazonProducts) {
      const saved = await saveProduct(product, 'AMAZON');
      results.push(saved);
    }

    for (const product of neweggProducts) {
      const saved = await saveProduct(product, 'NEWEGG');
      results.push(saved);
    }

    console.log(`=== Saved ${results.length} products total ===`);

    const productsWithPrice = results.map(p => ({
      ...p,
      currentPrice: p.prices[0]?.price || 0,
    }));

    return NextResponse.json({
      success: true,
      count: productsWithPrice.length,
      products: productsWithPrice,
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const products = await prisma.product.findMany({
      where: category ? { category: category as any } : undefined,
      include: {
        prices: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}