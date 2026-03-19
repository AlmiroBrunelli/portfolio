<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import ResizableWindow from './ResizableWindow.vue'
import ExplorerTopBar from './ExplorerTopBar.vue'
import ExplorerSidebar from './ExplorerSidebar.vue'
import ExplorerMainView from './ExplorerMainView.vue'

const props = defineProps({
  isOpen: Boolean,
  isMinimized: Boolean,
  zIndex: Number
})

const emit = defineEmits(['close', 'minimize', 'open-file', 'update-path'])

const isMaximized = ref(false)
const windowWidth = ref(window.innerWidth)

const tabs = ref([
  { 
    id: 1, 
    path: 'Este Computador', 
    history: ['Este Computador'], 
    historyIndex: 0,
    searchQuery: ''
  }
])
const activeTabId = ref(1)

const activeTab = computed(() => tabs.value.find(t => t.id === activeTabId.value) || tabs.value[0])

watch(() => activeTab.value?.path, (newPath) => {
  if (newPath) emit('update-path', newPath)
}, { immediate: true })

const canGoBack = computed(() => activeTab.value.historyIndex > 0)
const canGoForward = computed(() => activeTab.value.historyIndex < activeTab.value.history.length - 1)

const navigateTo = (path, addToHistory = true) => {
  if (path === activeTab.value.path) return
  activeTab.value.path = path
  
  if (addToHistory) {
    activeTab.value.history = activeTab.value.history.slice(0, activeTab.value.historyIndex + 1)
    activeTab.value.history.push(path)
    activeTab.value.historyIndex = activeTab.value.history.length - 1
  }
}

const goBack = () => {
  if (canGoBack.value) {
    activeTab.value.historyIndex--
    activeTab.value.path = activeTab.value.history[activeTab.value.historyIndex]
  }
}

const goForward = () => {
  if (canGoForward.value) {
    activeTab.value.historyIndex++
    activeTab.value.path = activeTab.value.history[activeTab.value.historyIndex]
  }
}

const goUp = () => {
  if (activeTab.value.path !== 'Este Computador') {
    navigateTo('Este Computador')
  }
}

const handleSearch = (query) => {
  activeTab.value.searchQuery = query
}

const addTab = () => {
  const newId = Date.now()
  tabs.value.push({
    id: newId,
    path: 'Este Computador',
    history: ['Este Computador'],
    historyIndex: 0,
    searchQuery: ''
  })
  activeTabId.value = newId
}

const closeTab = (id, event) => {
  event?.stopPropagation()
  if (tabs.value.length === 1) {
    emit('close')
    return
  }
  
  const index = tabs.value.findIndex(t => t.id === id)
  if (activeTabId.value === id) {
    const nextTab = tabs.value[index + 1] || tabs.value[index - 1]
    activeTabId.value = nextTab.id
  }
  tabs.value.splice(index, 1)
}

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

const showSidebar = computed(() => windowWidth.value > 750)

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <Transition name="window">
    <ResizableWindow 
      v-if="isOpen && !isMinimized"
      title="Explorador de Arquivos"
      icon="📁"
      :darkMode="false"
      :showTitle="false"
      :showIcon="false"
      :initialSize="{ width: 1000, height: 650 }"
      :style="{ zIndex: zIndex }"
      @close="emit('close')"
      @minimize="emit('minimize')"
      @maximize="val => isMaximized = val"
    >
      <template #header-center>
        <div class="explorer-tabs">
          <div 
            v-for="tab in tabs" 
            :key="tab.id"
            class="tab"
            :class="{ active: activeTabId === tab.id }"
            @click="activeTabId = tab.id"
            @auxclick.prevent.stop="e => { if (e.button === 1) closeTab(tab.id) }"
          >
            <span class="icon">
              {{ tab.path === 'Imagens' ? '🖼️' : tab.path === 'Documentos' ? '📄' : tab.path === 'OneDrive' ? '☁️' : '🏠' }}
            </span>
            <span class="label">{{ tab.path }}</span>
            <span class="close-tab" @click="closeTab(tab.id, $event)">✕</span>
          </div>
          <div class="add-tab" @click="addTab" title="Nova aba">+</div>
        </div>
      </template>

      <div class="explorer-container" :class="{ maximized: isMaximized }">
        <ExplorerTopBar 
          :isMaximized="isMaximized"
          :currentPath="activeTab.path"
          :canGoBack="canGoBack"
          :canGoForward="canGoForward"
          :canGoUp="activeTab.path !== 'Este Computador'"
          @navigate="navigateTo"
          @back="goBack"
          @forward="goForward"
          @up="goUp"
          @refresh="() => {}"
          @search="handleSearch"
        />
        
        <div class="window-body">
          <ExplorerSidebar 
            v-if="showSidebar"
            :currentPath="activeTab.path"
            @navigate="navigateTo"
          />
          <ExplorerMainView 
            :currentPath="activeTab.path"
            @navigate="navigateTo"
            @open-file="path => emit('open-file', path)"
            :compact="!showSidebar"
            :searchQuery="activeTab.searchQuery"
          />
        </div>
      </div>
    </ResizableWindow>
  </Transition>
</template>

<style scoped>
.explorer-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  background: #fff;
}

.explorer-tabs {
  display: flex;
  align-items: flex-end;
  height: 100%;
  gap: 2px;
  padding-left: 2px;
  padding-top: 4px;
}

.tab {
  height: 32px;
  background: rgba(243, 243, 243, 0.8);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  font-size: 11px;
  min-width: 140px;
  max-width: 200px;
  color: #555;
  border: 1px solid transparent;
  border-bottom: none;
  cursor: pointer;
  transition: background 0.2s;
}

.tab:hover {
  background: #fdfdfd;
}

.tab.active {
  background: #fff;
  border-color: #ddd;
  color: #000;
  box-shadow: 0 -2px 5px rgba(0,0,0,0.02);
}

.close-tab {
  margin-left: auto;
  font-size: 9px;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-tab:hover {
  background: rgba(0,0,0,0.1);
}

.add-tab {
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
  border-radius: 4px;
  margin-bottom: 2px;
  color: #555;
}

.add-tab:hover {
  background: rgba(0,0,0,0.05);
}

.window-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Window Transitions */
.window-enter-active {
  animation: win-open 0.25s cubic-bezier(0.1, 0.9, 0.2, 1);
}
.window-leave-active {
  animation: win-close 0.2s cubic-bezier(0.1, 0.9, 0.2, 1);
}

@keyframes win-open {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes win-close {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95); }
}
</style>
