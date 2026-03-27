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
  { label: 'explorer.projects', icon: '/src/assets/windows/project.png', internalName: 'projects' },
  { label: 'explorer.resume', icon: '/src/assets/windows/pdf.svg', type: 'pdf', path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', labelText: 'Currículo.pdf' },
  { label: 'explorer.links', icon: '🌐', internalName: 'links' },
  { label: 'explorer.certificates', icon: '🏆', internalName: 'certificates' },
  { label: 'explorer.blog', icon: '📝', internalName: 'blog' }
]

const documentItems = [
  { label: 'Curriculum_Vitae.pdf', icon: '/src/assets/windows/pdf.svg', type: 'pdf', path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { label: 'Project_Proposal.pdf', icon: '/src/assets/windows/pdf.svg', type: 'pdf', path: 'https://pdfobject.com/pdf/sample.pdf' }
]

const imageItems = [
  { label: 'windows-wallpaper.png', icon: '🖼️', type: 'image', path: '/src/assets/windows/windows-wallpaper.png', thumbnail: '/src/assets/windows/windows-wallpaper.png' },
  { label: 'hero.png', icon: '🖼️', type: 'image', path: '/src/assets/hero.png', thumbnail: '/src/assets/hero.png' },
  { label: 'background_1.jpg', icon: '🖼️', type: 'image', path: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop' },
  { label: 'background_2.jpg', icon: '🖼️', type: 'image', path: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200&h=200&fit=crop' }
]

const displayItems = computed(() => {
  let items = []
  if (props.currentPath === 'pictures') items = imageItems
  else if (props.currentPath === 'documents') items = documentItems
  else if (props.currentPath === 'quick_access') items = rootItems
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
        emit('open-file', { type: 'image', path: item.path, list: imageItems, index })
    } else if (item.type === 'pdf') {
        emit('open-file', { type: 'pdf', path: item.path, label: item.labelText || item.label })
    } else {
        emit('navigate', item.internalName)
    }
}
</script>

<template>
  <div class="main-view" :class="{ compact: compact }">
    <div class="content-header">
      <h2 class="section-title">{{ i18n.t(`explorer.${currentPath}`) || currentPath }}</h2>
    </div>
    <div class="grid" :class="{ 'image-grid': currentPath === 'pictures' }">
      <div 
        v-for="item in displayItems" 
        :key="item.label" 
        class="grid-item"
        @dblclick="handleItemClick(item)"
      >
        <div class="icon-wrapper">
          <img v-if="item.type === 'image'" :src="item.thumbnail" class="thumbnail" loading="lazy" />
          <img v-else-if="item.icon && item.icon.includes('/')" :src="item.icon" width="48" height="48" />
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
  background: var(--win-bg);
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
  color: var(--win-text);
  border-bottom: 1px solid var(--win-border);
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
  background: var(--win-hover);
  border-color: var(--win-border);
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
  color: var(--win-text);
  text-align: center;
}
</style>
