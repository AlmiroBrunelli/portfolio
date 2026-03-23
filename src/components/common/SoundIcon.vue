<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  volume?: number
  isMuted?: boolean
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  volume: 70,
  isMuted: false,
  size: 20
})

const linesToShow = computed(() => {
  if (props.isMuted || props.volume === 0) return 0
  if (props.volume < 33) return 1
  if (props.volume < 66) return 2
  return 3
})
</script>

<template>
  <svg 
    viewBox="0 0 24 24" 
    :width="size" 
    :height="size" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
  >
    <!-- Speaker Body -->
    <polygon points="9 7 5 10 2 10 2 14 5 14 9 17 9 7" />
    
    <!-- Muted 'x' - Animated -->
    <g :style="{ opacity: linesToShow === 0 ? 1 : 0, transition: 'opacity 0.2s ease 0.1s' }">
      <line x1="21" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="21" y2="15" />
    </g>
    
    <!-- Volume Lines - Animated -->
    <g class="volume-lines">
      <!-- Line 1 (Low) -->
      <path 
        class="volume-line"
        :class="{ visible: linesToShow >= 1 }"
        d="M12 8.5a4 4 0 0 1 0 7" 
      />
      <!-- Line 2 (Medium) -->
      <path 
        class="volume-line"
        :class="{ visible: linesToShow >= 2 }"
        d="M15 6a8 8 0 0 1 0 12" 
      />
      <!-- Line 3 (High) -->
      <path 
        class="volume-line"
        :class="{ visible: linesToShow >= 3 }"
        d="M18 3.5a12 12 0 0 1 0 17" 
      />
    </g>
  </svg>
</template>

<style scoped>
svg {
  transition: all 0.2s ease 0.1s;
}

.volume-line {
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1) 0.1s, transform 0.1s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
}

.volume-line.visible {
  opacity: 1;
  transform: translateX(0);
}
</style>
