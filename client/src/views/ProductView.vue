<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { productBySlug, addToCart } from '../store'
import { formatPrice } from '../catalog'
import ProductArt from '../components/ProductArt.vue'

const props = defineProps({ slug: { type: String, required: true } })
const router = useRouter()
const product = computed(() => productBySlug(props.slug))

function buy() {
  if (!product.value) return
  addToCart(product.value.id)
  router.push('/cart')
}
</script>

<template>
  <main v-if="product" class="product">
    <RouterLink class="back" to="/">← Back to shop</RouterLink>
    <div class="layout">
      <ProductArt :image="product.image" large />
      <div class="info">
        <p class="cat">{{ product.category }}</p>
        <h1>{{ product.name }}</h1>
        <p class="tag">{{ product.tagline }}</p>
        <p class="desc">{{ product.description }}</p>
        <div class="buyrow">
          <strong>{{ formatPrice(product.price) }}</strong>
          <span>★ {{ product.rating.toFixed(1) }} · {{ product.stock }} in stock</span>
        </div>
        <div class="actions">
          <button type="button" class="primary" @click="addToCart(product.id)">Add to bag</button>
          <button type="button" class="ghost" @click="buy">Buy now</button>
        </div>
      </div>
    </div>
  </main>
  <main v-else class="product">
    <p>Product not found.</p>
    <RouterLink to="/">Return to shop</RouterLink>
  </main>
</template>

<style scoped>
.product {
  padding: 20px clamp(16px, 4vw, 40px) 48px;
}
.back {
  color: var(--muted);
  font-size: 0.9rem;
}
.layout {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  align-items: start;
  animation: rise 0.4s ease;
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.cat {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
  color: var(--copper);
}
h1 {
  margin: 8px 0 0;
  font-family: var(--display);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  letter-spacing: -0.02em;
}
.tag {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 1.05rem;
}
.desc {
  margin: 16px 0 0;
  color: var(--muted);
  line-height: 1.6;
  max-width: 36rem;
}
.buyrow {
  margin-top: 22px;
  display: flex;
  gap: 14px;
  align-items: baseline;
  flex-wrap: wrap;
}
.buyrow strong {
  font-size: 1.35rem;
  color: var(--copper);
}
.buyrow span {
  color: var(--faint);
  font-size: 0.9rem;
}
.actions {
  margin-top: 18px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.primary,
.ghost {
  padding: 12px 18px;
  border-radius: 999px;
  font-weight: 700;
}
.primary {
  background: linear-gradient(180deg, #e0b888, var(--copper-dim));
  color: #1a120c;
}
.ghost {
  border: 1px solid var(--line);
}
@media (max-width: 800px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
