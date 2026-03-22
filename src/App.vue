<script setup lang="ts">
import Home from './components/Home.vue'
import { windowsState } from './store'
</script>

<template>
  <div 
    :style="{ 
      filter: windowsState.brightness === 100 ? 'none' : `brightness(${50 + (windowsState.brightness / 100) * 50}%)` 
    }" 
    style="height: 100vh; width: 100vw; transition: filter 0.2s ease;"
  >
    <Home />
  </div>
</template>
