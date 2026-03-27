import { reactive, computed } from 'vue'
import ptBR from './locales/pt-BR'
import enUS from './locales/en-US'

const MESSAGES = {
  'pt-BR': ptBR,
  'en-US': enUS
}

type Locale = keyof typeof MESSAGES

// Detection logic
const getBrowserLocale = (): Locale => {
  const lang = navigator.language
  if (lang.startsWith('pt')) return 'pt-BR'
  return 'en-US'
}

const savedLocale = localStorage.getItem('user-locale') as Locale
const initialLocale = savedLocale && MESSAGES[savedLocale] ? savedLocale : getBrowserLocale()

const state = reactive({
  locale: initialLocale
})

export const i18n = {
  state,
  
  setLocale(newLocale: Locale) {
    if (MESSAGES[newLocale]) {
      state.locale = newLocale
      localStorage.setItem('user-locale', newLocale)
    }
  },

  t(path: string) {
    const keys = path.split('.')
    let current: any = MESSAGES[state.locale]
    
    for (const key of keys) {
      if (current && current[key]) {
        current = current[key]
      } else {
        return path
      }
    }
    return current
  }
}

export const useI18n = () => {
  return {
    t: i18n.t,
    locale: computed(() => state.locale),
    setLocale: i18n.setLocale
  }
}
