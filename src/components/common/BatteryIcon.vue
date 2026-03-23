<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  size?: number
}>()

const isSupported = ref(false)
const batteryLevel = ref(1)
const isCharging = ref(false)
let batteryManager: any = null

const updateBatteryInfo = (battery: any) => {
  batteryLevel.value = battery.level
  isCharging.value = battery.charging
}

onMounted(async () => {
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
          isSupported.value = true
        }
      }
      
      checkBatterySupported()
      updateBatteryInfo(batteryManager)

      batteryManager.addEventListener('levelchange', () => {
        isSupported.value = true
        updateBatteryInfo(batteryManager)
      })
      batteryManager.addEventListener('chargingchange', () => {
        isSupported.value = true
        updateBatteryInfo(batteryManager)
      })
    } catch (e) {
      console.error('Battery API supported but failed:', e)
      isSupported.value = false
    }
  } else {
    isSupported.value = false
  }
})

onUnmounted(() => {
  if (batteryManager) {
    batteryManager.removeEventListener('levelchange', () => updateBatteryInfo(batteryManager))
    batteryManager.removeEventListener('chargingchange', () => updateBatteryInfo(batteryManager))
  }
})

const percentage = computed(() => Math.round(batteryLevel.value * 100))
</script>

<template>
  <div v-if="isSupported" class="battery-icon" :title="percentage + '%'">
    <svg 
      viewBox="0 0 24 24" 
      :width="size || 16" 
      :height="size || 16" 
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
      <!-- Battery Cap (Right side) -->
      <path d="M19 11h1.5v4H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      
      <!-- Battery Level Fill -->
      <g v-if="batteryLevel >= 0.1">
        <!-- Bars logic to match the pixelated look of the PNGs -->
        <!-- Level < 0.2: One red bar (optional color, but let's stick to current color) -->
        <rect v-if="batteryLevel < 0.2" x="5" y="10" width="2" height="6" fill="#ff4d4d" />
        
        <!-- 0.2 <= Level < 0.4: Two bars -->
        <template v-else-if="batteryLevel < 0.4">
          <rect x="5" y="10" width="2" height="6" fill="currentColor" />
          <rect x="8" y="10" width="2" height="6" fill="currentColor" />
        </template>
        
        <!-- 0.4 <= Level < 0.6: Three bars -->
        <template v-else-if="batteryLevel < 0.6">
          <rect x="5" y="10" width="2" height="6" fill="currentColor" />
          <rect x="8" y="10" width="2" height="6" fill="currentColor" />
          <rect x="11" y="10" width="2" height="6" fill="currentColor" />
        </template>
        
        <!-- 0.6 <= Level < 0.9: Four bars -->
        <template v-else-if="batteryLevel < 0.9">
          <rect x="5" y="10" width="2" height="6" fill="currentColor" />
          <rect x="8" y="10" width="2" height="6" fill="currentColor" />
          <rect x="11" y="10" width="2" height="6" fill="currentColor" />
          <rect x="14" y="10" width="2" height="6" fill="currentColor" />
        </template>
        
        <!-- Level >= 0.9: Solid fill -->
        <rect v-else x="5" y="10" width="12" height="6" fill="currentColor" />
      </g>

      <!-- Charging Bolt (Overlapping top left) -->
      <g v-if="isCharging" class="charging-bolt">
        <!-- Bolt shape mimicking the user's image -->
        <path 
           d="M7 3l-3 7h3.5l-2.5 8 7-9h-4l2.5-6z" 
           fill="white" 
           stroke="black" 
           stroke-width="1.2" 
           stroke-linejoin="round"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.battery-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.charging-bolt {
  filter: drop-shadow(0 0 1px rgba(0,0,0,0.5));
}
</style>
