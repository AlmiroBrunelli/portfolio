<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ExplorerWindow from './windows/ExplorerWindow.vue'
import Taskbar from './windows/Taskbar.vue'
import StartMenu from './windows/StartMenu.vue'
import PhotoViewer from './windows/PhotoViewer.vue'
import Calculator from './windows/Calculator.vue'
import EdgeWindow from './windows/EdgeWindow.vue'
import PdfReader from './windows/PdfReader.vue'
import Personalization from './windows/Personalization.vue'
import ResizableWindow from './windows/ResizableWindow.vue'
import ContextMenu from './common/ContextMenu.vue'
import { windowsState } from '../store'
import { useContextMenu, type ContextMenuItem } from '../utils/useContextMenu'

const isExplorerOpen = ref(true)
const isExplorerMinimized = ref(false)
const isStartMenuOpen = ref(false)
const isCalculatorOpen = ref(false)
const isCalculatorMinimized = ref(false)
const isEdgeOpen = ref(false)
const isEdgeMinimized = ref(false)
const isPersonalizationOpen = ref(false)
const personalizationPos = ref<{x: number, y: number} | null>(null)
const openedPhoto = ref<string | null>(null)
const photoList = ref<string[]>([])
const photoIndex = ref(0)
const isPhotoViewerMinimized = ref(false)
const explorerPath = ref('Este Computador')
const focusedApp = ref<string | null>('Explorer')

const { showMenu } = useContextMenu()

const handleDesktopContextMenu = (e: MouseEvent) => {
  const items: ContextMenuItem[] = [
    { 
      label: 'Exibir', 
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="2" y="2" width="5" height="5" /><rect x="9" y="2" width="5" height="5" /><rect x="2" y="9" width="5" height="5" /><rect x="9" y="9" width="5" height="5" /></svg>',
      submenu: [
        { label: 'Ícones grandes' },
        { label: 'Ícones médios' },
        { label: 'Ícones pequenos' }
      ]
    },
    { 
      label: 'Classificar por', 
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M4 4l0 8m0 0l-2-2m2 2l2-2M12 12l0-8m0 0l-2 2m2-2l2 2"/></svg>',
      submenu: [
        { label: 'Nome' },
        { label: 'Tamanho' },
        { label: 'Tipo' },
        { label: 'Data de modificação' }
      ]
    },
    { 
      label: 'Atualizar', 
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M14 8a6 6 0 11-1-3.3M14 3v5h-5"/></svg>',
      action: () => window.location.reload() 
    },
    { divider: true },
    { 
      label: 'Desfazer Renomear', 
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3 7a5 5 0 111 4.5M3 3v4h4"/></svg>',
      shortcut: 'Ctrl+Z',
      disabled: true 
    },
    { 
      label: 'Novo', 
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="8" cy="8" r="6"/><path d="M8 5v6M5 8h6"/></svg>',
      submenu: [
        { label: 'Pasta' },
        { label: 'Atalho' },
        { divider: true },
        { label: 'Documento de Texto' }
      ]
    },
    { divider: true },
    { 
      label: 'Configurações de exibição', 
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="2" y="3" width="12" height="8" rx="1"/><path d="M6 14h4M8 11v3"/><circle cx="12" cy="5" r="1.5"/></svg>' 
    },
    { 
      label: 'Personalizar', 
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M13 3l-8 8-2-1 1-2 8-8 1 3zM3 13c0-2 2-2 2-2"/></svg>',
      action: () => togglePersonalization()
    },
    { divider: true },
    { 
      label: 'Mostrar mais opções', 
      icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3 6l0-3 3 0M10 3l3 0 0 3M13 10l0 3-3 0M6 13l-3 0 0-3"/></svg>' 
    }
  ]
  showMenu(e, items)
}

// Window Positions & Cascading
const cascadeIndex = ref(0)
const explorerPos = ref<{x: number, y: number} | null>(null)
const calculatorPos = ref<{x: number, y: number} | null>(null)
const edgePos = ref<{x: number, y: number} | null>(null)
const photoViewerPos = ref<{x: number, y: number} | null>(null)
const pdfReaderPos = ref<{x: number, y: number} | null>(null)

const getNextCascadePos = (winWidth: number, winHeight: number) => {
  const cascadeOffset = (cascadeIndex.value % 10) * 30
  cascadeIndex.value++
  
  // Base centered position
  const baseX = (window.innerWidth - winWidth) / 2
  const baseY = (window.innerHeight - 48 - winHeight) / 2
  
  return {
    x: baseX + cascadeOffset,
    y: baseY + cascadeOffset
  }
}

// PDF Reader State
const openedPdf = ref<string | null>(null)
const pdfLabel = ref('')
const isPdfReaderMinimized = ref(false)

const togglePersonalization = () => {
  if (!isPersonalizationOpen.value) {
    personalizationPos.value = getNextCascadePos(500, 400)
    isPersonalizationOpen.value = true
    bringToFront('Personalization')
  } else if (focusedApp.value !== 'Personalization') {
    bringToFront('Personalization')
  } else {
    isPersonalizationOpen.value = false
    findNewFocus()
  }
}

// Z-index & Focus Order Management
const nextZIndex = ref(200)
const zIndices = ref({
  Explorer: 100,
  PhotoViewer: 101,
  Calculator: 102,
  Edge: 103,
  PdfReader: 104,
  Personalization: 105
})
const windowOrder = ref(['Explorer', 'PhotoViewer', 'Calculator', 'Edge', 'PdfReader', 'Personalization'])

const bringToFront = (app: string) => {
  // Move to end of order array
  const idx = windowOrder.value.indexOf(app)
  if (idx > -1) {
    windowOrder.value.splice(idx, 1)
    windowOrder.value.push(app)
  }
  
  nextZIndex.value++
  zIndices.value[app as keyof typeof zIndices.value] = nextZIndex.value
  focusedApp.value = app
}

const findNewFocus = () => {
  // Look for the next best window to focus (from back of order list)
  for (let i = windowOrder.value.length - 1; i >= 0; i--) {
    const app = windowOrder.value[i]
    if (app === 'Explorer' && isExplorerOpen.value && !isExplorerMinimized.value) {
      focusedApp.value = 'Explorer'
      return
    }
    if (app === 'Calculator' && isCalculatorOpen.value && !isCalculatorMinimized.value) {
      focusedApp.value = 'Calculator'
      return
    }
    if (app === 'PhotoViewer' && openedPhoto.value) {
      focusedApp.value = 'PhotoViewer'
      return
    }
    if (app === 'Edge' && isEdgeOpen.value && !isEdgeMinimized.value) {
      focusedApp.value = 'Edge'
      return
    }
    if (app === 'PdfReader' && openedPdf.value && !isPdfReaderMinimized.value) {
      focusedApp.value = 'PdfReader'
      return
    }
  }
  focusedApp.value = null
}

const togglePhotoViewer = () => {
  if (openedPhoto.value) {
    if (focusedApp.value !== 'PhotoViewer' || isPhotoViewerMinimized.value) {
      if (!photoViewerPos.value) photoViewerPos.value = getNextCascadePos(900, 700)
      isPhotoViewerMinimized.value = false
      bringToFront('PhotoViewer')
    } else {
      isPhotoViewerMinimized.value = true
      findNewFocus()
    }
  }
}

const toggleEdge = () => {
  if (!isEdgeOpen.value) {
    edgePos.value = getNextCascadePos(1000, 700)
    isEdgeOpen.value = true
    isEdgeMinimized.value = false
    bringToFront('Edge')
  } else if (focusedApp.value !== 'Edge' || isEdgeMinimized.value) {
    isEdgeMinimized.value = false
    bringToFront('Edge')
  } else {
    isEdgeMinimized.value = true
    findNewFocus()
  }
}

const toggleCalculator = () => {
  if (!isCalculatorOpen.value) {
    calculatorPos.value = getNextCascadePos(320, 500)
    isCalculatorOpen.value = true
    isCalculatorMinimized.value = false
    bringToFront('Calculator')
  } else if (focusedApp.value !== 'Calculator' || isCalculatorMinimized.value) {
    isCalculatorMinimized.value = false
    bringToFront('Calculator')
  } else {
    isCalculatorMinimized.value = true
    findNewFocus()
  }
}

const togglePdfReader = () => {
  if (openedPdf.value) {
    if (focusedApp.value !== 'PdfReader' || isPdfReaderMinimized.value) {
      if (!pdfReaderPos.value) pdfReaderPos.value = getNextCascadePos(900, 750)
      isPdfReaderMinimized.value = false
      bringToFront('PdfReader')
    } else {
      isPdfReaderMinimized.value = true
      findNewFocus()
    }
  }
}

const emit = defineEmits(['change-os'])

const toggleExplorer = () => {
  if (!isExplorerOpen.value) {
    explorerPos.value = getNextCascadePos(1000, 650)
    isExplorerOpen.value = true
    isExplorerMinimized.value = false
    bringToFront('Explorer')
  } else if (focusedApp.value !== 'Explorer' || isExplorerMinimized.value) {
    isExplorerMinimized.value = false
    bringToFront('Explorer')
  } else {
    isExplorerMinimized.value = true
    findNewFocus()
  }
}

const toggleStartMenu = () => {
    isStartMenuOpen.value = !isStartMenuOpen.value
}

const closeExplorer = () => {
  isExplorerOpen.value = false
  isExplorerMinimized.value = false
  findNewFocus()
}

const minimizeExplorer = () => {
  isExplorerMinimized.value = true
  findNewFocus()
}

const handleOpenFile = (data: { type: string, path: string, list?: string[], index?: number, label?: string }) => {
  if (data.type === 'image') {
    if (!openedPhoto.value) photoViewerPos.value = getNextCascadePos(900, 700)
    openedPhoto.value = data.path
    photoList.value = data.list || []
    photoIndex.value = data.index || 0
    isPhotoViewerMinimized.value = false
    bringToFront('PhotoViewer')
  } else if (data.type === 'pdf') {
    if (!openedPdf.value) pdfReaderPos.value = getNextCascadePos(900, 750)
    openedPdf.value = data.path
    pdfLabel.value = data.label || 'Documento'
    isPdfReaderMinimized.value = false
    bringToFront('PdfReader')
  }
}

onMounted(() => {
  // Any global initialization
})
</script>

<template>
  <div class="windows-container" :class="windowsState.theme">
    <!-- Desktop Area -->
    <div class="desktop" @contextmenu.prevent="handleDesktopContextMenu">
      <ExplorerWindow 
        :isOpen="isExplorerOpen"
        :isMinimized="isExplorerMinimized"
        :zIndex="zIndices.Explorer"
        :initialPos="explorerPos"
        @close="closeExplorer"
        @minimize="minimizeExplorer"
        @maximize="bringToFront('Explorer')"
        @open-file="handleOpenFile"
        @update-path="(path: string) => explorerPath = path"
        @mousedown="bringToFront('Explorer')"
      />
      
      <!-- Start Menu -->
      <StartMenu 
        v-if="isStartMenuOpen"
        style="z-index: 9999"
        @change-os="(os: string) => emit('change-os', os)"
        @close="isStartMenuOpen = false"
        @open-app="(app: string) => { 
          if (app === 'Calculator') toggleCalculator(); 
          if (app === 'Edge') toggleEdge();
          isStartMenuOpen = false;
        }"
      />

      <!-- Photo Viewer -->
      <PhotoViewer 
        v-if="openedPhoto"
        v-show="!isPhotoViewerMinimized"
        :src="openedPhoto"
        :photos="photoList"
        :initialIndex="photoIndex"
        :isOpen="!!openedPhoto"
        :zIndex="zIndices.PhotoViewer"
        :initialPos="photoViewerPos"
        @close="openedPhoto = null; photoViewerPos = null; findNewFocus()"
        @minimize="isPhotoViewerMinimized = true; findNewFocus()"
        @maximize="bringToFront('PhotoViewer')"
        @mousedown="bringToFront('PhotoViewer')"
      />
      <!-- Calculator -->
      <Calculator 
        v-if="isCalculatorOpen"
        v-show="!isCalculatorMinimized"
        :isMinimized="isCalculatorMinimized"
        :zIndex="zIndices.Calculator"
        :initialPos="calculatorPos"
        @close="isCalculatorOpen = false; calculatorPos = null; findNewFocus()"
        @minimize="isCalculatorMinimized = true; findNewFocus()"
        @maximize="bringToFront('Calculator')"
        @mousedown="bringToFront('Calculator')"
      />

      <!-- Edge Browser -->
      <EdgeWindow 
        v-if="isEdgeOpen"
        v-show="!isEdgeMinimized"
        :isMinimized="isEdgeMinimized"
        :zIndex="zIndices.Edge"
        :initialPos="edgePos"
        @close="isEdgeOpen = false; edgePos = null; findNewFocus()"
        @minimize="isEdgeMinimized = true; findNewFocus()"
        @maximize="bringToFront('Edge')"
        @mousedown="bringToFront('Edge')"
      />

      <!-- PDF Reader -->
      <PdfReader 
        v-if="openedPdf"
        v-show="!isPdfReaderMinimized"
        :src="openedPdf"
        :label="pdfLabel"
        :isOpen="!!openedPdf"
        :zIndex="zIndices.PdfReader"
        :initialPos="pdfReaderPos"
        @close="openedPdf = null; pdfReaderPos = null; findNewFocus()"
        @minimize="isPdfReaderMinimized = true; findNewFocus()"
        @maximize="bringToFront('PdfReader')"
        @mousedown="bringToFront('PdfReader')"
      />

      <!-- Personalization -->
      <ResizableWindow 
        v-if="isPersonalizationOpen"
        title="Personalização"
        icon="🎨"
        iconType="emoji"
        :initialSize="{ width: 500, height: 400 }"
        :zIndex="zIndices.Personalization"
        :initialPos="personalizationPos"
        :active="focusedApp === 'Personalization'"
        :darkMode="windowsState.theme === 'dark'"
        @close="isPersonalizationOpen = false; findNewFocus()"
        @mousedown="bringToFront('Personalization')"
      >
        <Personalization />
      </ResizableWindow>
    </div>

    <!-- Taskbar -->
    <Taskbar 
      :isExplorerOpen="isExplorerOpen"
      :isExplorerMinimized="isExplorerMinimized"
      :isCalculatorOpen="isCalculatorOpen"
      :isCalculatorMinimized="isCalculatorMinimized"
      :isEdgeOpen="isEdgeOpen"
      :isEdgeMinimized="isEdgeMinimized"
      :isPhotoViewerOpen="!!openedPhoto"
      :isPhotoViewerMinimized="isPhotoViewerMinimized"
      :isPdfReaderOpen="!!openedPdf"
      :isPdfReaderMinimized="isPdfReaderMinimized"
      :explorerPath="explorerPath"
      :focusedApp="focusedApp"
      @toggleExplorer="toggleExplorer"
      @minimizeExplorer="minimizeExplorer"
      @toggleCalculator="toggleCalculator"
      @toggleEdge="toggleEdge"
      @togglePhotoViewer="togglePhotoViewer"
      @togglePdfReader="togglePdfReader"
      @toggleStartMenu="toggleStartMenu"
    />

    <ContextMenu />
  </div>
</template>

<style scoped>
.windows-container {
  height: 100vh;
  width: 100vw;
  background-image: url('../assets/windows/windows-wallpaper.png');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI Variable', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  overflow: hidden;
  color: white;
}

.desktop {
  flex: 1;
  position: relative;
  width: 100%;
}
</style>



