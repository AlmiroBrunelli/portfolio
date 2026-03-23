<script setup lang="ts">
import { ref, watch } from 'vue'
import Home from './components/Home.vue'
import { windowsState } from './store'

const displayBrightness = ref(windowsState.brightness)

watch(() => windowsState.brightness, (newVal) => {
  setTimeout(() => {
    displayBrightness.value = newVal
  }, 100)
}, { immediate: true })
</script>

<template>
  <div 
    :style="{ 
      filter: displayBrightness === 100 ? 'none' : `brightness(${50 + (displayBrightness / 100) * 50}%)` 
    }" 
    style="height: 100vh; width: 100vw; transition: filter 0.25s ease;"
  >
    <Home />
  </div>
</template>
