<script setup>
import { computed } from 'vue'
import { i18n } from '../../i18n'

const props = defineProps({
  currentPath: String,
  compact: Boolean,
  searchQuery: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['navigate', 'open-file'])

const rootItems = [
  { label: 'explorer.projects', icon: '🚀', internalName: 'Projetos' },
  { label: 'explorer.resume', icon: '📄', internalName: 'Currículo' },
  { label: 'explorer.links', icon: '🌐', internalName: 'Links' },
  { label: 'explorer.certificates', icon: '🏆', internalName: 'Certificados' },
  { label: 'explorer.blog', icon: '📝', internalName: 'Blog' }
]

const imageItems = [
  { label: 'windows-wallpaper.png', icon: '🖼️', type: 'image', path: '/src/assets/windows/windows-wallpaper.png' },
  { label: 'hero.png', icon: '🖼️', type: 'image', path: '/src/assets/hero.png' },
  { label: 'background_1.jpg', icon: '🖼️', type: 'image', path: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b' },
  { label: 'background_2.jpg', icon: '🖼️', type: 'image', path: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05' }
]

const displayItems = computed(() => {
  let items = []
  if (props.currentPath === 'Imagens') items = imageItems
  else if (props.currentPath === 'Este Computador') items = rootItems
  else return [] // Empty for other folders for now

  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase()
    return items.filter(item => item.label.toLowerCase().includes(query))
  }

  return items
})

const handleItemClick = (item) => {
    if (item.type === 'image') {
        const index = imageItems.findIndex(i => i.path === item.path)
        emit('open-file', { path: item.path, list: imageItems, index })
    } else {
        emit('navigate', item.internalName)
    }
}
</script>

<template>
  <div class="main-view" :class="{ compact: compact }">
    <div class="content-header">
      <h2 class="section-title">{{ currentPath === 'Este Computador' ? i18n.t('explorer.this_pc') : currentPath === 'Documentos' ? i18n.t('explorer.documents') : currentPath === 'Imagens' ? i18n.t('explorer.pictures') : currentPath === 'OneDrive' ? i18n.t('explorer.onedrive') : currentPath }}</h2>
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
        <span class="label">{{ item.type === 'image' ? item.label : i18n.t(item.label) }}</span>
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
  transition: padding 0.3s;
}

.main-view.compact {
  padding: 12px;
}

.content-header {
  margin-bottom: 20px;
}

.main-view.compact .content-header {
  margin-bottom: 12px;
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

.main-view.compact .grid {
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
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
