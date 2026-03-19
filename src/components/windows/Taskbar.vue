<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  isExplorerOpen: Boolean,
  isExplorerMinimized: Boolean
})

const emit = defineEmits(['toggleExplorer', 'minimizeExplorer', 'toggleStartMenu'])

const currentTime = ref('')
const currentDate = ref('')

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
      <div class="start-btn" title="Iniciar" @click="emit('toggleStartMenu')">
        <svg viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
          <path d="M0 12.402l35.687-4.86.016 34.423-35.67.203zm35.67 33.529l.029 34.508L0 75.523V46.128zM39.697 7.02L88 0v41.745l-48.303.3zm48.303 39.317L88 88l-48.303-7.075-.011-34.52z" fill="#fff"/>
        </svg>
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
        :class="{ active: isExplorerOpen && !isExplorerMinimized, 'has-window': isExplorerOpen }"
        title="Este Computador"
        @click="emit('toggleExplorer')"
      >
         <span class="icon">📂</span>
         <div v-if="isExplorerOpen" class="active-indicator"></div>
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
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background 0.1s;
    border-radius: 4px;
}

.start-btn:hover { background: rgba(255, 255, 255, 0.1); }
.start-btn:hover svg path { fill: #60cdff; }

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
.task-btn.has-window { background: rgba(255, 255, 255, 0.05); }
.task-btn.active { background: rgba(255, 255, 255, 0.15); }

.icon { font-size: 20px; }

.active-indicator {
    position: absolute;
    bottom: 2px;
    width: 6px;
    height: 3px;
    background: #60cdff;
    border-radius: 2px;
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
</style>
