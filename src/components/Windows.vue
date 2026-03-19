<script setup>
import { ref, onMounted } from 'vue'
import ExplorerWindow from './windows/ExplorerWindow.vue'
import Taskbar from './windows/Taskbar.vue'

const isExplorerOpen = ref(true)
const isExplorerMinimized = ref(false)

const toggleExplorer = () => {
  if (!isExplorerOpen.value) {
    isExplorerOpen.value = true
    isExplorerMinimized.value = false
  } else {
    isExplorerMinimized.value = !isExplorerMinimized.value
  }
}

const closeExplorer = () => {
  isExplorerOpen.value = false
  isExplorerMinimized.value = false
}

const minimizeExplorer = () => {
  isExplorerMinimized.value = true
}

onMounted(() => {
  // Any global initialization
})
</script>

<template>
  <div class="windows-container">
    <!-- Desktop Area -->
    <div class="desktop">
      <ExplorerWindow 
        :isOpen="isExplorerOpen"
        :isMinimized="isExplorerMinimized"
        @close="closeExplorer"
        @minimize="minimizeExplorer"
      />
    </div>

    <!-- Taskbar -->
    <Taskbar 
      :isExplorerOpen="isExplorerOpen"
      :isExplorerMinimized="isExplorerMinimized"
      @toggleExplorer="toggleExplorer"
      @minimizeExplorer="minimizeExplorer"
    />
  </div>
</template>

<style scoped>
.windows-container {
  height: 100vh;
  width: 100vw;
  background-image: url('../assets/windows-wallpaper.png');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI Variable', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  overflow: hidden;
  color: white;
}

.desktop {
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>



