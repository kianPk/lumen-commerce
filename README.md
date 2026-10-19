# Lumen Commerce

**Vue 3 storefront + Node checkout API** — catalog filters, persistent bag, product pages, and order confirmation. Runs offline on GitHub Pages; hits Express when available.

Live demo: **https://kianpk.github.io/lumen-commerce/**

![stack](https://img.shields.io/badge/Vue_3-Vite-42b883?style=flat-square)
![stack](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square)
![stack](https://img.shields.io/badge/Validation-Zod-3e67b1?style=flat-square)

## Features

- Hero storefront with expressive product art (no stock photo spam)
- Search, category, and sort controls
- Cart with qty controls + localStorage persistence
- Checkout flow with demo order IDs
- Express API: `GET /api/products`, `GET /api/products/:slug`, `POST /api/checkout`

## Quick start

```bash
cd server && npm install && node index.js
# → :8791

cd client && npm install && npm run dev
# → :5175
```

## Build Pages demo

```bash
cd client && npm run build
# → ../docs
```

## Author

[kianPk](https://github.com/kianPk)
