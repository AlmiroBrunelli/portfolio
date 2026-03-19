<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

const props = defineProps({
  photos: {
    type: Array,
    default: () => []
  },
  initialIndex: {
    type: Number,
    default: 0
  },
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const currentIndex = ref(props.initialIndex)
const zoomLevel = ref(100)
const isMaximized = ref(false)
const isZoomListVisible = ref(false)

const zoomOptions = [800, 700, 600, 500, 400, 300, 200, 100, 75, 50, 25, 10]

const currentPhoto = computed(() => props.photos[currentIndex.value] || {})

// Window Geometry State
const pos = ref({ x: 0, y: 0 })
const size = ref({ width: 0, height: 0 })
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const isResizing = ref(false)
const resizeType = ref('')
const resizeStart = ref({ mouseX: 0, mouseY: 0, winX: 0, winY: 0, winW: 0, winH: 0 })

const next = () => {
    if (currentIndex.value < props.photos.length - 1) {
        currentIndex.value++
    } else {
        currentIndex.value = 0 // loop
    }
    resetZoom()
}

const prev = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--
    } else {
        currentIndex.value = props.photos.length - 1 // loop
    }
    resetZoom()
}

const resetZoom = () => {
  zoomLevel.value = 100
}

const zoomIn = () => {
  if (zoomLevel.value < 800) {
    zoomLevel.value = Math.min(800, zoomLevel.value + 10)
  }
}

const zoomOut = () => {
  if (zoomLevel.value > 10) {
    zoomLevel.value = Math.max(10, zoomLevel.value - 10)
  }
}

const handleWheel = (e) => {
  if (e.ctrlKey) {
    e.preventDefault()
    if (e.deltaY < 0) zoomIn()
    else zoomOut()
  }
}

// Dragging Logic
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

// Resizing Logic
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
  const minW = 400
  const minH = 300

  let newX = resizeStart.value.winX
  let newY = resizeStart.value.winY
  let newW = resizeStart.value.winW
  let newH = resizeStart.value.winH

  if (resizeType.value.includes('e')) newW = Math.max(minW, resizeStart.value.winW + dx)
  if (resizeType.value.includes('s')) newH = Math.max(minH, resizeStart.value.winH + dy)
  if (resizeType.value.includes('w')) {
    const maxWidth = resizeStart.value.winX + resizeStart.value.winW - minW
    newX = Math.min(maxWidth, resizeStart.value.winX + dx)
    newW = resizeStart.value.winW - (newX - resizeStart.value.winX)
  }
  if (resizeType.value.includes('n')) {
    const maxHeight = resizeStart.value.winY + resizeStart.value.winH - minH
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

const handleKeydown = (e) => {
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'Escape') emit('close')
}

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

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
    // Initialize size and center
    const desktopHeight = window.innerHeight - 48
    size.value = {
      width: Math.min(windowWidth.value * 0.9, 1200),
      height: Math.min(desktopHeight * 0.9, 800)
    }
    pos.value = {
      x: (windowWidth.value - size.value.width) / 2,
      y: (desktopHeight - size.value.height) / 2
    }
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('mousemove', onDrag)
    window.removeEventListener('mouseup', stopDrag)
    window.removeEventListener('mousemove', onResize)
    window.removeEventListener('mouseup', stopResize)
    window.removeEventListener('resize', handleResize)
})

watch(() => props.initialIndex, (newVal) => {
  currentIndex.value = newVal
  resetZoom()
})
</script>

<template>
  <Transition name="photo-fade">
    <div v-if="isOpen" class="photo-viewer-overlay" @click.self="emit('close')">
      <div class="photo-viewer" :class="{ maximized: isMaximized }" :style="windowStyle">
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

        <div class="viewer-header" @mousedown="startDrag">
          <div class="header-left">
            <span class="app-icon">🖼️</span>
            <div class="file-name">{{ currentPhoto.label }} - Fotos</div>
          </div>
          
          <div class="header-tools" @mousedown.stop>
            <button class="tool-btn" title="Zoom In" @click="zoomIn">🔍+</button>
            <button class="tool-btn" title="Zoom Out" @click="zoomOut">🔍-</button>
            <button class="tool-btn" title="Girar">🔄</button>
            <button class="tool-btn" title="Excluir">🗑️</button>
          </div>

          <div class="window-controls" @mousedown.stop>
            <button class="control-btn" title="Minimizar" @click="emit('close')">
              <img src="../../assets/windows/minimize.png" width="12" height="12" alt="Minimizar" style="filter: invert(1);" />
            </button>
            <button class="control-btn" :title="isMaximized ? 'Restaurar' : 'Maximizar'" @click="isMaximized = !isMaximized">
              {{ isMaximized ? '❐' : '□' }}
            </button>
            <button class="control-btn close" title="Fechar" @click="emit('close')">✕</button>
          </div>
        </div>
        
        <div class="image-container" @wheel="handleWheel">
          <button class="nav-btn side prev-side" @click="prev">‹</button>
          <div class="zoom-wrapper" :style="{ transform: `scale(${zoomLevel / 100})` }">
            <img :src="currentPhoto.path" class="main-image" :key="currentPhoto.path" />
          </div>
          <button class="nav-btn side next-side" @click="next">›</button>
        </div>
        
        <div class="viewer-footer">
          <div class="footer-left">
            <button class="footer-tool-btn" title="Cortar">🏁</button>
          </div>

          <div class="filmstrip-container">
            <div class="filmstrip">
              <div 
                v-for="(photo, index) in photos" 
                :key="photo.path" 
                class="filmstrip-item"
                :class="{ active: index === currentIndex }"
                @click="currentIndex = index; resetZoom()"
              >
                <img :src="photo.path" />
              </div>
            </div>
          </div>
          
          <div class="zoom-controls">
            <div class="zoom-selector-container">
              <div v-if="isZoomListVisible" class="zoom-list">
                <div 
                  v-for="opt in zoomOptions" 
                   :key="opt" 
                  class="zoom-opt"
                  @click="zoomLevel = opt; isZoomListVisible = false"
                >
                  {{ opt }}%
                </div>
              </div>
              <button class="zoom-btn" @click="isZoomListVisible = !isZoomListVisible">
                {{ Math.round(zoomLevel) }}% <img src="../../assets/windows/arrow-down.png" width="8" height="8" alt="Seta" style="filter: invert(1); margin-left: 4px;" />
              </button>
            </div>
            
            <div class="slider-container">
              <button class="zoom-step-btn" @click="zoomOut">－</button>
              <input 
                type="range" 
                min="10" 
                max="800" 
                v-model.number="zoomLevel" 
                class="zoom-slider"
              />
              <button class="zoom-step-btn" @click="zoomIn">＋</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.photo-viewer-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  z-index: 2000;
}

.photo-viewer {
  position: absolute;
  background: #1c1c1c;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: visible;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  z-index: 2001;
}

.photo-viewer.maximized {
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

.viewer-header {
  height: 40px;
  background: #1c1c1c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px 0 12px;
  color: #fff;
  cursor: default;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  pointer-events: none;
}

.app-icon { font-size: 14px; }

.header-tools {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
}

.tool-btn {
  background: transparent;
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.tool-btn:hover { background: rgba(255, 255, 255, 0.1); }

.window-controls {
  display: flex;
}

.control-btn {
  width: 46px;
  height: 32px;
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  transition: background 0.2s;
}

.control-btn:hover { background: rgba(255, 255, 255, 0.1); }
.control-btn.close:hover { background: #e81123; }

.image-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  background: #111;
}

.zoom-wrapper {
  transition: transform 0.1s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-btn.side {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.3);
    border: none;
    color: #fff;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.2s;
    opacity: 0;
    z-index: 10;
}

.image-container:hover .nav-btn.side { opacity: 1; }
.prev-side { left: 20px; }
.next-side { right: 20px; }

.main-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  box-shadow: 0 0 40px rgba(0,0,0,0.5);
}

.viewer-footer {
  height: 60px;
  background: #1c1c1c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-left { flex: 1; }

.footer-tool-btn {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
}
.footer-tool-btn:hover { background: rgba(255, 255, 255, 0.1); }

.filmstrip-container {
    flex: 2;
    display: flex;
    justify-content: center;
    overflow: hidden;
}

.filmstrip {
    display: flex;
    gap: 6px;
    padding: 4px;
}

.filmstrip-item {
    width: 40px;
    height: 28px;
    border-radius: 3px;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid transparent;
    opacity: 0.5;
}

.filmstrip-item.active {
    border-color: #60cdff;
    opacity: 1;
}

.filmstrip-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.zoom-controls {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.zoom-selector-container {
  position: relative;
}

.zoom-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 60px;
}

.zoom-btn:hover { background: rgba(255, 255, 255, 0.1); border-color: #60cdff; }

.zoom-list {
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  background: #2d2d2d;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 8px;
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
}

.zoom-opt {
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
}

.zoom-opt:hover { background: #60cdff; color: #000; }

.slider-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-step-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.zoom-slider {
  width: 100px;
  height: 2px;
  accent-color: #60cdff;
  cursor: pointer;
}

.photo-fade-enter-active, .photo-fade-leave-active { transition: opacity 0.2s; }
.photo-fade-enter-from, .photo-fade-leave-to { opacity: 0; }
</style>
