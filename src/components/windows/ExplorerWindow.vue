<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ResizableWindow from './ResizableWindow.vue'
import ExplorerTopBar from './ExplorerTopBar.vue'
import ExplorerSidebar from './ExplorerSidebar.vue'
import ExplorerMainView from './ExplorerMainView.vue'

const searchQuery = ref('')
const isMaximized = ref(false)

const handleSearch = (query) => {
  searchQuery.value = query
}

const props = defineProps({
  isOpen: Boolean,
  isMinimized: Boolean,
  zIndex: Number
})

const emit = defineEmits(['close', 'minimize', 'open-file'])

const currentPath = ref('Este Computador')
const history = ref(['Este Computador'])
const historyIndex = ref(0)

const canGoBack = computed(() => historyIndex.value > 0)
const canGoForward = computed(() => historyIndex.value < history.value.length - 1)

const navigateTo = (path, addToHistory = true) => {
  if (path === currentPath.value) return
  currentPath.value = path
  
  if (addToHistory) {
    history.value = history.value.slice(0, historyIndex.value + 1)
    history.value.push(path)
    historyIndex.value = history.value.length - 1
  }
}

const goBack = () => {
  if (canGoBack.value) {
    historyIndex.value--
    currentPath.value = history.value[historyIndex.value]
  }
}

const goForward = () => {
  if (canGoForward.value) {
    historyIndex.value++
    currentPath.value = history.value[historyIndex.value]
  }
}

const goUp = () => {
  if (currentPath.value !== 'Este Computador') {
    navigateTo('Este Computador')
  }
}

const windowWidth = ref(window.innerWidth)

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
          <div class="tab active">
            <span class="icon">🏠</span>
            <span class="label">Início</span>
            <span class="close-tab">✕</span>
          </div>
          <div class="add-tab">+</div>
        </div>
      </template>

      <div class="explorer-container" :class="{ maximized: isMaximized }">
        <ExplorerTopBar 
          :isMaximized="isMaximized"
          :currentPath="currentPath"
          :canGoBack="canGoBack"
          :canGoForward="canGoForward"
          :canGoUp="currentPath !== 'Este Computador'"
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
            :currentPath="currentPath"
            @navigate="navigateTo"
          />
          <ExplorerMainView 
            :currentPath="currentPath"
            @navigate="navigateTo"
            @open-file="path => emit('open-file', path)"
            :compact="!showSidebar"
            :searchQuery="searchQuery"
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
}

.tab {
  height: 32px;
  background: #f3f3f3;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  font-size: 12px;
  min-width: 160px;
  color: #333;
  border: 1px solid #ddd;
  border-bottom: none;
  cursor: default;
}

.tab.active {
  background: #fff;
  border-color: #ddd;
}

.close-tab {
  margin-left: auto;
  font-size: 10px;
  cursor: pointer;
}

.add-tab {
  padding: 0 8px;
  cursor: pointer;
  font-size: 16px;
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
