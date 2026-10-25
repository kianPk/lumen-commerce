<script setup>
import { state, filtered, addToCart, toggleWishlist } from '../store'
import { formatPrice } from '../catalog'
import ProductArt from '../components/ProductArt.vue'
</script>

<template>
  <main class="shop">
    <section class="hero">
      <div class="copy">
        <p class="eyebrow">Flagship storefront</p>
        <h1>Lumen</h1>
        <p class="lede">
          A polished Vue commerce surface with catalog filters, bag state, and a Node checkout API —
          fully usable offline on GitHub Pages.
        </p>
        <div class="cta">
          <a class="primary" href="#grid">Browse collection</a>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="orb" />
        <div class="frame">
          <ProductArt image="lamp" large />
        </div>
      </div>
    </section>

    <section id="grid" class="controls">
      <input v-model="state.query" type="search" placeholder="Search products…" />
      <select v-model="state.category">
        <option value="all">All categories</option>
        <option v-for="c in state.categories" :key="c" :value="c">{{ c }}</option>
      </select>
      <select v-model="state.sort">
        <option value="featured">Featured</option>
        <option value="price_asc">Price ↑</option>
        <option value="price_desc">Price ↓</option>
        <option value="rating">Top rated</option>
      </select>
    </section>

    <section class="grid">
      <article v-for="p in filtered" :key="p.id" class="item">
        <RouterLink :to="`/product/${p.slug}`" class="media">
          <ProductArt :image="p.image" />
        </RouterLink>
        <div class="meta">
          <div class="row">
            <RouterLink :to="`/product/${p.slug}`">
              <h2>{{ p.name }}</h2>
            </RouterLink>
            <span class="price">{{ formatPrice(p.price) }}</span>
          </div>
          <p>{{ p.tagline }}</p>
          <div class="row actions">
            <span class="rating">★ {{ p.rating.toFixed(1) }}</span>
            <button
              type="button"
              class="wish"
              :class="{ on: state.wishlist.includes(p.id) }"
              :aria-pressed="state.wishlist.includes(p.id)"
              :aria-label="state.wishlist.includes(p.id) ? 'Remove from wishlist' : 'Add to wishlist'"
              @click.stop="toggleWishlist(p.id)"
            >
              <span class="heart" aria-hidden="true">{{ state.wishlist.includes(p.id) ? '♥' : '♡' }}</span>
            </button>
            <button type="button" class="add" @click="addToCart(p.id)">Add</button>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.shop {
  padding: 0 clamp(16px, 4vw, 40px) 48px;
}
.hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 28px;
  align-items: center;
  min-height: min(72vh, 640px);
  padding: 28px 0 12px;
}
.copy {
  animation: rise 0.55s ease;
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.eyebrow {
  margin: 0 0 10px;
  color: var(--copper);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
h1 {
  margin: 0;
  font-family: var(--display);
  font-size: clamp(3.2rem, 8vw, 5.6rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 0.95;
}
.lede {
  margin: 18px 0 0;
  max-width: 34rem;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.55;
}
.cta {
  margin-top: 24px;
}
.primary {
  display: inline-flex;
  padding: 12px 18px;
  border-radius: 999px;
  background: linear-gradient(180deg, #e0b888, var(--copper-dim));
  color: #1a120c;
  font-weight: 700;
}
.hero-visual {
  position: relative;
  animation: rise 0.7s ease 0.08s both;
}
.orb {
  position: absolute;
  inset: 8% 5% auto auto;
  width: 55%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(212, 165, 116, 0.28), transparent 70%);
  filter: blur(8px);
  animation: float 7s ease-in-out infinite alternate;
}
@keyframes float {
  from {
    transform: translate(-4%, 2%);
  }
  to {
    transform: translate(3%, -3%);
  }
}
.frame {
  position: relative;
  border-radius: 22px;
  padding: 10px;
  background: color-mix(in srgb, var(--panel) 70%, transparent);
  border: 1px solid var(--line);
}
.controls {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 10px;
  margin: 18px 0 22px;
  position: sticky;
  top: 72px;
  z-index: 10;
  padding: 10px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--bg) 85%, transparent);
  backdrop-filter: blur(10px);
  border: 1px solid var(--line);
}
input,
select {
  padding: 11px 12px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--panel);
  outline: none;
}
input:focus,
select:focus {
  border-color: color-mix(in srgb, var(--copper) 45%, var(--line));
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px;
  border-radius: 18px;
  transition: transform 0.18s ease, background 0.18s ease;
}
.item:hover {
  transform: translateY(-3px);
  background: color-mix(in srgb, var(--panel) 55%, transparent);
}
.meta {
  display: grid;
  gap: 6px;
  padding: 0 4px 6px;
}
.row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: start;
}
h2 {
  margin: 0;
  font-size: 1.02rem;
  font-family: var(--display);
  font-weight: 650;
}
.price {
  color: var(--copper);
  font-weight: 600;
  font-size: 0.88rem;
  white-space: nowrap;
}
.meta > p {
  margin: 0;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.4;
}
.actions {
  align-items: center;
  margin-top: 4px;
}
.rating {
  color: var(--sage);
  font-size: 0.85rem;
}
.add, .wish {
  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid var(--line);
  color: var(--text);
  font-weight: 600;
  font-size: 0.85rem;
  background: transparent;
}
.wish {
  color: var(--muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  padding: 7px 10px;
}
.wish.on {
  color: #e8a0a8;
  border-color: color-mix(in srgb, #e8a0a8 40%, var(--line));
  background: color-mix(in srgb, #e8a0a8 10%, transparent);
}
.heart { font-size: 1rem; line-height: 1; }
.add:hover {
  border-color: color-mix(in srgb, var(--copper) 50%, var(--line));
  background: color-mix(in srgb, var(--copper) 12%, transparent);
}
@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    min-height: auto;
    padding-top: 18px;
  }
  .hero-visual {
    order: -1;
  }
  .controls {
    grid-template-columns: 1fr;
    top: 64px;
  }
}
</style>
