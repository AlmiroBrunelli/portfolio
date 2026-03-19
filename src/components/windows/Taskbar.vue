<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  isExplorerOpen: Boolean,
  isExplorerMinimized: Boolean,
  isCalculatorOpen: Boolean,
  isCalculatorMinimized: Boolean,
  focusedApp: String
})

const emit = defineEmits(['toggleExplorer', 'minimizeExplorer', 'toggleStartMenu', 'toggleCalculator'])

const currentTime = ref('')
const currentDate = ref('')
const isStartHovered = ref(false)
const showTooltip = ref(false)
let tooltipTimeout = null

const handleStartMouseEnter = () => {
  isStartHovered.value = true
  tooltipTimeout = setTimeout(() => {
    showTooltip.value = true
  }, 1000)
}

const handleStartMouseLeave = () => {
  isStartHovered.value = false
  showTooltip.value = false
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout)
    tooltipTimeout = null
  }
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  currentDate.value = now.toLocaleDateString('pt-BR')
}

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
        class="start-btn" 
        @click="emit('toggleStartMenu')"
        @mouseenter="handleStartMouseEnter"
        @mouseleave="handleStartMouseLeave"
      >
        <img src="../../assets/windows/windows.png" width="24" height="24" alt="Windows" />
        <Transition name="fade">
          <div v-if="showTooltip" class="custom-tooltip">Iniciar</div>
        </Transition>
      </div>
      <div class="search-container">
        <div class="search-icon">🔍</div>
        <input type="text" placeholder="Digite aqui para pesquisar" />
      </div>
      <div class="task-btn cortana" title="Falar com a Cortana">
         <div class="cortana-circle"></div>
      </div>
    </div>

    <div class="taskbar-center">
      <div 
        class="task-btn" 
        :class="{ active: focusedApp === 'Explorer' && !isExplorerMinimized, 'has-window': isExplorerOpen }"
        title="Este Computador"
        @click="emit('toggleExplorer')"
      >
         <span class="icon">📂</span>
         <div v-if="isExplorerOpen" class="active-indicator" :class="{ minimized: isExplorerMinimized || focusedApp !== 'Explorer' }"></div>
      </div>
      
      <div 
        v-if="isCalculatorOpen"
        class="task-btn" 
        :class="{ active: focusedApp === 'Calculator' && !isCalculatorMinimized, 'has-window': true }"
        title="Calculadora"
        @click="emit('toggleCalculator')"
      >
         <img src="../../assets/windows/calculator.png" width="24" height="24" alt="Calculadora" />
         <div class="active-indicator" :class="{ minimized: isCalculatorMinimized || focusedApp !== 'Calculator' }"></div>
      </div>

      <div class="task-btn" title="Microsoft Edge">
         <span class="icon">🌐</span>
      </div>
      <div class="task-btn" title="Visual Studio Code">
         <span class="icon">💻</span>
      </div>
    </div>

    <div class="taskbar-right">
      <div class="tray-icons">
         <span class="tray-icon">🔋</span>
         <span class="tray-icon">🌐</span>
         <span class="tray-icon">🔊</span>
      </div>
      <div class="clock-container" :title="currentDate">
         <div class="time">{{ currentTime }}</div>
         <div class="date">{{ currentDate }}</div>
      </div>
      <div class="show-desktop" @click="emit('minimizeExplorer')"></div>
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
    flex: 1;
    display: flex;
    align-items: center;
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

.start-btn::before {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 4px;
    background: transparent;
    transition: background 0.1s;
    z-index: 0;
}

.start-btn:hover::before {
    background: rgba(255, 255, 255, 0.1);
}

.start-btn svg {
    position: relative;
    z-index: 1;
}

.start-btn:hover svg path { fill: #60cdff; }

.custom-tooltip {
    position: absolute;
    bottom: 54px;
    left: 4px;
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
    padding: 0 8px;
    text-align: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 40px;
    border-radius: 4px;
}

.clock-container:hover { background: rgba(255, 255, 255, 0.1); }

.time { font-size: 11px; font-weight: 500; }
.date { font-size: 11px; opacity: 0.8; }

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
