<script setup>
import { ref, computed, onMounted } from 'vue'
import { i18n } from '../../i18n'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())
const selectedDate = ref(new Date(today.getFullYear(), today.getMonth(), today.getDate()))
const monthNames = computed(() => {
  const locale = i18n.state.locale
  return Array.from({ length: 12 }, (_, i) => {
    return new Date(2000, i, 1).toLocaleString(locale, { month: 'long' })
  })
})

const weekDays = computed(() => {
  const locale = i18n.state.locale
  // D S T Q Q S S for PT, S M T W T F S for EN
  if (locale === 'pt-BR') {
    return ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
  }
  return ['S', 'M', 'T', 'W', 'T', 'F', 'S']
})

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const days = []
  
  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      month: month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false
    })
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      month: month,
      year: year,
      isCurrentMonth: true
    })
  }
  
  // Next month padding
  const remainingSlots = 42 - days.length // 6 rows * 7 days
  for (let i = 1; i <= remainingSlots; i++) {
    days.push({
      day: i,
      month: month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false
    })
  }
  
  return days
})

const formattedTopDate = computed(() => {
  const now = new Date()
  const locale = i18n.state.locale
  const options = { weekday: 'long', day: 'numeric', month: 'long' }
  return now.toLocaleDateString(locale, options)
})

const changeMonth = (offset) => {
  currentMonth.value += offset
  if (currentMonth.value > 11) {
    currentMonth.value = 0
    currentYear.value++
  } else if (currentMonth.value < 0) {
    currentMonth.value = 11
    currentYear.value--
  }
}

const isToday = (day, month, year) => {
  return day === today.getDate() && 
         month === today.getMonth() && 
         year === today.getFullYear()
}

const isSelected = (day, month, year) => {
  return day === selectedDate.value.getDate() && 
         month === selectedDate.value.getMonth() && 
         year === selectedDate.value.getFullYear()
}

const selectDate = (day, month, year) => {
  selectedDate.value = new Date(year, month, day)
}
</script>

<template>
  <Transition name="slide-up">
    <div v-if="isOpen" class="calendar-flyout" @click.stop>
      <div class="calendar-header">
        <div class="top-date">{{ formattedTopDate }}</div>
      </div>

      <div class="calendar-body">
        <div class="month-selector">
          <span class="current-month-year">
            {{ monthNames[currentMonth] }} {{ i18n.t('calendar.of') }} {{ currentYear }}
          </span>
          <div class="nav-btns">
            <button class="nav-btn" @click="changeMonth(-1)">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
            <button class="nav-btn" @click="changeMonth(1)">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <div class="days-grid">
          <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
          <div 
            v-for="(date, index) in calendarDays" 
            :key="index"
            class="day-cell"
            :class="{ 
              'other-month': !date.isCurrentMonth,
              'today': isToday(date.day, date.month, date.year),
              'selected': isSelected(date.day, date.month, date.year)
            }"
            @click="selectDate(date.day, date.month, date.year)"
          >
            {{ date.day }}
          </div>
        </div>
      </div>

    </div>
  </Transition>
</template>

<style scoped>
.calendar-flyout {
  position: absolute;
  bottom: 56px;
  right: 12px;
  width: 320px;
  background: rgba(32, 32, 32, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
}

.calendar-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.top-date {
  font-size: 14px;
  font-weight: 400;
  color: #ececec;
}

.calendar-body {
  padding: 16px 20px;
}

.month-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.current-month-year {
  font-size: 14px;
  font-weight: 600;
}

.nav-btns {
  display: flex;
  gap: 4px;
}

.nav-btn {
  background: transparent;
  border: none;
  color: #fff;
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  text-align: center;
}

.weekday {
  font-size: 11px;
  font-weight: 600;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.day-cell {
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.2s;
}

.day-cell:hover {
  background: rgba(255, 255, 255, 0.1);
}

.day-cell.other-month {
  color: rgba(255, 255, 255, 0.3);
}

.day-cell.today {
  background: #60cdff;
  color: #1a1a1a;
  font-weight: 600;
}

.day-cell.selected:not(.today) {
  background: rgba(96, 205, 255, 0.2);
  border: 1px solid #60cdff;
}

/* Animations */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
