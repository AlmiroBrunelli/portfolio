<script setup>
import { i18n } from '../../i18n'
defineProps({
  isMaximized: Boolean,
  currentPath: String,
  canGoBack: Boolean,
  canGoForward: Boolean,
  canGoUp: Boolean
})

const emit = defineEmits([
  'minimize', 
  'maximize', 
  'close', 
  'dragstart', 
  'navigate',
  'back',
  'forward',
  'up',
  'refresh',
  'search'
])

import { ref, watch } from 'vue'

const searchQuery = ref('')

watch(searchQuery, (newVal) => {
  emit('search', newVal)
})

const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<template>
  <div class="explorer-nav-toolbar">
    <div class="address-bar-container">
      <div class="nav-buttons">
        <button 
          class="nav-btn" 
          :class="{ disabled: !canGoBack }" 
          :title="i18n.t('explorer.back')"
          @click="canGoBack && emit('back')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button 
          class="nav-btn" 
          :class="{ disabled: !canGoForward }" 
          :title="i18n.t('explorer.forward')"
          @click="canGoForward && emit('forward')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </button>
        <button 
          class="nav-btn" 
          :class="{ disabled: !canGoUp }" 
          :title="i18n.t('explorer.up')"
          @click="canGoUp && emit('up')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 15l6-6 6 6"/>
          </svg>
        </button>
        <button 
          class="nav-btn" 
          :title="i18n.t('explorer.refresh')"
          @click="emit('refresh')"
        >↻</button>
      </div>
      
      <div class="address-box">
        <div class="address-icon">{{ currentPath === 'Imagens' ? '🖼️' : '🏠' }}</div>
        <div class="breadcrumbs">
          <span class="crumb" @click="emit('navigate', 'Este Computador')">{{ i18n.t('explorer.this_pc') }}</span>
          <template v-if="currentPath !== 'Este Computador'">
            <span class="separator">></span>
            <span class="crumb" @click="emit('navigate', currentPath)">{{ currentPath === 'Documentos' ? i18n.t('explorer.documents') : currentPath === 'Imagens' ? i18n.t('explorer.pictures') : currentPath === 'OneDrive' ? i18n.t('explorer.onedrive') : currentPath === 'Rede' ? i18n.t('explorer.network') : currentPath }}</span>
          </template>
        </div>
      </div>
      
      <div class="search-box">
        <input type="text" v-model="searchQuery" :placeholder="i18n.t('explorer.search_in') + (currentPath === 'Este Computador' ? i18n.t('explorer.this_pc') : currentPath === 'Documentos' ? i18n.t('explorer.documents') : currentPath === 'Imagens' ? i18n.t('explorer.pictures') : currentPath === 'Rede' ? i18n.t('explorer.network') : currentPath)" />
        <span v-if="searchQuery" class="clear-icon" @click="clearSearch" :title="i18n.t('explorer.clear_search')">✕</span>
        <span class="search-icon">
          <img src="../../assets/windows/search.png" width="14" height="14" :alt="i18n.t('explorer.search_in')" />
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.explorer-header {
  display: flex;
  flex-direction: column;
  background: #f3f3f3;
  user-select: none;
}

.explorer-nav-toolbar {
  display: flex;
  flex-direction: column;
  background: #f3f3f3;
  user-select: none;
}

.address-bar-container {
  height: 48px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 12px;
  border-bottom: 1px solid #e5e5e5;
}

.nav-buttons {
  display: flex;
  gap: 4px;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  color: #555;
}

.nav-btn:hover { background: rgba(0,0,0,0.05); }
.nav-btn.disabled {
  opacity: 0.3;
  cursor: default;
  pointer-events: none;
}

.address-box {
  flex: 1;
  height: 32px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 8px;
  font-size: 13px;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #333;
}

.crumb:hover { text-decoration: underline; cursor: pointer; }
.separator { color: #999; }

.search-box {
  width: 280px;
  height: 32px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 10px;
  position: relative;
  transition: background 0.2s, border-color 0.2s;
}

.search-box:hover {
  background: #fdfdfd;
  border-color: #ccc;
}

.search-box::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: transparent;
  transition: background 0.2s;
}

.search-box:focus-within::after {
  background: #0078d4;
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  background: transparent;
  color: #333;
}

.clear-icon {
  cursor: pointer;
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
}

.clear-icon:hover {
  color: #333;
}

.search-icon { 
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888; 
  font-size: 14px; 
}

/* Responsiveness */
@media (max-width: 800px) {
    .search-box { width: 150px; }
}

@media (max-width: 650px) {
    .search-box { display: none; }
    .tab { min-width: 120px; }
}

@media (max-width: 500px) {
    .address-box { display: none; }
    .nav-buttons { gap: 2px; }
    .nav-buttons .nav-btn { width: 28px; height: 28px; font-size: 14px; }
}
</style>
