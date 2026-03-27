<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  brightness: number
  size?: number
}>()

// Internal state to follow the prop with a delay
const displayBrightness = ref(props.brightness)

watch(() => props.brightness, (newVal) => {
  // Each update of the slider will reflect in the icon 100ms later
  // This creates a continuous "follow" effect with a fixed delay
  setTimeout(() => {
    displayBrightness.value = newVal
  }, 100)
}, { immediate: true })

const rotation = computed(() => (displayBrightness.value / 100) * 90) // 90 degrees rotation from 0 to 100
const lineLength = computed(() => 0.5 + (displayBrightness.value / 100) * 2) // Length varies from 0.5 to 2.5
const innerRadius = 8 // 2px gap from the outer edge of the 2px stroke (6px -> 8px)
</script>

<template>
  <svg 
    viewBox="0 0 24 24" 
    :width="size || 20" 
    :height="size || 20" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2" 
    stroke-linecap="round"
  >
    <!-- Central Circle -->
    <circle cx="12" cy="12" r="5" />
    
    <!-- Rotating Lines Group -->
    <g :style="{ transform: `rotate(${rotation}deg)`, transformOrigin: '12px 12px', transition: 'transform 0.25s linear' }">
      <line v-for="i in 8" :key="i"
        x1="12" 
        :y1="12 - innerRadius" 
        x2="12" 
        :y2="12 - innerRadius - lineLength"
        :transform="`rotate(${(i-1) * 45} 12 12)`"
      />
    </g>
  </svg>
</template>

<style scoped>
svg {
  transition: color 0.2s ease 0.1s;
}
</style>
