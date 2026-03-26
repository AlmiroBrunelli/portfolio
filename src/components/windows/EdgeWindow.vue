<script setup>
import { ref, watch, computed } from 'vue'
import ResizableWindow from './ResizableWindow.vue'

const props = defineProps({
  zIndex: Number,
  isMinimized: Boolean,
  initialPos: {
    type: Object,
    default: null
  },
  initialUrl: {
    type: String,
    default: 'https://www.google.com/search?igu=1'
  }
})

const emit = defineEmits(['close', 'minimize', 'maximize', 'mousedown'])

const tabs = ref([
  { 
    id: 1, 
    title: 'Google', 
    url: 'https://www.google.com/search?igu=1',
    history: ['https://www.google.com/search?igu=1'],
    historyIndex: 0
  }
])
const activeTabId = ref(1)
const urlInput = ref('')

const activeTab = computed(() => tabs.value.find(t => t.id === activeTabId.value) || tabs.value[0])

const canGoBack = computed(() => activeTab.value.historyIndex > 0)
const canGoForward = computed(() => activeTab.value.historyIndex < activeTab.value.history.length - 1)

// Sync urlInput when tab changes
watch(activeTabId, () => {
  urlInput.value = activeTab.value.url
}, { immediate: true })

const navigate = () => {
  let url = urlInput.value.trim()
  if (!url) return
  
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }
  
  // Update current tab state
  activeTab.value.url = url
  activeTab.value.title = url.replace('https://', '').replace('http://', '').split('/')[0]
  urlInput.value = url

  // Manage history
  const currentHistory = activeTab.value.history
  if (url !== currentHistory[activeTab.value.historyIndex]) {
    // Truncate any forward history and push new
    activeTab.value.history = currentHistory.slice(0, activeTab.value.historyIndex + 1)
    activeTab.value.history.push(url)
    activeTab.value.historyIndex = activeTab.value.history.length - 1
  }
}

const goBack = () => {
  if (canGoBack.value) {
    activeTab.value.historyIndex--
    activeTab.value.url = activeTab.value.history[activeTab.value.historyIndex]
    urlInput.value = activeTab.value.url
  }
}

const goForward = () => {
  if (canGoForward.value) {
    activeTab.value.historyIndex++
    activeTab.value.url = activeTab.value.history[activeTab.value.historyIndex]
    urlInput.value = activeTab.value.url
  }
}

const addTab = () => {
  const newId = Date.now()
  const defaultUrl = 'https://www.google.com/search?igu=1'
  tabs.value.push({
    id: newId,
    title: 'Nova Guia',
    url: defaultUrl,
    history: [defaultUrl],
    historyIndex: 0
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

const refresh = () => {
  const temp = activeTab.value.url
  activeTab.value.url = ''
  setTimeout(() => {
    activeTab.value.url = temp
  }, 10)
}

const goHome = () => {
  urlInput.value = 'https://www.google.com/search?igu=1'
  navigate()
}
</script>

<template>
  <ResizableWindow
    title="Microsoft Edge"
    icon="../../assets/windows/ms-edge.png"
    iconType="image"
    :initialSize="{ width: 1000, height: 750 }"
    :minWidth="400"
    :minHeight="300"
    :initialPos="initialPos"
    :style="{ zIndex: zIndex }"
    @close="emit('close')"
    @minimize="emit('minimize')"
    @maximize="emit('maximize')"
    @mousedown="emit('mousedown')"
  >
    <div class="edge-container">
      <!-- Tabs Bar -->
      <div class="edge-tabs-bar">
        <div class="tabs-scroll-area">
          <div 
            v-for="tab in tabs" 
            :key="tab.id"
            class="edge-tab"
            :class="{ active: activeTabId === tab.id }"
            @click="activeTabId = tab.id"
            @auxclick.prevent.stop="e => { if (e.button === 1) closeTab(tab.id, e) }"
          >
            <img src="../../assets/windows/ms-edge.png" width="14" height="14" class="tab-icon" />
            <span class="tab-title">{{ tab.title }}</span>
            <button class="tab-close" @click="closeTab(tab.id, $event)">✕</button>
          </div>
        </div>
        <button class="add-tab-btn" @click="addTab" title="Nova guia">+</button>
      </div>

      <div class="edge-toolbar">
        <div class="nav-actions">
          <button class="tool-btn" title="Voltar" @click="goBack" :disabled="!canGoBack">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button class="tool-btn" title="Avançar" @click="goForward" :disabled="!canGoForward">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
          </button>
          <button class="tool-btn" title="Atualizar" @click="refresh">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          </button>
          <button class="tool-btn" title="Página Inicial" @click="goHome">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </button>
        </div>

        <div class="address-bar">
          <div class="security-info">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <input 
            type="text" 
            v-model="urlInput" 
            @keydown.enter="navigate"
            spellcheck="false"
          />
          <div class="address-actions">
            <button class="star-btn" title="Adicionar aos favoritos">⭐</button>
          </div>
        </div>

        <div class="edge-extensions">
          <button class="tool-btn">🧩</button>
          <button class="tool-btn">👤</button>
          <button class="tool-btn">⋯</button>
        </div>
      </div>

      <div class="browser-content">
        <template v-for="tab in tabs" :key="tab.id">
          <iframe 
            v-if="tab.url"
            v-show="activeTabId === tab.id"
            :src="tab.url" 
            frameborder="0"
            allowfullscreen
            sandbox="allow-scripts allow-forms"
          ></iframe>
        </template>
      </div>
    </div>
  </ResizableWindow>
</template>

<style scoped>
.edge-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f7f9fa;
}

.edge-tabs-bar {
  height: 40px;
  background: #e3e7ea;
  display: flex;
  align-items: flex-end;
  padding: 0 40px 0 8px;
  gap: 4px;
  position: relative;
}

.tabs-scroll-area {
  display: flex;
  gap: 2px;
  overflow-x: auto;
  scrollbar-width: none;
}
.tabs-scroll-area::-webkit-scrollbar { display: none; }

.edge-tab {
  height: 34px;
  min-width: 120px;
  max-width: 200px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 8px;
  font-size: 12px;
  color: #444;
  cursor: pointer;
  border: 1px solid transparent;
  border-bottom: none;
  position: relative;
  transition: background 0.2s;
}

.edge-tab:hover {
  background: rgba(255, 255, 255, 0.8);
}

.edge-tab.active {
  background: #f7f9fa;
  color: #000;
  z-index: 2;
}

.tab-icon {
  flex-shrink: 0;
}

.tab-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-close {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: none;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  cursor: pointer;
  opacity: 0;
}

.edge-tab:hover .tab-close { opacity: 0.6; }
.tab-close:hover { background: rgba(0,0,0,0.1); opacity: 1 !important; }

.add-tab-btn {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: none;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 4px;
}

.add-tab-btn:hover { background: rgba(0,0,0,0.05); }

.edge-toolbar {
  height: 48px;
  background: #f7f9fa;
  border-bottom: 1px solid #dde1e5;
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 8px;
}

.nav-actions {
  display: flex;
  gap: 2px;
}

.tool-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #444;
}

.tool-btn:hover:not(:disabled) {
  background: rgba(0,0,0,0.08);
}

.tool-btn:disabled {
  color: #ccc;
  cursor: default;
}

.address-bar {
  flex: 1;
  height: 32px;
  background: #fff;
  border: 1px solid #dde1e5;
  border-radius: 16px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.address-bar:focus-within {
  border-color: #0078d4;
  box-shadow: 0 0 0 1px #0078d4;
}

.address-bar input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #333;
}

.security-info {
  display: flex;
  align-items: center;
}

.address-actions {
  display: flex; gap: 4px;
}

.star-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.6;
}

.star-btn:hover { opacity: 1; }

.browser-content {
  flex: 1;
  background: #fff;
  position: relative;
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.edge-extensions {
  display: flex;
  gap: 2px;
}
</style>
