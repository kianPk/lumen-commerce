import { computed, reactive } from 'vue'
import { CATALOG, CATEGORIES } from './catalog'

const CART_KEY = 'lumen_cart'
const WISH_KEY = 'lumen_wish'
const COUPONS = { LUMEN10: 0.1, STONE15: 0.15 }

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  } catch {
    return []
  }
}

function loadWish() {
  try {
    return JSON.parse(localStorage.getItem(WISH_KEY) || '[]')
  } catch {
    return []
  }
}

export const state = reactive({
  products: structuredClone(CATALOG),
  categories: [...CATEGORIES],
  cart: loadCart(),
  wishlist: loadWish(),
  coupon: '',
  query: '',
  category: 'all',
  sort: 'featured',
  lastOrder: null,
  toast: null,
})

function persist() {
  localStorage.setItem(CART_KEY, JSON.stringify(state.cart))
  localStorage.setItem(WISH_KEY, JSON.stringify(state.wishlist))
}

export function toast(msg) {
  state.toast = { msg, id: Date.now() }
  setTimeout(() => {
    if (state.toast?.msg === msg) state.toast = null
  }, 2400)
}

export const filtered = computed(() => {
  let list = [...state.products]
  if (state.category !== 'all') list = list.filter((p) => p.category === state.category)
  if (state.query.trim()) {
    const q = state.query.trim().toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.includes(q),
    )
  }
  if (state.sort === 'price_asc') list.sort((a, b) => a.price - b.price)
  if (state.sort === 'price_desc') list.sort((a, b) => b.price - a.price)
  if (state.sort === 'rating') list.sort((a, b) => b.rating - a.rating)
  return list
})

export const cartCount = computed(() => state.cart.reduce((n, i) => n + i.qty, 0))

export const cartSubtotal = computed(() =>
  state.cart.reduce((sum, i) => {
    const p = state.products.find((x) => x.id === i.productId)
    return sum + (p ? p.price * i.qty : 0)
  }, 0),
)

export const discountRate = computed(() => COUPONS[state.coupon.trim().toUpperCase()] || 0)

export const cartTotal = computed(() => {
  const sub = cartSubtotal.value
  return Math.round(sub * (1 - discountRate.value))
})

export function toggleWishlist(productId) {
  const i = state.wishlist.indexOf(productId)
  if (i >= 0) state.wishlist.splice(i, 1)
  else state.wishlist.push(productId)
  persist()
  toast(i >= 0 ? 'Removed from wishlist' : 'Saved to wishlist')
}

export function applyCoupon(code) {
  state.coupon = (code || '').trim().toUpperCase()
  if (discountRate.value) toast(`Coupon ${state.coupon} applied`)
  else if (state.coupon) toast('Unknown coupon')
}

export const cartLines = computed(() =>
  state.cart
    .map((i) => {
      const product = state.products.find((x) => x.id === i.productId)
      if (!product) return null
      return { ...i, product, lineTotal: product.price * i.qty }
    })
    .filter(Boolean),
)

export function addToCart(productId, qty = 1) {
  const line = state.cart.find((i) => i.productId === productId)
  if (line) line.qty += qty
  else state.cart.push({ productId, qty })
  persist()
  toast('Added to bag')
}

export function setQty(productId, qty) {
  const line = state.cart.find((i) => i.productId === productId)
  if (!line) return
  line.qty = Math.max(1, Math.min(20, qty))
  persist()
}

export function removeFromCart(productId) {
  state.cart = state.cart.filter((i) => i.productId !== productId)
  persist()
}

export function clearCart() {
  state.cart = []
  persist()
}

export async function checkout({ name, email }) {
  // Prefer live API when available (dev proxy / VITE_API_URL)
  const base = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : null)
  if (base !== null) {
    try {
      const res = await fetch(`${base}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, items: state.cart }),
      })
      const data = await res.json()
      if (res.ok) {
        state.lastOrder = data.order
        clearCart()
        toast('Order confirmed')
        return data.order
      }
    } catch {
      /* fall through to local */
    }
  }

  const items = cartLines.value.map((l) => ({
    productId: l.productId,
    name: l.product.name,
    qty: l.qty,
    unitPrice: l.product.price,
    lineTotal: l.lineTotal,
  }))
  const order = {
    id: 'ord_demo_' + Math.random().toString(36).slice(2, 8),
    email,
    name,
    items,
    total: cartTotal.value,
    currency: 'IRR',
    status: 'confirmed',
    createdAt: Date.now(),
  }
  for (const line of items) {
    const p = state.products.find((x) => x.id === line.productId)
    if (p) p.stock = Math.max(0, p.stock - line.qty)
  }
  state.lastOrder = order
  clearCart()
  toast('Order confirmed (demo)')
  return order
}

export function productBySlug(slug) {
  return state.products.find((p) => p.slug === slug || p.id === slug)
}
