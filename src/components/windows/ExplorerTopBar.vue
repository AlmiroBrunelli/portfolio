<script setup>
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
  <div class="explorer-header">
    <div class="title-bar" @mousedown="$emit('dragstart', $event)" @dblclick="$emit('maximize')">
      <div class="tabs-container">
        <div class="tab active">
          <span class="icon">🏠</span>
          <span class="label">Início</span>
          <span class="close-tab">✕</span>
        </div>
        <div class="add-tab">+</div>
      </div>
      <div class="window-controls">
        <div class="control-btn" @click.stop="$emit('minimize')">
          <img src="../../assets/windows/minimize.png" width="12" height="12" alt="Minimizar" />
        </div>
        <div class="control-btn" @click.stop="$emit('maximize')">
          {{ isMaximized ? '❐' : '□' }}
        </div>
        <div class="control-btn close" @click.stop="$emit('close')">✕</div>
      </div>
    </div>
    
    <div class="address-bar-container">
      <div class="nav-buttons">
        <button 
          class="nav-btn" 
          :class="{ disabled: !canGoBack }" 
          title="Voltar"
          @click="canGoBack && emit('back')"
        >←</button>
        <button 
          class="nav-btn" 
          :class="{ disabled: !canGoForward }" 
          title="Avançar"
          @click="canGoForward && emit('forward')"
        >→</button>
        <button 
          class="nav-btn" 
          :class="{ disabled: !canGoUp }" 
          title="Subir"
          @click="canGoUp && emit('up')"
        >↑</button>
        <button 
          class="nav-btn" 
          title="Atualizar"
          @click="emit('refresh')"
        >↻</button>
      </div>
      
      <div class="address-box">
        <div class="address-icon">{{ currentPath === 'Imagens' ? '🖼️' : '🏠' }}</div>
        <div class="breadcrumbs">
          <span class="crumb" @click="emit('navigate', 'Este Computador')">Este Computador</span>
          <template v-if="currentPath !== 'Este Computador'">
            <span class="separator">></span>
            <span class="crumb" @click="emit('navigate', currentPath)">{{ currentPath }}</span>
          </template>
        </div>
      </div>
      
      <div class="search-box">
        <input type="text" v-model="searchQuery" :placeholder="'Pesquisar em ' + currentPath" />
        <span v-if="searchQuery" class="clear-icon" @click="clearSearch" title="Limpar pesquisa">✕</span>
        <span class="search-icon">
          <img src="../../assets/windows/search.png" width="14" height="14" alt="Pesquisar" />
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

.title-bar {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-left: 10px;
}

.tabs-container {
  display: flex;
  align-items: flex-end;
  height: 100%;
  gap: 4px;
}

.tab {
  height: 32px;
  background: #fff;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  font-size: 12px;
  min-width: 160px;
  box-shadow: 0 -2px 5px rgba(0,0,0,0.05);
  position: relative;
  color: #1a1a1a;
}

.tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 1px;
    background: #fff;
}

.close-tab {
  margin-left: auto;
  opacity: 0.6;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
}

.close-tab:hover {
  background: rgba(0,0,0,0.1);
  opacity: 1;
}

.add-tab {
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  margin-bottom: 4px;
  color: #1a1a1a;
}

.add-tab:hover { background: rgba(0,0,0,0.05); }

.window-controls {
  display: flex;
  height: 100%;
  align-items: flex-start;
}

.control-btn {
  width: 46px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
  color: #1a1a1a;
}

.control-btn:hover { background: rgba(0,0,0,0.1); }
.control-btn.close:hover { background: #e81123; color: white; }

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
