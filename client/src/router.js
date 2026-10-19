import { createRouter, createWebHashHistory } from 'vue-router'
import ShopView from './views/ShopView.vue'
import ProductView from './views/ProductView.vue'
import CartView from './views/CartView.vue'
import CheckoutView from './views/CheckoutView.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'shop', component: ShopView },
    { path: '/product/:slug', name: 'product', component: ProductView, props: true },
    { path: '/cart', name: 'cart', component: CartView },
    { path: '/checkout', name: 'checkout', component: CheckoutView },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})
