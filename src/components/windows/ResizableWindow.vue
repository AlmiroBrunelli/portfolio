<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

const props = defineProps({
  title: String,
  icon: String,
  iconType: {
    type: String,
    default: 'emoji' // 'emoji' or 'image'
  },
  initialPos: {
    type: Object,
    default: null
  },
  initialSize: {
    type: Object,
    default: () => ({ width: 800, height: 600 })
  },
  minWidth: { type: Number, default: 200 },
  minHeight: { type: Number, default: 150 },
  active: { type: Boolean, default: true },
  darkMode: { type: Boolean, default: false },
  showTitle: { type: Boolean, default: true },
  showIcon: { type: Boolean, default: true }
})

const emit = defineEmits(['close', 'minimize', 'maximize'])

const pos = ref({ ...props.initialPos })
const size = ref({ ...props.initialSize })
const isMaximized = ref(false)
const isDragging = ref(false)
const isResizing = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const resizeType = ref('')
const resizeStart = ref({ mouseX: 0, mouseY: 0, winX: 0, winY: 0, winW: 0, winH: 0 })
const isAnimating = ref(false)

// Watch for maximize state changes to trigger animations
let animTimeout = null
watch(isMaximized, () => {
  isAnimating.value = true
  if (animTimeout) clearTimeout(animTimeout)
  animTimeout = setTimeout(() => {
    isAnimating.value = false
  }, 300) // Match CSS transition duration
})

const toggleMaximize = () => {
  isMaximized.value = !isMaximized.value
  emit('maximize', isMaximized.value)
}

const startDrag = (e) => {
  isDragging.value = true
  
  if (isMaximized.value) {
    // When dragging a maximized window, we prepare for a "pull down" restore
    const relativeX = e.clientX / window.innerWidth
    dragOffset.value = {
      x: Math.min(Math.max(relativeX * size.value.width, 10), size.value.width - 10),
      y: 16 // Assume header center
    }
  } else {
    dragOffset.value = {
      x: e.clientX - pos.value.x,
      y: e.clientY - pos.value.y
    }
  }
  
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

const onDrag = (e) => {
  if (!isDragging.value) return

  if (isMaximized.value) {
    // Detect "pull down" to restore with hysteresis (deadzone)
    if (e.clientY > 30) {
      isMaximized.value = false
      emit('maximize', false)
      // dragOffset was set in startDrag or re-calculated when maximized during drag
    } else {
      return // Still near the top, stay maximized
    }
  }

  // Update window position when not maximized
  pos.value = {
    x: e.clientX - dragOffset.value.x,
    y: Math.max(0, e.clientY - dragOffset.value.y) // Clamp to top of screen
  }

  // Snap to maximize immediately if mouse hits the top edge (<= 10px)
  if (e.clientY <= 10) {
    isMaximized.value = true
    emit('maximize', true)
    
    // Recalculate dragOffset so pulling down feels natural after dynamic maximize
    const relativeX = e.clientX / window.innerWidth
    dragOffset.value = {
      x: Math.min(Math.max(relativeX * size.value.width, 10), size.value.width - 10),
      y: 16
    }
  }
}

const stopDrag = (e) => {
  if (!isDragging.value) return

  // Failsafe: maximize on drop if mouse is at top edge
  if (e.clientY <= 10) {
    isMaximized.value = true
    emit('maximize', true)
  }

  isDragging.value = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}

const startResize = (e, type) => {
  if (isMaximized.value) return
  isResizing.value = true
  resizeType.value = type
  resizeStart.value = {
    mouseX: e.clientX,
    mouseY: e.clientY,
    winX: pos.value.x,
    winY: pos.value.y,
    winW: size.value.width,
    winH: size.value.height
  }
  window.addEventListener('mousemove', onResize)
  window.addEventListener('mouseup', stopResize)
}

const onResize = (e) => {
  if (!isResizing.value) return
  
  const dx = e.clientX - resizeStart.value.mouseX
  const dy = e.clientY - resizeStart.value.mouseY

  let newX = resizeStart.value.winX
  let newY = resizeStart.value.winY
  let newW = resizeStart.value.winW
  let newH = resizeStart.value.winH

  if (resizeType.value.includes('e')) newW = Math.max(props.minWidth, resizeStart.value.winW + dx)
  if (resizeType.value.includes('s')) newH = Math.max(props.minHeight, resizeStart.value.winH + dy)
  if (resizeType.value.includes('w')) {
    const maxWidth = resizeStart.value.winX + resizeStart.value.winW - props.minWidth
    newX = Math.min(maxWidth, resizeStart.value.winX + dx)
    newW = resizeStart.value.winW - (newX - resizeStart.value.winX)
  }
  if (resizeType.value.includes('n')) {
    const maxHeight = resizeStart.value.winY + resizeStart.value.winH - props.minHeight
    newY = Math.min(maxHeight, resizeStart.value.winY + dy)
    newH = resizeStart.value.winH - (newY - resizeStart.value.winY)
  }

  pos.value = { x: newX, y: newY }
  size.value = { width: newW, height: newH }
}

const stopResize = () => {
  isResizing.value = false
  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResize)
}

const windowStyle = computed(() => {
  if (isMaximized.value) {
    return {
      top: '0',
      left: '0',
      width: '100%',
      height: 'calc(100vh - 48px)',
      transform: 'none',
      borderRadius: '0',
      zIndex: props.active ? 1000 : 900
    }
  }
  return {
    top: `${pos.value.y}px`,
    left: `${pos.value.x}px`,
    width: `${size.value.width}px`,
    height: `${size.value.height}px`,
    zIndex: props.active ? 1000 : 900
  }
})

onMounted(() => {
  if (props.initialPos) {
    pos.value = { ...props.initialPos }
  } else {
    // Center window if no pos provided
    pos.value = {
      x: (window.innerWidth - size.value.width) / 2,
      y: (window.innerHeight - 48 - size.value.height) / 2
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResize)
})
</script>

<template>
  <div 
    class="resizable-window" 
    :style="windowStyle"
    :class="{ maximized: isMaximized, inactive: !active, dark: darkMode, animating: isAnimating }"
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

    <div class="window-header" @mousedown="startDrag" @dblclick="toggleMaximize">
      <div class="header-left" v-if="showTitle || showIcon">
        <template v-if="showIcon">
          <img v-if="iconType === 'image'" :src="icon" class="window-icon-img" />
          <span v-else class="window-icon-emoji">{{ icon }}</span>
        </template>
        <span v-if="showTitle" class="window-title">{{ title }}</span>
      </div>
      
      <div class="header-center">
        <slot name="header-center"></slot>
      </div>

      <div class="window-controls" @mousedown.stop>
        <button class="control-btn" @click="emit('minimize')" title="Minimizar">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1" style="transform: rotate(180deg)">
            <line x1="0" y1="5" x2="10" y2="5" />
          </svg>
        </button>
        <button class="control-btn" @click="toggleMaximize" :title="isMaximized ? 'Restaurar' : 'Maximizar'">
          <svg v-if="isMaximized" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1" style="transform: rotate(180deg)">
            <rect x="2.5" y="0.5" width="7" height="7" />
            <path d="M0.5 2.5V9.5H7.5V7.5" />
            <path d="M0.5 2.5H2.5" />
          </svg>
          <svg v-else width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1" style="transform: rotate(180deg)">
            <rect x="0.5" y="0.5" width="9" height="9" />
          </svg>
        </button>
        <button class="control-btn close" @click="emit('close')" title="Fechar">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.2" style="transform: rotate(180deg)">
            <path d="M1 1L9 9M9 1L1 9" />
          </svg>
        </button>
      </div>
    </div>

    <div class="window-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.resizable-window {
  position: absolute;
  background: white;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  border: 1px solid rgba(0, 0, 0, 0.2);
  overflow: visible; /* To see resizers better, but content should be clipped */
}

/* Apply transitions only when maximizing or restoring */
.resizable-window.animating {
  transition: top 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
              left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
              width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
              height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
              border-radius 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.resizable-window.maximized {
  border-radius: 0;
  border: none;
}

.window-header {
  height: 32px;
  min-height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 12px;
  background: #fff;
  border-bottom: 1px solid #eee;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  transition: background 0.2s, color 0.2s;
}

.dark .window-header {
  background: #1c1c1c;
  border-bottom: 1px solid #333;
  color: #eee;
}

.dark.resizable-window {
  border-color: #333;
}

.resizable-window.dark .window-title {
  color: #eee;
}

.resizable-window.dark .control-btn {
  color: #eee;
}

.resizable-window.dark .control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.resizable-window.dark .control-btn img {
  filter: invert(1);
}

.maximized .window-header {
  border-radius: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
}

.window-icon-img {
  width: 16px;
  height: 16px;
}

.window-icon-emoji {
  font-size: 14px;
}

.window-title {
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-center {
  flex: 1;
  display: flex;
  align-items: center;
  height: 100%;
}

.window-controls {
  display: flex;
  height: 100%;
}

.control-btn {
  width: 46px;
  height: 100%;
  background: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  transition: background 0.2s;
}

.control-btn:hover { background: #eee; }
.control-btn.close:hover { background: #e81123; color: white; }

.window-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.maximized .window-content {
  border-radius: 0;
}

/* Resize Handles */
.resizer {
  position: absolute;
  z-index: 100;
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
  z-index: 101;
}

.resizer.nw { top: -5px; left: -5px; cursor: nwse-resize; }
.resizer.ne { top: -5px; right: -5px; cursor: nesw-resize; }
.resizer.sw { bottom: -5px; left: -5px; cursor: nesw-resize; }
.resizer.se { bottom: -5px; right: -5px; cursor: nwse-resize; }

.inactive {
  filter: grayscale(0.2) brightness(0.95);
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
}
</style>
