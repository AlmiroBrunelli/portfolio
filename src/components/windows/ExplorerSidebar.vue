<script setup>
import { i18n } from '../../i18n'
defineProps({
  currentPath: String
})

const emit = defineEmits(['navigate'])

const navItems = [
  { label: 'explorer.quick_access', icon: '⭐', internalName: 'quick_access' },
  { label: 'explorer.onedrive', icon: '☁️', internalName: 'onedrive' },
  { label: 'explorer.this_pc', icon: '/src/assets/windows/pc.svg', internalName: 'this_pc', isImage: true },
  { label: 'explorer.network', icon: '🌐', internalName: 'network' }
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
        <span class="icon">📁</span>
        <span class="label">{{ i18n.t('explorer.documents') }}</span>
      </div>
      <div 
        class="nav-item" 
        :class="{ active: currentPath === 'pictures' }"
        @click="emit('navigate', 'pictures')"
      >
        <span class="icon">🖼️</span>
        <span class="label">{{ i18n.t('explorer.pictures') }}</span>
      </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background: rgba(243, 243, 243, 0.7);
  backdrop-filter: blur(10px);
  border-right: 1px solid #e5e5e5;
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
  color: #333;
}

.nav-item:hover {
  background: rgba(0,0,0,0.05);
}

.nav-item.active {
  background: rgba(0,0,0,0.05);
  font-weight: 600;
}

.icon {
  font-size: 16px;
}

.separator {
  height: 1px;
  background: #e5e5e5;
  margin: 8px 12px;
}

.nav-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
}
</style>
