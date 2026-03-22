<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { i18n } from '../../i18n'
import LanguageSelector from '../common/LanguageSelector.vue'

const props = defineProps({
  isExplorerOpen: Boolean,
  isExplorerMinimized: Boolean,
  isCalculatorOpen: Boolean,
  isCalculatorMinimized: Boolean,
  isEdgeOpen: Boolean,
  isEdgeMinimized: Boolean,
  isPhotoViewerOpen: Boolean,
  isPhotoViewerMinimized: Boolean,
  focusedApp: String,
  explorerPath: {
    type: String,
    default: 'Este Computador'
  }
})

const emit = defineEmits(['toggleExplorer', 'minimizeExplorer', 'toggleStartMenu', 'toggleCalculator', 'togglePhotoViewer', 'toggleEdge'])

const currentTime = ref('')
const currentDate = ref('')
const activeTooltip = ref('')
let tooltipTimeout = null

const handleMouseEnter = (text) => {
  tooltipTimeout = setTimeout(() => {
    activeTooltip.value = text
  }, 500)
}

const handleMouseLeave = () => {
  activeTooltip.value = ''
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout)
    tooltipTimeout = null
  }
}

const explorerIcon = computed(() => {
  const path = props.explorerPath
  if (path === 'Imagens') return '🖼️'
  if (path === 'OneDrive') return '☁️'
  if (path === 'Rede') return '🌐'
  if (path === 'Este Computador') return '🖥️'
  if (path === 'Documentos') return '📄'
  return '📂'
})

const updateTime = () => {
  const now = new Date()
  const locale = i18n.state.locale
  
  if (locale === 'en-US') {
    // MM/DD/YYYY and XX:XX AM/PM
    currentTime.value = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    currentDate.value = `${month}/${day}/${now.getFullYear()}`
  } else {
    // DD/MM/YYYY and XX:XX
    currentTime.value = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false })
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    currentDate.value = `${day}/${month}/${now.getFullYear()}`
  }
}

// Update time when locale changes
watch(() => i18n.state.locale, updateTime)

let timer
onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="taskbar">
    <div class="taskbar-left">
      <div 
        class="task-btn start-btn" 
        @click="emit('toggleStartMenu')"
        @mouseenter="handleMouseEnter('taskbar.start')"
        @mouseleave="handleMouseLeave"
      >
        <img src="../../assets/windows/windows.png" width="24" height="24" alt="Start" />
        <Transition name="fade">
          <div v-if="activeTooltip === 'taskbar.start'" class="custom-tooltip">{{ i18n.t('taskbar.start') }}</div>
        </Transition>
      </div>

      <div class="separator-v"></div>

      <div 
        class="task-btn" 
        :class="{ active: focusedApp === 'Explorer' && !isExplorerMinimized, 'has-window': isExplorerOpen }"
        @click="emit('toggleExplorer')"
        @mouseenter="handleMouseEnter('taskbar.explorer')"
        @mouseleave="handleMouseLeave"
      >
         <span class="icon">{{ explorerIcon }}</span>
         <div v-if="isExplorerOpen" class="active-indicator" :class="{ minimized: isExplorerMinimized || focusedApp !== 'Explorer' }"></div>
         <Transition name="fade">
           <div v-if="activeTooltip === 'taskbar.explorer'" class="custom-tooltip">{{ i18n.t('taskbar.explorer') }}</div>
         </Transition>
      </div>
      
      <div 
        v-if="isCalculatorOpen"
        class="task-btn" 
        :class="{ active: focusedApp === 'Calculator' && !isCalculatorMinimized, 'has-window': true }"
        @click="emit('toggleCalculator')"
        @mouseenter="handleMouseEnter('taskbar.calculator')"
        @mouseleave="handleMouseLeave"
      >
         <img src="../../assets/windows/calculator.png" width="24" height="24" alt="Calculadora" />
         <div class="active-indicator" :class="{ minimized: isCalculatorMinimized || focusedApp !== 'Calculator' }"></div>
         <Transition name="fade">
           <div v-if="activeTooltip === 'taskbar.calculator'" class="custom-tooltip">{{ i18n.t('taskbar.calculator') }}</div>
         </Transition>
      </div>

      <div 
        v-if="isPhotoViewerOpen"
        class="task-btn" 
        :class="{ active: focusedApp === 'PhotoViewer' && !isPhotoViewerMinimized, 'has-window': true }"
        @click="emit('togglePhotoViewer')"
        @mouseenter="handleMouseEnter('taskbar.photos')"
        @mouseleave="handleMouseLeave"
      >
         <span class="icon">🖼️</span>
         <div class="active-indicator" :class="{ minimized: isPhotoViewerMinimized || focusedApp !== 'PhotoViewer' }"></div>
         <Transition name="fade">
           <div v-if="activeTooltip === 'taskbar.photos'" class="custom-tooltip">{{ i18n.t('taskbar.photos') }}</div>
         </Transition>
      </div>

      <div 
        class="task-btn" 
        :class="{ active: focusedApp === 'Edge' && !isEdgeMinimized, 'has-window': isEdgeOpen }"
        @click="emit('toggleEdge')"
        @mouseenter="handleMouseEnter('taskbar.edge')"
        @mouseleave="handleMouseLeave"
      >
         <img src="../../assets/windows/ms-edge.png" width="24" height="24" alt="Edge" />
         <div v-if="isEdgeOpen" class="active-indicator" :class="{ minimized: isEdgeMinimized || focusedApp !== 'Edge' }"></div>
         <Transition name="fade">
           <div v-if="activeTooltip === 'taskbar.edge'" class="custom-tooltip">{{ i18n.t('taskbar.edge') }}</div>
         </Transition>
      </div>
    </div>

    <div class="taskbar-right">
      <div class="tray-icons">
         <span class="tray-icon" @mouseenter="handleMouseEnter('taskbar.battery')" @mouseleave="handleMouseLeave">🔋</span>
         <span class="tray-icon" @mouseenter="handleMouseEnter('taskbar.network')" @mouseleave="handleMouseLeave">🌐</span>
         <span class="tray-icon" @mouseenter="handleMouseEnter('taskbar.sound')" @mouseleave="handleMouseLeave">🔊</span>
      </div>

      <LanguageSelector />

      <div class="clock-container" @mouseenter="handleMouseEnter(currentDate)" @mouseleave="handleMouseLeave">
         <div class="time">{{ currentTime }}</div>
         <div class="date">{{ currentDate }}</div>
         <Transition name="fade">
           <div v-if="activeTooltip === currentDate" class="custom-tooltip">{{ currentDate }}</div>
         </Transition>
      </div>
      <div class="show-desktop" @click="emit('minimizeExplorer')" @mouseenter="handleMouseEnter('taskbar.show_desktop')" @mouseleave="handleMouseLeave">
          <Transition name="fade">
            <div v-if="activeTooltip === 'taskbar.show_desktop'" class="custom-tooltip" style="right: 0; left: auto;">{{ i18n.t('taskbar.show_desktop') }}</div>
          </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.taskbar {
  height: 48px;
  background: rgba(28, 28, 28, 0.85);
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  padding: 0 4px;
}

.taskbar-left {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1; /* Allow left to grow and take space */
}

.taskbar-center {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.taskbar-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 2px;
}

.start-btn {
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
}

.start-btn:hover svg path { fill: #60cdff; }

.custom-tooltip {
    position: absolute;
    bottom: 54px;
    left: 50%;
    transform: translateX(-50%);
    background: #1c355e;
    color: #fff;
    padding: 3px 10px;
    font-size: 11px;
    white-space: nowrap;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    pointer-events: none;
    z-index: 2000;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.search-container {
    height: 34px;
    background: rgba(255, 255, 255, 0.85);
    width: 240px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap: 10px;
    margin-right: 8px;
    border-radius: 17px;
    border: 1px solid rgba(0,0,0,0.1);
}

.search-icon { font-size: 14px; color: #333; }
.search-container input {
    border: none;
    outline: none;
    font-size: 13px;
    width: 100%;
    background: transparent;
    color: #333;
}

.task-btn {
    height: 40px;
    min-width: 40px;
    padding: 0 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    border-radius: 4px;
    margin: 0 2px;
}

.task-btn:hover { background: rgba(255, 255, 255, 0.1); }
.task-btn.active { background: rgba(255, 255, 255, 0.15); }
/* No background for has-window unless active */

.icon { font-size: 20px; }

.active-indicator {
    position: absolute;
    bottom: 2px;
    width: 6px;
    height: 3px;
    background: #60cdff;
    border-radius: 2px;
    transition: width 0.2s, opacity 0.2s;
    opacity: 0; /* Hidden by default */
}

.active.task-btn .active-indicator {
    opacity: 1; /* Only show when active (focused) */
}

.active-indicator.minimized {
    width: 2px;
    opacity: 0.5;
}

.taskbar-right { gap: 2px; }

.tray-icons {
    display: flex;
    gap: 12px;
    font-size: 14px;
    padding: 0 12px;
}

.clock-container {
    padding: 12px 8px 0px 8px; /* 12px top, 0px bottom, 8px left/right */
    text-align: right;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-end;
    height: 40px;
    border-radius: 4px;
}

.clock-container:hover { background: rgba(255, 255, 255, 0.1); }

.time { font-size: 11px; font-weight: 400; line-height: 1; }
.date { font-size: 11px; font-weight: 400; line-height: 1; }

.show-desktop {
    width: 4px;
    height: 100%;
    margin-left: 4px;
    cursor: pointer;
}

.show-desktop:hover { background: rgba(255, 255, 255, 0.1); }

/* Responsiveness */
@media (max-width: 850px) {
    .search-container { width: 150px; }
}

@media (max-width: 700px) {
    .search-container { display: none; }
    .cortana { display: none; }
}

@media (max-width: 500px) {
    .clock-container .date { display: none; }
    .tray-icons { gap: 8px; padding: 0 8px; }
    .taskbar-center { flex: 2; }
}
</style>
