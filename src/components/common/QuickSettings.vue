<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { windowsState } from '../../store'
import SoundIcon from './SoundIcon.vue'
import BrightnessIcon from './BrightnessIcon.vue'
import { computed } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])

const flyoutRef = ref<HTMLElement | null>(null)

const isBatterySupported = ref(false)
const batteryLevel = ref(1)
const isCharging = ref(false)
let batteryManager: any = null

const updateBatteryInfo = (battery: any) => {
  batteryLevel.value = battery.level
  isCharging.value = battery.charging
}

const handleClickOutside = (event: MouseEvent) => {
  if (props.isOpen && flyoutRef.value && !flyoutRef.value.contains(event.target as Node)) {
    const trayIcons = document.querySelector('.tray-icons-group')
    if (trayIcons && trayIcons.contains(event.target as Node)) return
    
    emit('close')
  }
}

onMounted(async () => {
  document.addEventListener('mousedown', handleClickOutside)
  
  if ('getBattery' in navigator) {
    try {
      // @ts-ignore
      batteryManager = await navigator.getBattery()
      
      const checkBatterySupported = () => {
        const isMocked = batteryManager.charging && 
                         batteryManager.level === 1 && 
                         batteryManager.chargingTime === 0 && 
                         batteryManager.dischargingTime === Infinity
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
        
        if (!isMocked || isMobile) {
          isBatterySupported.value = true
        }
      }

      checkBatterySupported()
      updateBatteryInfo(batteryManager)

      batteryManager.addEventListener('levelchange', () => {
        isBatterySupported.value = true
        updateBatteryInfo(batteryManager)
      })
      batteryManager.addEventListener('chargingchange', () => {
        isBatterySupported.value = true
        updateBatteryInfo(batteryManager)
      })
    } catch (e) {
      isBatterySupported.value = false
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  if (batteryManager) {
    batteryManager.removeEventListener('levelchange', () => updateBatteryInfo(batteryManager))
    batteryManager.removeEventListener('chargingchange', () => updateBatteryInfo(batteryManager))
  }
})

const batteryPercentage = computed(() => Math.round(batteryLevel.value * 100))
</script>

<template>
  <Transition name="slide-up">
    <div v-if="isOpen" class="quick-settings-flyout" ref="flyoutRef">
      <div class="settings-content">
        <!-- Brightness Slider -->
        <div class="setting-row">
          <div class="setting-icon">
            <BrightnessIcon :brightness="windowsState.brightness" :size="20" />
          </div>
          <div class="slider-container">
            <input 
              type="range" 
              v-model="windowsState.brightness" 
              min="0" max="100" 
              class="win-slider" 
              :style="{ '--progress': windowsState.brightness + '%' }"
            >
          </div>
        </div>

        <!-- Volume Slider -->
        <div class="setting-row">
          <div class="setting-icon" @click="windowsState.toggleMute()" style="cursor: pointer;">
            <SoundIcon :volume="windowsState.volume" :is-muted="windowsState.isMuted" :size="20" />
          </div>
          <div class="slider-container">
            <input 
              type="range" 
              :value="windowsState.volume" 
              @input="e => windowsState.setVolume(Number((e.target as HTMLInputElement).value))"
              min="0" max="100" 
              class="win-slider" 
              :style="{ '--progress': windowsState.volume + '%' }"
            >
          </div>
        </div>
      </div>

      <div class="flyout-footer">
        <div class="footer-left">
          <div v-if="isBatterySupported" class="battery-status">
            <svg 
              viewBox="0 0 24 24" 
              width="20" 
              height="20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <!-- Battery Frame -->
              <rect 
                x="3" y="8" width="16" height="10" 
                rx="1" ry="1" 
                stroke="currentColor" 
                stroke-width="1.5"
              />
              <!-- Battery Cap -->
              <path d="M19 11h1.5v4H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              
              <!-- Battery Level Fill -->
              <g v-if="batteryLevel >= 0.1">
                <rect v-if="batteryLevel < 0.2" x="5" y="10" width="2" height="6" fill="#ff4d4d" />
                <template v-else-if="batteryLevel < 0.4">
                  <rect x="5" y="10" width="2" height="6" fill="currentColor" />
                  <rect x="8" y="10" width="2" height="6" fill="currentColor" />
                </template>
                <template v-else-if="batteryLevel < 0.6">
                  <rect x="5" y="10" width="2" height="6" fill="currentColor" />
                  <rect x="8" y="10" width="2" height="6" fill="currentColor" />
                  <rect x="11" y="10" width="2" height="6" fill="currentColor" />
                </template>
                <template v-else-if="batteryLevel < 0.9">
                  <rect x="5" y="10" width="2" height="6" fill="currentColor" />
                  <rect x="8" y="10" width="2" height="6" fill="currentColor" />
                  <rect x="11" y="10" width="2" height="6" fill="currentColor" />
                  <rect x="14" y="10" width="2" height="6" fill="currentColor" />
                </template>
                <rect v-else x="5" y="10" width="12" height="6" fill="currentColor" />
              </g>

              <!-- Charging Bolt -->
              <g v-if="isCharging">
                <path 
                   d="M7 3l-3 7h3.5l-2.5 8 7-9h-4l2.5-6z" 
                   fill="white" 
                   stroke="black" 
                   stroke-width="1.2" 
                   stroke-linejoin="round"
                />
              </g>
            </svg>
            <span>{{ batteryPercentage }}%</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.quick-settings-flyout {
  position: absolute;
  bottom: 54px;
  right: 12px;
  width: 340px;
  background: rgba(32, 32, 32, 0.85);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  z-index: 2000;
  overflow: hidden;
  color: white;
  display: flex;
  flex-direction: column;
}

.settings-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.setting-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
}

.slider-container {
  flex: 1;
  display: flex;
  align-items: center;
}

.win-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  position: relative;
}

.win-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: linear-gradient(to right, #60cdff var(--progress), transparent var(--progress));
  border-radius: 2px;
}

.win-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: #60cdff;
  border: 4px solid #454545;
  cursor: pointer;
  margin-top: -7px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  transition: transform 0.1s, background 0.1s;
}

.win-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  background: #7bd5ff;
}

.flyout-footer {
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.battery-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #ddd;
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0, 0, 0, 1), opacity 0.3s;
}

.slide-up-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
