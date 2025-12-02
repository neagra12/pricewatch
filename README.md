# PriceWatch 💰

A modern electronics price comparison platform that helps users find the best deals across multiple retailers. Built with Next.js 15, TypeScript, and PostgreSQL.

![PriceWatch Homepage](https://pricewatch-pi.vercel.app/)
![Home Page](home.png)


## 🚀 Live Demo

[View Live Demo](https://pricewatch-pi.vercel.app/)

## ✨ Features

- **Multi-Retailer Price Comparison** - Compare prices from Best Buy, Amazon, and Newegg
- **Real-Time Price Tracking** - Automated scraping and price history tracking
- **Smart Search** - Category-based search across laptops, headphones, and monitors
- **Price History** - Track price trends over time
- **Responsive Design** - Beautiful UI that works on all devices
- **Fast Performance** - Built with Next.js 15 and Turbopack

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (data visualization)
- Lucide React (icons)

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Supabase)
- Axios & Cheerio (web scraping)

**Deployment:**
- Vercel (hosting)
- Supabase (database)

## 📸 Screenshots

### Homepage
![Homepage](home.png)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Supabase account)

### Installation

1. Clone the repository
```bash
git clone https://github.com/neagra12/pricewatch.git
cd pricewatch
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:Neeha%40120@db.uuwwudhmsknyaqbasrkm.supabase.co:5432/postgres"
```

4. Set up the database
```bash
npx prisma db push
npx prisma generate
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure
```
pricewatch/
├── app/
│   ├── api/           # API routes
│   ├── products/      # Product detail pages
│   ├── search/        # Search results page
│   └── page.tsx       # Homepage
├── lib/
│   ├── scrapers/      # Web scrapers for each retailer
│   └── prisma.ts      # Prisma client
├── prisma/
│   └── schema.prisma  # Database schema
└── components/        # Reusable UI components
```

## 🔑 Key Features Explained

### Web Scraping
The app uses Axios and Cheerio to scrape product data from multiple retailers. When scraping is blocked (common with anti-bot measures), it falls back to mock data to demonstrate functionality.

### Price Tracking
Every time a product is scraped, the price is stored in a `PriceHistory` table, enabling price trend analysis over time.

### Smart Product Matching
Products from different retailers are matched and grouped together, allowing users to compare prices for the same item across multiple stores.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Neeha Agrawal**
- GitHub: [neagra12](https://github.com/neagra12)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/neeha-agrawal)
- Portfolio: [your-portfolio.com](https://neehaportfolio.vercel.app/)

## 🙏 Acknowledgments

- Product images from retailer websites
- Icons from [Lucide](https://lucide.dev)
- Inspiration from existing price comparison sites

---

⭐ If you found this project helpful, please give it a star!