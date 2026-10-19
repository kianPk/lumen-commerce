<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { cartLines, cartTotal, checkout, state } from '../store'
import { formatPrice } from '../catalog'

const router = useRouter()
const name = ref('Kian Zarandi')
const email = ref('kianzarandi701@gmail.com')
const busy = ref(false)
const error = ref('')

async function submit() {
  if (!cartLines.value.length && !state.lastOrder) {
    router.push('/cart')
    return
  }
  busy.value = true
  error.value = ''
  try {
    await checkout({ name: name.value.trim(), email: email.value.trim() })
  } catch (e) {
    error.value = e.message || 'Checkout failed'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <main class="checkout">
    <template v-if="state.lastOrder && !cartLines.length">
      <section class="done">
        <p class="eyebrow">Confirmed</p>
        <h1>Thanks, {{ state.lastOrder.name }}</h1>
        <p>
          Order <code>{{ state.lastOrder.id }}</code> ·
          {{ formatPrice(state.lastOrder.total) }}
        </p>
        <ul>
          <li v-for="item in state.lastOrder.items" :key="item.productId">
            {{ item.qty }}× {{ item.name }}
          </li>
        </ul>
        <RouterLink class="primary" to="/">Back to shop</RouterLink>
      </section>
    </template>

    <template v-else>
      <h1>Checkout</h1>
      <div class="layout">
        <form class="form" @submit.prevent="submit">
          <label>
            <span>Full name</span>
            <input v-model="name" required minlength="2" />
          </label>
          <label>
            <span>Email</span>
            <input v-model="email" type="email" required />
          </label>
          <p v-if="error" class="err">{{ error }}</p>
          <button class="primary" type="submit" :disabled="busy || !cartLines.length">
            {{ busy ? 'Placing order…' : 'Place order' }}
          </button>
        </form>
        <aside>
          <h2>Order</h2>
          <div v-for="line in cartLines" :key="line.productId" class="row">
            <span>{{ line.qty }}× {{ line.product.name }}</span>
            <b>{{ formatPrice(line.lineTotal) }}</b>
          </div>
          <div class="row total">
            <span>Total</span>
            <b>{{ formatPrice(cartTotal) }}</b>
          </div>
        </aside>
      </div>
    </template>
  </main>
</template>

<style scoped>
.checkout {
  padding: 24px clamp(16px, 4vw, 40px) 48px;
}
h1 {
  margin: 0 0 22px;
  font-family: var(--display);
  font-size: 2rem;
}
.layout {
  display: grid;
  grid-template-columns: 1fr 0.85fr;
  gap: 20px;
  align-items: start;
}
.form,
aside {
  padding: 18px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: var(--panel);
  display: grid;
  gap: 12px;
}
label {
  display: grid;
  gap: 6px;
}
label span {
  font-size: 0.8rem;
  color: var(--muted);
}
input {
  padding: 11px 12px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--bg);
  outline: none;
}
.primary {
  display: inline-flex;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 999px;
  background: linear-gradient(180deg, #e0b888, var(--copper-dim));
  color: #1a120c;
  font-weight: 700;
  border: none;
}
.row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: var(--muted);
  font-size: 0.92rem;
}
.total {
  margin-top: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--line);
  color: var(--text);
}
.err {
  color: var(--danger);
  margin: 0;
}
.done {
  max-width: 520px;
  animation: rise 0.4s ease;
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.eyebrow {
  color: var(--sage);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.75rem;
}
code {
  color: var(--copper);
}
ul {
  padding-left: 18px;
  color: var(--muted);
}
@media (max-width: 800px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
