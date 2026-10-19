<script setup>
import { state, cartCount } from './store'
</script>

<template>
  <div class="shell">
    <header class="nav">
      <RouterLink class="brand" to="/">
        <span class="mark" aria-hidden="true" />
        <span>
          <strong>Lumen</strong>
          <em>Commerce demo</em>
        </span>
      </RouterLink>
      <nav>
        <RouterLink to="/">Shop</RouterLink>
        <RouterLink to="/cart" class="bag">
          Bag
          <b v-if="cartCount">{{ cartCount }}</b>
        </RouterLink>
      </nav>
    </header>

    <Transition name="fade" mode="out-in">
      <RouterView />
    </Transition>

    <Transition name="fade">
      <div v-if="state.toast" class="toast">{{ state.toast.msg }}</div>
    </Transition>

    <footer class="foot">
      <p>Vue 3 storefront · Node checkout API · offline-capable Pages demo</p>
      <a href="https://github.com/kianPk/lumen-commerce" target="_blank" rel="noreferrer">Source</a>
    </footer>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px clamp(16px, 4vw, 40px);
  border-bottom: 1px solid color-mix(in srgb, var(--line) 80%, transparent);
  position: sticky;
  top: 0;
  z-index: 20;
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(12px);
}
.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}
.mark {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--copper) 40%, var(--line));
  background:
    radial-gradient(circle at 50% 40%, rgba(212, 165, 116, 0.35), transparent 55%),
    #1a1512;
  position: relative;
}
.mark::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 28%;
  width: 14px;
  height: 14px;
  border: 2px solid var(--copper);
  border-radius: 50%;
  transform: translateX(-50%);
}
.brand strong {
  display: block;
  font-family: var(--display);
  font-size: 1.25rem;
  font-weight: 650;
  letter-spacing: -0.02em;
}
.brand em {
  display: block;
  font-style: normal;
  font-size: 0.72rem;
  color: var(--faint);
  letter-spacing: 0.04em;
}
nav {
  display: flex;
  gap: 8px;
  align-items: center;
}
nav a {
  padding: 8px 12px;
  border-radius: 999px;
  color: var(--muted);
  font-weight: 500;
  transition: color 0.15s, background 0.15s;
}
nav a.router-link-active,
nav a:hover {
  color: var(--text);
  background: color-mix(in srgb, var(--panel) 80%, transparent);
}
.bag {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}
.bag b {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 99px;
  background: var(--copper);
  color: #1a120c;
  font-size: 0.72rem;
  display: grid;
  place-items: center;
}
.toast {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 50;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--panel);
  border: 1px solid color-mix(in srgb, var(--copper) 35%, var(--line));
  box-shadow: var(--shadow);
}
.foot {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 24px clamp(16px, 4vw, 40px) 32px;
  color: var(--faint);
  font-size: 0.82rem;
  border-top: 1px solid var(--line);
}
.foot a {
  color: var(--copper);
}
</style>
