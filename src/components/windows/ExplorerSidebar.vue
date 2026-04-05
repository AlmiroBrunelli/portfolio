<script setup>
import { i18n } from '../../i18n'
defineProps({
  currentPath: String
})

const emit = defineEmits(['navigate'])

const navItems = [
  { label: 'explorer.home', icon: '/src/assets/windows/home.png', internalName: 'home', isImage: true },
  { label: 'explorer.onedrive', icon: '/src/assets/windows/onedrive.png', internalName: 'onedrive', isImage: true },
  { label: 'explorer.this_pc', icon: '/src/assets/windows/pc.png', internalName: 'this_pc', isImage: true },
  { label: 'explorer.network', icon: '/src/assets/windows/network.png', internalName: 'network', isImage: true }
]
</script>

<template>
  <div class="sidebar">
    <div 
      v-for="item in navItems" 
      :key="item.label" 
      class="nav-item" 
      :class="{ active: currentPath === item.internalName }"
      @click="emit('navigate', item.internalName)"
    >
      <span class="icon">
        <img v-if="item.isImage" :src="item.icon" width="16" height="16" style="display: block" />
        <template v-else>{{ item.icon }}</template>
      </span>
      <span class="label">{{ i18n.t(item.label) }}</span>
    </div>
    
    <div class="separator"></div>
    
      <div 
        class="nav-item" 
        :class="{ active: currentPath === 'documents' }"
        @click="emit('navigate', 'documents')"
      >
        <span class="icon">
          <img src="/src/assets/windows/documents.png" width="16" height="16" style="display: block" />
        </span>
        <span class="label">{{ i18n.t('explorer.documents') }}</span>
      </div>
      <div 
        class="nav-item" 
        :class="{ active: currentPath === 'pictures' }"
        @click="emit('navigate', 'pictures')"
      >
        <span class="icon">
          <img src="/src/assets/windows/pictures.png" width="16" height="16" style="display: block" />
        </span>
        <span class="label">{{ i18n.t('explorer.pictures') }}</span>
      </div>
      <div 
        class="nav-item" 
        :class="{ active: currentPath === 'music' }"
        @click="emit('navigate', 'music')"
      >
        <span class="icon">
          <img src="/src/assets/windows/music.png" width="16" height="16" style="display: block" />
        </span>
        <span class="label">{{ i18n.t('explorer.music') }}</span>
      </div>
      <div 
        class="nav-item" 
        :class="{ active: currentPath === 'videos' }"
        @click="emit('navigate', 'videos')"
      >
        <span class="icon">
          <img src="/src/assets/windows/videos.png" width="16" height="16" style="display: block" />
        </span>
        <span class="label">{{ i18n.t('explorer.videos') }}</span>
      </div>
      <div 
        class="nav-item" 
        :class="{ active: currentPath === 'downloads' }"
        @click="emit('navigate', 'downloads')"
      >
        <span class="icon">
          <img src="/src/assets/windows/downloads.png" width="16" height="16" style="display: block" />
        </span>
        <span class="label">{{ i18n.t('explorer.downloads') }}</span>
      </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background: var(--win-glass-bg);
  backdrop-filter: blur(10px);
  border-right: 1px solid var(--win-border);
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  gap: 12px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.1s;
  color: var(--win-text);
}

.nav-item:hover {
  background: var(--win-hover);
}

.nav-item.active {
  background: var(--win-hover);
  font-weight: 600;
}

.icon {
  font-size: 16px;
}

.separator {
  height: 1px;
  background: var(--win-border);
  margin: 8px 12px;
}

.nav-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
}
</style>
