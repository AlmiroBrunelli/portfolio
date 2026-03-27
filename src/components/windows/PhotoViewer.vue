<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import ResizableWindow from './ResizableWindow.vue'
import { windowsState } from '../../store'

interface Photo {
  path: string;
  label?: string;
  thumbnail?: string;
}

const props = defineProps({
  photos: {
    type: Array as () => Photo[],
    default: () => []
  },
  initialIndex: {
    type: Number,
    default: 0
  },
  isOpen: Boolean,
  zIndex: Number,
  initialPos: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'minimize', 'maximize'])

const currentIndex = ref(props.initialIndex)
const zoomLevel = ref(100)
const isMaximized = ref(false)
const isZoomListVisible = ref(false)

const zoomOptions = [800, 700, 600, 500, 400, 300, 200, 100, 75, 50, 25, 10]

const currentPhoto = computed(() => (props.photos[currentIndex.value] as Photo) || { path: '', label: '' })

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

const handleWheel = (e: WheelEvent) => {
  if (e.ctrlKey) {
    e.preventDefault()
    if (e.deltaY < 0) zoomIn()
    else zoomOut()
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

watch(() => props.initialIndex, (newVal) => {
  currentIndex.value = newVal
  resetZoom()
})
</script>

<template>
  <Transition name="photo-fade">
    <ResizableWindow
      v-if="isOpen"
      :title="`${currentPhoto.label || 'Foto'} - Fotos`"
      icon="🖼️"
      :darkMode="windowsState.theme === 'dark'"
      :initialSize="{ width: 900, height: 700 }"
      :initialPos="initialPos"
      :style="{ zIndex: zIndex }"
      @close="emit('close')"
      @minimize="emit('minimize')"
      @maximize="(val: boolean) => { isMaximized = val; emit('maximize', val) }"
    >
      <div class="viewer-container" :class="{ maximized: isMaximized }">
        <div class="viewer-header-tools">
          <div class="header-tools-left">
            <button class="tool-btn" title="Zoom In" @click="zoomIn">🔍+</button>
            <button class="tool-btn" title="Zoom Out" @click="zoomOut">🔍-</button>
            <button class="tool-btn" title="Girar">🔄</button>
            <button class="tool-btn" title="Excluir">🗑️</button>
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
                <img :src="photo.thumbnail || photo.path" loading="lazy" />
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
                {{ Math.round(zoomLevel) }}% 
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px;">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
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
    </ResizableWindow>
  </Transition>
</template>

<style scoped>
.viewer-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--win-bg);
  overflow: hidden;
}

.viewer-header-tools {
  height: 40px;
  background: var(--win-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 12px;
}

.tool-btn {
  background: transparent;
  border: none;
  color: var(--win-text);
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.tool-btn:hover { background: var(--win-hover); }

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
  background: var(--win-bg);
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
    color: var(--win-text);
    font-size: 18px;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
}
.footer-tool-btn:hover { background: var(--win-hover); }

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
    border-color: var(--win-accent);
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
  border: 1px solid var(--win-border);
  color: var(--win-text);
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
  background: var(--win-bg);
  border: 1px solid var(--win-border);
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

.zoom-opt:hover { background: var(--win-accent); color: #fff; }

.slider-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-step-btn {
  background: transparent;
  border: none;
  color: var(--win-text);
  font-size: 16px;
  cursor: pointer;
}

.zoom-slider {
  width: 100px;
  height: 2px;
  accent-color: var(--win-accent);
  cursor: pointer;
}

.photo-fade-enter-active, .photo-fade-leave-active { transition: opacity 0.2s; }
.photo-fade-enter-from, .photo-fade-leave-to { opacity: 0; }
</style>
