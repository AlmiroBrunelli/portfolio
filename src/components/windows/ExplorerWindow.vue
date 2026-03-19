<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ExplorerTopBar from './ExplorerTopBar.vue'
import ExplorerSidebar from './ExplorerSidebar.vue'
import ExplorerMainView from './ExplorerMainView.vue'

const searchQuery = ref('')

const handleSearch = (query) => {
  searchQuery.value = query
}

const props = defineProps({
  isOpen: Boolean,
  isMinimized: Boolean
})

const emit = defineEmits(['close', 'minimize', 'maximize', 'close', 'toggle'])

const currentPath = ref('Este Computador')
const history = ref(['Este Computador'])
const historyIndex = ref(0)

const canGoBack = computed(() => historyIndex.value > 0)
const canGoForward = computed(() => historyIndex.value < history.value.length - 1)

const navigateTo = (path, addToHistory = true) => {
  if (path === currentPath.value) return
  currentPath.value = path
  
  if (addToHistory) {
    history.value = history.value.slice(0, historyIndex.value + 1)
    history.value.push(path)
    historyIndex.value = history.value.length - 1
  }
}

const goBack = () => {
  if (canGoBack.value) {
    historyIndex.value--
    currentPath.value = history.value[historyIndex.value]
  }
}

const goForward = () => {
  if (canGoForward.value) {
    historyIndex.value++
    currentPath.value = history.value[historyIndex.value]
  }
}

const goUp = () => {
  if (currentPath.value !== 'Este Computador') {
    navigateTo('Este Computador')
  }
}

const isMaximized = ref(false)
const pos = ref({ x: 100, y: 50 })
const size = ref({ width: 1000, height: 650 })
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

const startDrag = (e) => {
  if (isMaximized.value) return
  isDragging.value = true
  dragOffset.value = {
    x: e.clientX - pos.value.x,
    y: e.clientY - pos.value.y
  }
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

const onDrag = (e) => {
  if (!isDragging.value) return
  pos.value = {
    x: e.clientX - dragOffset.value.x,
    y: e.clientY - dragOffset.value.y
  }
}

const stopDrag = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}

const windowStyle = computed(() => {
  if (isMaximized.value) {
    return {
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      transform: 'none',
      borderRadius: '0'
    }
  }
  return {
    top: `${pos.value.y}px`,
    left: `${pos.value.x}px`,
    width: `${size.value.width}px`,
    height: `${size.value.height}px`,
  }
})

const windowWidth = ref(window.innerWidth)

const handleResize = () => {
  windowWidth.value = window.innerWidth
  const desktopWidth = window.innerWidth
  const desktopHeight = window.innerHeight - 48

  // Keep window size within desktop
  size.value = {
    width: Math.min(size.value.width, desktopWidth),
    height: Math.min(size.value.height, desktopHeight)
  }

  // Keep window position within desktop
  pos.value = {
    x: Math.min(pos.value.x, desktopWidth - size.value.width),
    y: Math.min(pos.value.y, desktopHeight - size.value.height)
  }

  // Ensure x and y are not negative
  pos.value.x = Math.max(0, pos.value.x)
  pos.value.y = Math.max(0, pos.value.y)
}

const showSidebar = computed(() => windowWidth.value > 750)

onMounted(() => {
  // Center window
  const desktopHeight = window.innerHeight - 48
  pos.value = {
    x: (windowWidth.value - size.value.width) / 2,
    y: (desktopHeight - size.value.height) / 2
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResize)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <Transition name="window">
    <div 
      v-if="isOpen && !isMinimized"
      class="explorer-window" 
      :style="windowStyle"
      :class="{ maximized: isMaximized, 'compact-mode': !showSidebar }"
    >
      <!-- Resize Handles -->
      <template v-if="!isMaximized">
        <div class="resizer n" @mousedown.stop="startResize($event, 'n')"></div>
        <div class="resizer s" @mousedown.stop="startResize($event, 's')"></div>
        <div class="resizer e" @mousedown.stop="startResize($event, 'e')"></div>
        <div class="resizer w" @mousedown.stop="startResize($event, 'w')"></div>
        <div class="resizer ne" @mousedown.stop="startResize($event, 'ne')"></div>
        <div class="resizer nw" @mousedown.stop="startResize($event, 'nw')"></div>
        <div class="resizer se" @mousedown.stop="startResize($event, 'se')"></div>
        <div class="resizer sw" @mousedown.stop="startResize($event, 'sw')"></div>
      </template>

      <ExplorerTopBar 
        :isMaximized="isMaximized"
        :currentPath="currentPath"
        :canGoBack="canGoBack"
        :canGoForward="canGoForward"
        :canGoUp="currentPath !== 'Este Computador'"
        @minimize="emit('minimize')"
        @maximize="isMaximized = !isMaximized"
        @close="emit('close')"
        @dragstart="startDrag"
        @navigate="navigateTo"
        @back="goBack"
        @forward="goForward"
        @up="goUp"
        @refresh="() => {}"
        @search="handleSearch"
      />
      
      <div class="window-body">
        <ExplorerSidebar 
          v-if="showSidebar"
          :currentPath="currentPath"
          @navigate="navigateTo"
        />
        <ExplorerMainView 
          :currentPath="currentPath"
          @navigate="navigateTo"
          @open-file="path => emit('open-file', path)"
          :compact="!showSidebar"
          :searchQuery="searchQuery"
        />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.explorer-window {
  position: absolute;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: visible; /* Changed from hidden to allow handles slightly outside if needed */
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  border: 1px solid #777;
  z-index: 100;
}

.explorer-window.maximized {
  border-radius: 0;
  border: none;
  overflow: hidden;
}

/* Resize Handles */
.resizer {
  position: absolute;
  z-index: 10;
}

.resizer.n, .resizer.s { height: 6px; left: 4px; right: 4px; cursor: ns-resize; }
.resizer.e, .resizer.w { width: 6px; top: 4px; bottom: 4px; cursor: ew-resize; }
.resizer.n { top: -3px; }
.resizer.s { bottom: -3px; }
.resizer.e { right: -3px; }
.resizer.w { left: -3px; }

.resizer.ne, .resizer.nw, .resizer.se, .resizer.sw {
  width: 10px;
  height: 10px;
  z-index: 11;
}

.resizer.nw { top: -5px; left: -5px; cursor: nwse-resize; }
.resizer.ne { top: -5px; right: -5px; cursor: nesw-resize; }
.resizer.sw { bottom: -5px; left: -5px; cursor: nesw-resize; }
.resizer.se { bottom: -5px; right: -5px; cursor: nwse-resize; }

.window-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Window Transitions */
.window-enter-active {
  animation: win-open 0.25s cubic-bezier(0.1, 0.9, 0.2, 1);
}
.window-leave-active {
  animation: win-close 0.2s cubic-bezier(0.1, 0.9, 0.2, 1);
}

@keyframes win-open {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes win-close {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95); }
}
</style>
