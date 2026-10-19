<script setup>
import { cartLines, cartTotal, setQty, removeFromCart } from '../store'
import { formatPrice } from '../catalog'
import ProductArt from '../components/ProductArt.vue'
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
  grid-template-columns: 1.4fr 0.7fr;
  gap: 20px;
  align-items: start;
}
.lines {
  display: grid;
  gap: 12px;
}
.line {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 14px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--panel) 70%, transparent);
  align-items: center;
}
.thumb {
  border-radius: 12px;
  overflow: hidden;
}
.thumb :deep(.art) {
  aspect-ratio: 1;
  border-radius: 12px;
}
h2 {
  margin: 0;
  font-size: 1.05rem;
  font-family: var(--display);
}
.meta p {
  margin: 6px 0 0;
  color: var(--copper);
}
.qty {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 10px;
}
.qty button {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid var(--line);
}
.rm {
  width: auto !important;
  padding: 0 10px;
  margin-left: 6px;
  color: var(--muted);
}
.summary {
  padding: 18px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: var(--panel);
  display: grid;
  gap: 12px;
  position: sticky;
  top: 90px;
}
.row {
  display: flex;
  justify-content: space-between;
}
.note {
  margin: 0;
  color: var(--faint);
  font-size: 0.85rem;
}
.primary {
  display: inline-flex;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 999px;
  background: linear-gradient(180deg, #e0b888, var(--copper-dim));
  color: #1a120c;
  font-weight: 700;
  text-align: center;
}
@media (max-width: 800px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .line {
    grid-template-columns: 88px 1fr;
  }
  .line > strong {
    grid-column: 2;
  }
}
</style>
