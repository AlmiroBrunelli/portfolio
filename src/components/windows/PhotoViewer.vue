<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

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

const currentPhoto = computed(() => props.photos[currentIndex.value] || {})

const next = () => {
    if (currentIndex.value < props.photos.length - 1) {
        currentIndex.value++
    } else {
        currentIndex.value = 0 // loop
    }
}

const prev = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--
    } else {
        currentIndex.value = props.photos.length - 1 // loop
    }
}

const handleKeydown = (e) => {
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'Escape') emit('close')
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Transition name="photo-fade">
    <div v-if="isOpen" class="photo-viewer-overlay" @click.self="emit('close')">
      <div class="photo-viewer">
        <div class="viewer-header">
          <div class="file-name">{{ currentPhoto.label }} - Fotos</div>
          <div class="viewer-controls">
            <button class="tool-btn">🔍</button>
            <button class="tool-btn">🔄</button>
            <button class="tool-btn">🗑️</button>
            <div class="separator"></div>
            <button class="close-btn" @click="emit('close')">✕</button>
          </div>
        </div>
        
        <div class="image-container">
          <button class="nav-btn side prev-side" @click="prev">‹</button>
          <img :src="currentPhoto.path" class="main-image" :key="currentPhoto.path" />
          <button class="nav-btn side next-side" @click="next">›</button>
        </div>
        
        <div class="viewer-footer">
          <button class="nav-btn prev" @click="prev">‹</button>
          <div class="filmstrip">
            <div 
              v-for="(photo, index) in photos" 
              :key="photo.path" 
              class="filmstrip-item"
              :class="{ active: index === currentIndex }"
              @click="currentIndex = index"
            >
              <img :src="photo.path" />
            </div>
          </div>
          <button class="nav-btn next" @click="next">›</button>
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
  height: calc(100% - 48px);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: view-in 0.3s cubic-bezier(0.1, 0.9, 0.2, 1);
}

@keyframes view-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}

.photo-viewer {
  width: 90%;
  height: 90%;
  background: #111;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
}

.viewer-header {
  height: 48px;
  background: #1a1a1a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  color: #fff;
  font-size: 13px;
}

.viewer-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tool-btn, .close-btn {
  background: transparent;
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tool-btn:hover, .close-btn:hover { background: rgba(255, 255, 255, 0.1); }
.close-btn:hover { background: #e81123; }

.separator {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 8px;
}

.image-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 20px;
  position: relative;
}

.nav-btn.side {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.3);
    border: none;
    color: #fff;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 0.2s, opacity 0.2s;
    opacity: 0;
    z-index: 10;
}

.image-container:hover .nav-btn.side {
    opacity: 1;
}

.nav-btn.side:hover {
    background: rgba(255, 255, 255, 0.1);
}

.prev-side { left: 20px; }
.next-side { right: 20px; }

.main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  box-shadow: 0 0 30px rgba(0,0,0,0.5);
  transition: opacity 0.2s ease-in-out;
}

.viewer-footer {
  height: 80px;
  background: #1a1a1a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  gap: 20px;
}

.filmstrip {
    flex: 1;
    display: flex;
    justify-content: center;
    gap: 8px;
    overflow-x: auto;
    padding: 10px 0;
}

.filmstrip-item {
    width: 60px;
    height: 40px;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.2s;
    opacity: 0.6;
}

.filmstrip-item:hover {
    opacity: 1;
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

.nav-btn {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.nav-btn:hover { background: rgba(255, 255, 255, 0.1); }

.photo-fade-enter-active, .photo-fade-leave-active {
  transition: opacity 0.3s ease;
}
.photo-fade-enter-from, .photo-fade-leave-to {
  opacity: 0;
}
</style>
