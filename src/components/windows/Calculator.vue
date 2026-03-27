<script setup lang="ts">
import { ref } from 'vue'
import ResizableWindow from './ResizableWindow.vue'
import { windowsState } from '../../store'

const props = defineProps({
  zIndex: Number,
  isMinimized: Boolean,
  initialPos: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'minimize', 'maximize'])

const display = ref('0')
const previousValue = ref<number | null>(null)
const operator = ref<string | null>(null)
const waitingForNextValue = ref(false)

const clear = () => {
  display.value = '0'
  previousValue.value = null
  operator.value = null
  waitingForNextValue.value = false
}

const inputDigit = (digit: number) => {
  if (waitingForNextValue.value) {
    display.value = String(digit)
    waitingForNextValue.value = false
  } else {
    display.value = display.value === '0' ? String(digit) : display.value + digit
  }
}

const inputDecimal = () => {
  if (waitingForNextValue.value) {
    display.value = '0.'
    waitingForNextValue.value = false
    return
  }
  if (!display.value.includes('.')) {
    display.value += '.'
  }
}

const handleOperator = (nextOperator: string) => {
  const inputValue = parseFloat(display.value)

  if (operator.value && waitingForNextValue.value) {
    operator.value = nextOperator
    return
  }

  if (previousValue.value === null) {
    previousValue.value = inputValue
  } else if (operator.value) {
    const result = calculate(previousValue.value, inputValue, operator.value)
    display.value = String(result)
    previousValue.value = result
  }

  waitingForNextValue.value = true
  operator.value = nextOperator
}

const calculate = (first: number, second: number, op: string) => {
  if (op === '+') return first + second
  if (op === '-') return first - second
  if (op === '*') return first * second
  if (op === '/') return first / second
  return second
}

const equals = () => {
  if (!operator.value || previousValue.value === null) return
  const inputValue = parseFloat(display.value)
  const result = calculate(previousValue.value, inputValue, operator.value)
  display.value = String(result)
  previousValue.value = null
  operator.value = null
  waitingForNextValue.value = false
}
</script>

<template>
  <ResizableWindow
    title="Calculadora"
    icon="/src/assets/windows/calculator.png"
    iconType="image"
    :darkMode="windowsState.theme === 'dark'"
    :initialSize="{ width: 320, height: 500 }"
    :minWidth="280"
    :minHeight="400"
    :initialPos="initialPos"
    :style="{ zIndex: zIndex }"
    @close="emit('close')"
    @minimize="emit('minimize')"
    @maximize="emit('maximize', $event)"
  >
    <div class="calc-container">
      <div class="display">
        <div class="history" v-if="previousValue !== null">
          {{ previousValue }} {{ operator }}
        </div>
        <div class="current">{{ display }}</div>
      </div>

      <div class="keypad">
        <button class="key op" @click="clear">C</button>
        <button class="key op" @click="display = '0'">CE</button>
        <button class="key op" @click="handleOperator('/')">÷</button>
        <button class="key op" @click="handleOperator('*')">×</button>

        <button class="key" @click="inputDigit(7)">7</button>
        <button class="key" @click="inputDigit(8)">8</button>
        <button class="key" @click="inputDigit(9)">9</button>
        <button class="key op" @click="handleOperator('-')">−</button>

        <button class="key" @click="inputDigit(4)">4</button>
        <button class="key" @click="inputDigit(5)">5</button>
        <button class="key" @click="inputDigit(6)">6</button>
        <button class="key op" @click="handleOperator('+')">+</button>

        <button class="key" @click="inputDigit(1)">1</button>
        <button class="key" @click="inputDigit(2)">2</button>
        <button class="key" @click="inputDigit(3)">3</button>
        <button class="key equals" @click="equals">=</button>

        <button class="key zero" @click="inputDigit(0)">0</button>
        <button class="key" @click="inputDecimal">.</button>
      </div>
    </div>
  </ResizableWindow>
</template>

<style scoped>
.calc-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--win-bg);
  padding: 4px;
}

.display {
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 10px 16px;
  color: var(--win-text);
}

.history {
  font-size: 14px;
  color: var(--win-text);
  opacity: 0.6;
  min-height: 20px;
}

.current {
  font-size: 44px;
  font-weight: 600;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: right;
}

.keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 2px;
  flex: 1;
}

.key {
  height: 100%;
  background: var(--win-hover);
  border: none;
  color: var(--win-text);
  font-size: 18px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.1s;
}

.key:hover { background: var(--win-hover); }
.key:active { opacity: 0.7; }

.key.op { background: var(--win-hover); opacity: 0.8; font-size: 20px; }
.key.op:hover { background: var(--win-hover); }

.key.equals {
  background: var(--win-accent);
  color: #fff;
  grid-row: span 2;
}
.key.equals:hover { opacity: 0.9; }

.key.zero { grid-column: span 2; }
</style>
