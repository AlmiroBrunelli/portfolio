<script setup lang="ts">
import { ref, computed } from 'vue'
import ResizableWindow from './ResizableWindow.vue'
import { windowsState } from '../../store'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'Documento'
  },
  isOpen: Boolean,
  zIndex: Number,
  initialPos: {
    type: Object as () => { x: number, y: number } | null,
    default: null
  }
})

const emit = defineEmits(['close', 'minimize', 'maximize'])

const isMaximized = ref(false)

const pdfUrl = computed(() => {
  // If we wanted to add parameters like page number or zoom to the iframe src:
  // return `${props.src}#zoom=${zoomLevel.value}`
  return props.src
})

const printPdf = () => {
  // Printing embed objects is browser-dependent, usually done via browser UI
  // We'll try a generic print if possible or let the browser handle it
  window.print()
}
</script>

<template>
  <Transition name="pdf-fade">
    <ResizableWindow
      v-if="isOpen"
      :title="`${label} - PDF Reader`"
      icon="/src/assets/windows/pdf.svg"
      iconType="image"
      :darkMode="windowsState.theme === 'dark'"
      :initialSize="{ width: 900, height: 750 }"
      :initialPos="initialPos"
      :style="{ zIndex: zIndex }"
      @close="emit('close')"
      @minimize="emit('minimize')"
      @maximize="(val: boolean) => { isMaximized = val; emit('maximize', val) }"
    >
      <div class="pdf-viewer-container" :class="{ maximized: isMaximized }">
        <!-- PDF Toolbar -->
        <div class="pdf-toolbar">
          <div class="toolbar-left">
            <button class="toolbar-btn" title="Página anterior">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div class="page-indicator">
              <input type="text" value="1" class="page-input" />
              <span>/ 12</span>
            </div>
            <button class="toolbar-btn" title="Próxima página">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            
            <div class="separator"></div>
            
            <button class="toolbar-btn" title="Zoom Out">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
            <span class="zoom-text">100%</span>
            <button class="toolbar-btn" title="Zoom In">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
          </div>
          
          <div class="toolbar-right">
            <button class="toolbar-btn" title="Localizar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button class="toolbar-btn" @click="printPdf" title="Imprimir">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
              </svg>
            </button>
            <button class="toolbar-btn" title="Salvar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
              </svg>
            </button>
          </div>
        </div>

        <!-- PDF Content Area -->
        <div class="pdf-content">
          <embed 
            :src="pdfUrl" 
            type="application/pdf"
            class="pdf-view" 
          />
        </div>
      </div>
    </ResizableWindow>
  </Transition>
</template>

<style scoped>
.pdf-viewer-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--win-bg);
  overflow: hidden;
}

.pdf-toolbar {
  height: 48px;
  background: var(--win-bg);
  border-bottom: 1px solid var(--win-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  z-index: 10;
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-btn {
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: var(--win-text);
  transition: background 0.2s, color 0.2s;
}

.toolbar-btn:hover {
  background: var(--win-hover);
  color: var(--win-text);
}

.separator {
  width: 1px;
  height: 24px;
  background: var(--win-border);
  margin: 0 4px;
}

.page-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--win-text);
}

.page-input {
  width: 32px;
  height: 24px;
  text-align: center;
  background: var(--win-bg);
  border: 1px solid var(--win-border);
  border-radius: 4px;
  font-size: 13px;
  color: var(--win-text);
}

.zoom-text {
  font-size: 13px;
  color: var(--win-text);
  min-width: 40px;
  text-align: center;
}

.pdf-content {
  flex: 1;
  background: #525659; /* Standard dark background for PDF viewers */
  position: relative;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.pdf-view {
  width: 100%;
  height: 100%;
  border: none;
}

/* Transitions */
.pdf-fade-enter-active, .pdf-fade-leave-active { transition: opacity 0.2s; }
.pdf-fade-enter-from, .pdf-fade-leave-to { opacity: 0; }
</style>
