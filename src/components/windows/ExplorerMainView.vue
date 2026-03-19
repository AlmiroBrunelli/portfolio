<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPath: String
})

const emit = defineEmits(['navigate', 'open-file'])

const rootItems = [
  { label: 'Projetos', icon: '🚀' },
  { label: 'Currículo', icon: '📄' },
  { label: 'Links', icon: '🌐' },
  { label: 'Certificados', icon: '🏆' },
  { label: 'Blog', icon: '📝' }
]

const imageItems = [
  { label: 'windows-wallpaper.png', icon: '🖼️', type: 'image', path: '/src/assets/windows-wallpaper.png' },
  { label: 'hero.png', icon: '🖼️', type: 'image', path: '/src/assets/hero.png' },
  { label: 'background_1.jpg', icon: '🖼️', type: 'image', path: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b' },
  { label: 'background_2.jpg', icon: '🖼️', type: 'image', path: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05' }
]

const displayItems = computed(() => {
  if (props.currentPath === 'Imagens') return imageItems
  if (props.currentPath === 'Este Computador') return rootItems
  return [] // Empty for other folders for now
})

const handleItemClick = (item) => {
    if (item.type === 'image') {
        const index = imageItems.findIndex(i => i.path === item.path)
        emit('open-file', { path: item.path, list: imageItems, index })
    } else {
        emit('navigate', item.label)
    }
}
</script>

<template>
  <div class="main-view">
    <div class="content-header">
      <h2 class="section-title">{{ currentPath }}</h2>
    </div>
    <div class="grid" :class="{ 'image-grid': currentPath === 'Imagens' }">
      <div 
        v-for="item in displayItems" 
        :key="item.label" 
        class="grid-item"
        @dblclick="handleItemClick(item)"
      >
        <div class="icon-wrapper">
          <img v-if="item.type === 'image'" :src="item.path" class="thumbnail" />
          <span v-else class="icon">{{ item.icon }}</span>
        </div>
        <span class="label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-view {
  flex: 1;
  background: #fff;
  padding: 24px;
  overflow-y: auto;
}

.content-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 24px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  border: 1px solid transparent;
}

.grid-item:hover {
  background: rgba(0, 120, 212, 0.05);
  border-color: rgba(0, 120, 212, 0.1);
}

.icon-wrapper {
  font-size: 48px;
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;
}

.grid-item:hover .thumbnail {
  transform: scale(1.05);
}

.image-grid {
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}

.label {
  font-size: 13px;
  color: #333;
  text-align: center;
}
</style>
