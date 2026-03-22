<script setup>
defineProps({
  size: {
    type: String,
    default: '30px'
  },
  strokeWidth: {
    type: String,
    default: '10px'
  },
  color: {
    type: String,
    default: 'currentColor'
  }
})
</script>

<template>
  <svg class="spinner" viewBox="0 0 100 100" :style="{ width: size, height: size, color: color }">
    <circle cx="50" cy="50" r="45" fill="none" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" transform-origin="center">
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="-90;810"
        keyTimes="0;1"
        dur="2s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="stroke-dashoffset"
        values="0%;0%;-157.080%"
        calcMode="spline"
        keySplines="0.61, 1, 0.88, 1; 0.12, 0, 0.39, 0"
        keyTimes="0;0.5;1"
        dur="2s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="stroke-dasharray"
        values="0% 314.159%;157.080% 157.080%;0% 314.159%"
        calcMode="spline"
        keySplines="0.61, 1, 0.88, 1; 0.12, 0, 0.39, 0"
        keyTimes="0;0.5;1"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
</template>

<style scoped>
.spinner {
  box-sizing: border-box;
  overflow: visible;
}
</style>
