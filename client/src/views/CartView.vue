<script setup>
import { ref } from 'vue'
import {
  state,
  cartLines,
  cartSubtotal,
  cartTotal,
  discountRate,
  setQty,
  removeFromCart,
  applyCoupon,
} from '../store'
import { formatPrice } from '../catalog'
import ProductArt from '../components/ProductArt.vue'

const code = ref(state.coupon || '')
</script>

<template>
  <main class="cart">
    <h1>Your bag</h1>
    <div v-if="!cartLines.length" class="empty">
      <p>Bag is empty.</p>
      <RouterLink class="primary" to="/">Continue shopping</RouterLink>
    </div>
    <div v-else class="layout">
      <div class="lines">
        <article v-for="line in cartLines" :key="line.productId" class="line">
          <div class="thumb">
            <ProductArt :image="line.product.image" />
          </div>
          <div class="meta">
            <h2>{{ line.product.name }}</h2>
            <p>{{ formatPrice(line.product.price) }}</p>
            <div class="qty">
              <button type="button" @click="setQty(line.productId, line.qty - 1)">−</button>
              <span>{{ line.qty }}</span>
              <button type="button" @click="setQty(line.productId, line.qty + 1)">+</button>
              <button type="button" class="rm" @click="removeFromCart(line.productId)">Remove</button>
            </div>
          </div>
          <strong>{{ formatPrice(line.lineTotal) }}</strong>
        </article>
      </div>
      <aside class="summary">
        <h2>Summary</h2>
        <div class="row">
          <span>Subtotal</span>
          <b>{{ formatPrice(cartSubtotal) }}</b>
        </div>
        <div class="coupon">
          <input v-model="code" placeholder="Coupon (LUMEN10 / STONE15)" />
          <button type="button" @click="applyCoupon(code)">Apply</button>
        </div>
        <div v-if="discountRate" class="row">
          <span>Discount</span>
          <b>−{{ Math.round(discountRate * 100) }}%</b>
        </div>
        <div class="row">
          <span>Total</span>
          <b>{{ formatPrice(cartTotal) }}</b>
        </div>
        <p class="note">Shipping calculated at checkout (demo).</p>
        <RouterLink class="primary" to="/checkout">Checkout</RouterLink>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.cart {
  padding: 24px clamp(16px, 4vw, 40px) 48px;
}
h1 {
  margin: 0 0 22px;
  font-family: var(--display);
  font-size: 2rem;
}
.empty {
  display: grid;
  gap: 14px;
  justify-items: start;
  color: var(--muted);
}
.layout {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 22px;
  align-items: start;
}
@media (max-width: 860px) {
  .layout { grid-template-columns: 1fr; }
}
.lines { display: grid; gap: 12px; }
.line {
  display: grid;
  grid-template-columns: 88px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: color-mix(in srgb, var(--panel) 90%, transparent);
}
.thumb { border-radius: 12px; overflow: hidden; }
.meta h2 { margin: 0 0 4px; font-size: 1.05rem; }
.meta p { margin: 0; color: var(--muted); }
.qty { display: flex; gap: 8px; align-items: center; margin-top: 10px; }
.qty button {
  width: 30px; height: 30px; border-radius: 8px; border: 1px solid var(--line); background: transparent;
}
.rm { width: auto !important; padding: 0 10px; color: var(--muted); }
.summary {
  padding: 18px;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--panel) 92%, transparent);
  display: grid;
  gap: 12px;
}
.summary h2 { margin: 0; font-size: 1.1rem; }
.row { display: flex; justify-content: space-between; }
.coupon { display: flex; gap: 8px; }
.coupon input {
  flex: 1; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--line); background: transparent;
}
.coupon button {
  padding: 10px 12px; border-radius: 10px; border: 1px solid var(--line); background: transparent; font-weight: 600;
}
.note { margin: 0; color: var(--muted); font-size: 0.88rem; }
.primary {
  display: inline-flex; justify-content: center; padding: 12px 16px; border-radius: 999px;
  background: var(--ink); color: #fff; text-decoration: none; font-weight: 700;
}
</style>
