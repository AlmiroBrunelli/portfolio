<script setup>
import { ref, onMounted } from 'vue'
import ExplorerWindow from './windows/ExplorerWindow.vue'
import Taskbar from './windows/Taskbar.vue'
import StartMenu from './windows/StartMenu.vue'
import PhotoViewer from './windows/PhotoViewer.vue'
import Calculator from './windows/Calculator.vue'

const isExplorerOpen = ref(true)
const isExplorerMinimized = ref(false)
const isStartMenuOpen = ref(false)
const isCalculatorOpen = ref(false)
const isCalculatorMinimized = ref(false)
const focusedApp = ref('Explorer')

// Z-index & Focus Order Management
const nextZIndex = ref(200)
const zIndices = ref({
  Explorer: 100,
  PhotoViewer: 101,
  Calculator: 102
})
const windowOrder = ref(['Explorer', 'PhotoViewer', 'Calculator'])

const bringToFront = (app) => {
  // Move to end of order array
  const idx = windowOrder.value.indexOf(app)
  if (idx > -1) {
    windowOrder.value.splice(idx, 1)
    windowOrder.value.push(app)
  }
  
  nextZIndex.value++
  zIndices.value[app] = nextZIndex.value
  focusedApp.value = app
}

const findNewFocus = () => {
  // Look for the next best window to focus (from back of order list)
  for (let i = windowOrder.value.length - 1; i >= 0; i--) {
    const app = windowOrder.value[i]
    if (app === 'Explorer' && isExplorerOpen.value && !isExplorerMinimized.value) {
      focusedApp.value = 'Explorer'
      return
    }
    if (app === 'Calculator' && isCalculatorOpen.value && !isCalculatorMinimized.value) {
      focusedApp.value = 'Calculator'
      return
    }
    if (app === 'PhotoViewer' && openedPhoto.value) {
      focusedApp.value = 'PhotoViewer'
      return
    }
  }
  focusedApp.value = null
}

const toggleCalculator = () => {
  if (!isCalculatorOpen.value) {
    isCalculatorOpen.value = true
    isCalculatorMinimized.value = false
    bringToFront('Calculator')
  } else if (focusedApp.value !== 'Calculator' || isCalculatorMinimized.value) {
    isCalculatorMinimized.value = false
    bringToFront('Calculator')
  } else {
    isCalculatorMinimized.value = true
    findNewFocus()
  }
}

const emit = defineEmits(['change-os'])

const toggleExplorer = () => {
  if (!isExplorerOpen.value) {
    isExplorerOpen.value = true
    isExplorerMinimized.value = false
    bringToFront('Explorer')
  } else if (focusedApp.value !== 'Explorer' || isExplorerMinimized.value) {
    isExplorerMinimized.value = false
    bringToFront('Explorer')
  } else {
    isExplorerMinimized.value = true
    findNewFocus()
  }
}

const toggleStartMenu = () => {
    isStartMenuOpen.value = !isStartMenuOpen.value
}

const closeExplorer = () => {
  isExplorerOpen.value = false
  isExplorerMinimized.value = false
  findNewFocus()
}

const minimizeExplorer = () => {
  isExplorerMinimized.value = true
  findNewFocus()
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
        :zIndex="zIndices.Explorer"
        @close="closeExplorer"
        @minimize="minimizeExplorer"
        @maximize="bringToFront('Explorer')"
        @open-file="data => { openedPhoto = data.path; photoList = data.list; photoIndex = data.index; bringToFront('PhotoViewer') }"
        @mousedown="bringToFront('Explorer')"
      />
      
      <!-- Start Menu -->
      <StartMenu 
        v-if="isStartMenuOpen"
        style="z-index: 9999"
        @change-os="os => emit('change-os', os)"
        @close="isStartMenuOpen = false"
        @open-app="app => { 
          if (app === 'Calculator') toggleCalculator(); 
          isStartMenuOpen = false;
        }"
      />

      <!-- Photo Viewer -->
      <PhotoViewer 
        v-if="openedPhoto"
        :src="openedPhoto"
        :photos="photoList"
        :initialIndex="photoIndex"
        :isOpen="!!openedPhoto"
        :zIndex="zIndices.PhotoViewer"
        @close="openedPhoto = null; findNewFocus()"
        @maximize="bringToFront('PhotoViewer')"
        @mousedown="bringToFront('PhotoViewer')"
      />

      <!-- Calculator -->
      <Calculator 
        v-if="isCalculatorOpen"
        v-show="!isCalculatorMinimized"
        :isMinimized="isCalculatorMinimized"
        :zIndex="zIndices.Calculator"
        @close="isCalculatorOpen = false; findNewFocus()"
        @minimize="isCalculatorMinimized = true; findNewFocus()"
        @maximize="bringToFront('Calculator')"
        @mousedown="bringToFront('Calculator')"
      />
    </div>

    <!-- Taskbar -->
    <Taskbar 
      :isExplorerOpen="isExplorerOpen"
      :isExplorerMinimized="isExplorerMinimized"
      :isCalculatorOpen="isCalculatorOpen"
      :isCalculatorMinimized="isCalculatorMinimized"
      :focusedApp="focusedApp"
      @toggleExplorer="toggleExplorer"
      @minimizeExplorer="minimizeExplorer"
      @toggleCalculator="toggleCalculator"
      @toggleStartMenu="toggleStartMenu"
    />
  </div>
</template>

<style scoped>
.windows-container {
  height: 100vh;
  width: 100vw;
  background-image: url('../assets/windows/windows-wallpaper.png');
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
}
</style>



