<script setup>
import { computed } from 'vue'
import { ART } from '../catalog'

const props = defineProps({
  image: { type: String, required: true },
  large: { type: Boolean, default: false },
})

const art = computed(() => ART[props.image] || ART.mat)
</script>

<template>
  <div class="art" :class="{ large }" :style="{ background: art.bg }">
    <div class="shape" :data-shape="art.shape" aria-hidden="true" />
    <div class="glow" aria-hidden="true" />
  </div>
</template>

<style scoped>
.art {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--copper) 18%, var(--line));
}
.art.large {
  aspect-ratio: 1 / 1;
  min-height: 280px;
}
.glow {
  position: absolute;
  inset: auto -20% -30% 20%;
  height: 60%;
  background: radial-gradient(circle, rgba(212, 165, 116, 0.22), transparent 65%);
  animation: drift 8s ease-in-out infinite alternate;
}
@keyframes drift {
  from {
    transform: translateX(-4%);
  }
  to {
    transform: translateX(6%);
  }
}
.shape {
  position: absolute;
  inset: 0;
  margin: auto;
}
.shape[data-shape='lamp'] {
  width: 28%;
  height: 58%;
  background: linear-gradient(180deg, #f0d2ad, #a67a4a 55%, #3a2a1a);
  clip-path: polygon(35% 0, 65% 0, 78% 38%, 62% 38%, 70% 100%, 30% 100%, 38% 38%, 22% 38%);
  top: 12%;
  bottom: auto;
  height: 70%;
}
.shape[data-shape='throw'] {
  width: 62%;
  height: 42%;
  border-radius: 8px;
  background: repeating-linear-gradient(
    90deg,
    #2c343a 0 8px,
    #3a444c 8px 16px
  );
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  transform: rotate(-8deg);
}
.shape[data-shape='mug'] {
  width: 34%;
  height: 42%;
  border-radius: 10px 10px 14px 14px;
  background: linear-gradient(180deg, #4a5a50, #1c2820);
  top: 28%;
}
.shape[data-shape='mug']::after {
  content: '';
  position: absolute;
  right: -18%;
  top: 22%;
  width: 28%;
  height: 36%;
  border: 5px solid #6a7a70;
  border-left: none;
  border-radius: 0 40px 40px 0;
}
.shape[data-shape='notebook'] {
  width: 42%;
  height: 56%;
  background: linear-gradient(135deg, #3a2c20, #1a140f);
  border-radius: 4px;
  box-shadow: 6px 6px 0 rgba(212, 165, 116, 0.25);
  transform: rotate(6deg);
}
.shape[data-shape='buds'] {
  width: 46%;
  height: 28%;
  border-radius: 40px;
  background: #1a222c;
  border: 2px solid #4a5a6c;
  top: 36%;
}
.shape[data-shape='buds']::before,
.shape[data-shape='buds']::after {
  content: '';
  position: absolute;
  width: 22%;
  height: 70%;
  border-radius: 40px;
  background: #2a3440;
  top: -40%;
}
.shape[data-shape='buds']::before {
  left: 12%;
}
.shape[data-shape='buds']::after {
  right: 12%;
}
.shape[data-shape='pack'] {
  width: 40%;
  height: 52%;
  border-radius: 12px 12px 10px 10px;
  background: linear-gradient(180deg, #3a4630, #1a2014);
  top: 22%;
  box-shadow: inset 0 12px 0 rgba(255, 255, 255, 0.04);
}
.shape[data-shape='coffee'] {
  width: 36%;
  height: 48%;
  border-radius: 8px 8px 18px 18px;
  background: linear-gradient(180deg, rgba(240, 220, 190, 0.25), rgba(40, 30, 20, 0.2)),
    linear-gradient(180deg, #5a4a3a, #2a2018);
  top: 24%;
  border: 1px solid rgba(212, 165, 116, 0.35);
}
.shape[data-shape='mat'] {
  width: 70%;
  height: 38%;
  border-radius: 8px;
  background:
    linear-gradient(90deg, transparent 49%, rgba(212, 165, 116, 0.15) 49% 51%, transparent 51%),
    linear-gradient(#22262c, #16191e);
  top: 30%;
  border: 1px solid rgba(255, 255, 255, 0.06);
}
</style>
