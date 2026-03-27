<script setup lang="ts">
import { ref, computed } from 'vue'
import { i18n } from '../../i18n'
import { useContextMenu, type ContextMenuItem } from '../../utils/useContextMenu'

const props = defineProps({
  currentPath: String,
  compact: Boolean,
  searchQuery: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['navigate', 'open-file'])

const { showMenu } = useContextMenu()

interface ExplorerItem {
  label: string;
  icon?: string;
  type?: 'folder' | 'txt' | 'image' | 'pdf';
  path?: string;
  thumbnail?: string;
  labelText?: string;
  internalName?: string;
}

const rootItems = ref<ExplorerItem[]>([
  { label: 'explorer.projects', icon: '/src/assets/windows/project.png', internalName: 'projects' },
  { label: 'explorer.resume', icon: '/src/assets/windows/pdf.svg', type: 'pdf', path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', labelText: 'Currículo.pdf' },
  { label: 'explorer.links', icon: '🌐', internalName: 'links' },
  { label: 'explorer.certificates', icon: '🏆', internalName: 'certificates' },
  { label: 'explorer.blog', icon: '📝', internalName: 'blog' }
])

const documentItems = ref<ExplorerItem[]>([
  { label: 'Curriculum_Vitae.pdf', icon: '/src/assets/windows/pdf.svg', type: 'pdf', path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { label: 'Project_Proposal.pdf', icon: '/src/assets/windows/pdf.svg', type: 'pdf', path: 'https://pdfobject.com/pdf/sample.pdf' }
])

const imageItems = ref<ExplorerItem[]>([
  { label: 'windows-wallpaper.png', icon: '🖼️', type: 'image', path: '/src/assets/windows/windows-wallpaper.png', thumbnail: '/src/assets/windows/windows-wallpaper.png' },
  { label: 'hero.png', icon: '🖼️', type: 'image', path: '/src/assets/hero.png', thumbnail: '/src/assets/hero.png' },
  { label: 'background_1.jpg', icon: '🖼️', type: 'image', path: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop' },
  { label: 'background_2.jpg', icon: '🖼️', type: 'image', path: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200&h=200&fit=crop' }
])

const displayItems = computed(() => {
  let items: ExplorerItem[] = []
  if (props.currentPath === 'pictures') items = imageItems.value
  else if (props.currentPath === 'documents') items = documentItems.value
  else if (props.currentPath === 'quick_access' || props.currentPath === 'this_pc') items = rootItems.value
  else return []

  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase()
    return items.filter(item => {
      const trans = i18n.t(item.label)
      const labelText = item.labelText || (trans !== item.label ? trans : item.label)
      return labelText.toLowerCase().includes(query)
    })
  }

  return items
})

const handleCreateNew = (type: 'folder' | 'txt') => {
  const currentList = props.currentPath === 'pictures' ? imageItems.value :
                   props.currentPath === 'documents' ? documentItems.value :
                   rootItems.value
                   
  const count = currentList.filter(item => item.label.includes(type === 'folder' ? 'Nova Pasta' : 'Novo Arquivo')).length
  const label = type === 'folder' 
    ? `Nova Pasta${count > 0 ? ` (${count})` : ''}`
    : `Novo Arquivo de Texto${count > 0 ? ` (${count})` : ''}.txt`

  currentList.push({
    label,
    icon: type === 'folder' ? '📁' : '📄',
    type: type,
    path: '#' // placeholder
  })
}

const handleContextMenu = (e: MouseEvent) => {
  const items: ContextMenuItem[] = [
    { 
      label: 'Novo', 
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="8" cy="8" r="6"/><path d="M8 5v6M5 8h6"/></svg>',
      submenu: [
        { label: 'Pasta', action: () => handleCreateNew('folder') },
        { label: 'Documento de Texto', action: () => handleCreateNew('txt') }
      ]
    }
  ]
  showMenu(e, items)
}

const handleItemClick = (item: ExplorerItem) => {
    if (item.type === 'image') {
        const index = imageItems.value.findIndex(i => i.path === item.path)
        emit('open-file', { type: 'image', path: item.path, list: imageItems.value, index })
    } else if (item.type === 'pdf') {
        emit('open-file', { type: 'pdf', path: item.path, label: item.labelText || item.label })
    } else if (item.internalName) {
        emit('navigate', item.internalName)
    }
}
</script>

<template>
  <div class="main-view" :class="{ compact: compact }" @contextmenu.stop.prevent="handleContextMenu">
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
