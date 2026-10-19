import express from 'express'
import cors from 'cors'
import { z } from 'zod'
import { randomUUID } from 'crypto'

const PORT = process.env.PORT || 8791
const app = express()
app.use(cors())
app.use(express.json())

const products = [
  {
    id: 'lum-01',
    slug: 'aurora-desk-lamp',
    name: 'Aurora Desk Lamp',
    price: 890000,
    currency: 'IRR',
    category: 'lighting',
    rating: 4.8,
    stock: 24,
    tagline: 'Soft gradient glow for late builds',
    description:
      'Aluminum body, tunable warm-to-cool LEDs, USB-C power. Designed for long coding sessions without harsh glare.',
    image: 'lamp',
  },
  {
    id: 'lum-02',
    slug: 'nimbus-wool-throw',
    name: 'Nimbus Wool Throw',
    price: 1450000,
    currency: 'IRR',
    category: 'home',
    rating: 4.6,
    stock: 12,
    tagline: 'Heavyweight comfort, quiet texture',
    description: 'Italian wool blend, charcoal weave, oversized for sofa or studio chair.',
    image: 'throw',
  },
  {
    id: 'lum-03',
    slug: 'pulse-ceramic-mug',
    name: 'Pulse Ceramic Mug',
    price: 320000,
    currency: 'IRR',
    category: 'kitchen',
    rating: 4.9,
    stock: 60,
    tagline: 'Double-wall, keeps heat honest',
    description: 'Hand-glazed stoneware, 350ml, matte slate exterior with raw clay foot.',
    image: 'mug',
  },
  {
    id: 'lum-04',
    slug: 'folio-notebook',
    name: 'Folio Dot Notebook',
    price: 280000,
    currency: 'IRR',
    category: 'stationery',
    rating: 4.7,
    stock: 80,
    tagline: 'Lay-flat binding for system design',
    description: 'A5, 120gsm ivory paper, copper foil stamp, elastic closure.',
    image: 'notebook',
  },
  {
    id: 'lum-05',
    slug: 'drift-wireless-buds',
    name: 'Drift Wireless Buds',
    price: 4200000,
    currency: 'IRR',
    category: 'audio',
    rating: 4.5,
    stock: 18,
    tagline: 'Low-latency ANC for deep work',
    description: 'Bluetooth 5.3, transparency mode, 28h case battery, matte graphite.',
    image: 'buds',
  },
  {
    id: 'lum-06',
    slug: 'harbor-daypack',
    name: 'Harbor Daypack',
    price: 2750000,
    currency: 'IRR',
    category: 'bags',
    rating: 4.8,
    stock: 15,
    tagline: 'Laptop sleeve + field organization',
    description: 'Weatherproof shell, 16" laptop bay, hidden passport pocket, olive hardware.',
    image: 'pack',
  },
  {
    id: 'lum-07',
    slug: 'ember-pour-over',
    name: 'Ember Pour-Over Set',
    price: 980000,
    currency: 'IRR',
    category: 'kitchen',
    rating: 4.4,
    stock: 22,
    tagline: 'Glass carafe + steel dripper',
    description: 'Borosilicate 600ml carafe, precision dripper, bamboo tray.',
    image: 'coffee',
  },
  {
    id: 'lum-08',
    slug: 'signal-desk-mat',
    name: 'Signal Desk Mat',
    price: 540000,
    currency: 'IRR',
    category: 'desk',
    rating: 4.9,
    stock: 40,
    tagline: 'XL stitched edge, quiet glide',
    description: '900×400mm, natural rubber base, charcoal top with subtle grid.',
    image: 'mat',
  },
]

const orders = []

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'lumen-commerce' }))

app.get('/api/products', (req, res) => {
  let list = [...products]
  if (req.query.category) list = list.filter((p) => p.category === req.query.category)
  if (req.query.q) {
    const q = String(req.query.q).toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.includes(q),
    )
  }
  if (req.query.sort === 'price_asc') list.sort((a, b) => a.price - b.price)
  if (req.query.sort === 'price_desc') list.sort((a, b) => b.price - a.price)
  if (req.query.sort === 'rating') list.sort((a, b) => b.rating - a.rating)
  res.json({ products: list, categories: [...new Set(products.map((p) => p.category))] })
})

app.get('/api/products/:slug', (req, res) => {
  const product = products.find((p) => p.slug === req.params.slug || p.id === req.params.slug)
  if (!product) return res.status(404).json({ error: 'Not found' })
  res.json({ product })
})

app.post('/api/checkout', (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    items: z
      .array(
        z.object({
          productId: z.string(),
          qty: z.number().int().min(1).max(20),
        }),
      )
      .min(1),
  })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const lines = []
  let total = 0
  for (const item of parsed.data.items) {
    const product = products.find((p) => p.id === item.productId)
    if (!product) return res.status(400).json({ error: `Unknown product ${item.productId}` })
    if (product.stock < item.qty) return res.status(409).json({ error: `${product.name} is low on stock` })
    const lineTotal = product.price * item.qty
    total += lineTotal
    lines.push({
      productId: product.id,
      name: product.name,
      qty: item.qty,
      unitPrice: product.price,
      lineTotal,
    })
  }

  for (const line of lines) {
    const product = products.find((p) => p.id === line.productId)
    product.stock -= line.qty
  }

  const order = {
    id: 'ord_' + randomUUID().slice(0, 8),
    email: parsed.data.email,
    name: parsed.data.name,
    items: lines,
    total,
    currency: 'IRR',
    status: 'confirmed',
    createdAt: Date.now(),
  }
  orders.unshift(order)
  res.status(201).json({ order })
})

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find((o) => o.id === req.params.id)
  if (!order) return res.status(404).json({ error: 'Not found' })
  res.json({ order })
})

app.listen(PORT, () => console.log(`lumen-commerce api on :${PORT}`))
