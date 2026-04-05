<script setup lang="ts">
import { useI18n } from '../../i18n'

const { t, locale } = useI18n()
const emit = defineEmits(['open-pdf', 'open-app'])

const openOriginalPdf = () => {
  // We only have the real PDF for PT for now
  const path = '/assets/resume/2026-03 - Currículo - Almiro Brunelli Neto.pdf'
  emit('open-pdf', { 
    type: 'pdf', 
    path, 
    label: t('explorer.resume') 
  })
}

const openEnglishMd = () => {
  window.open('/assets/resume/resume-en.md', '_blank')
}
</script>

<template>
  <div class="resume-container">
    <div class="resume-paper">
      <div class="resume-actions no-print">
        <button class="action-btn" @click="openOriginalPdf">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          {{ locale === 'en-US' ? 'View Original PDF (PT)' : 'Ver PDF Original' }}
        </button>
        <button v-if="locale === 'en-US'" class="action-btn" @click="openEnglishMd">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download English MD
        </button>
      </div>

      <header class="resume-header">
        <h1>{{ t('resume.name') }}</h1>
        <p class="subtitle">{{ t('resume.title') }}</p>
        <div class="contact-info">
          <span>📍 Salvador, BA - Brasil</span>
          <span class="dot">•</span>
          <span>📧 almiro.brunelli@gmail.com</span>
          <span class="dot">•</span>
          <span>🔗 linkedin.com/in/almirobrunelli</span>
        </div>
      </header>

      <section class="resume-section">
        <p class="profile-text">{{ t('resume.profile') }}</p>
      </section>

      <div class="resume-content-grid">
        <div class="main-column">
          <section class="resume-section">
            <h2 class="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              {{ t('resume.experience.title') }}
            </h2>
            
            <div class="experience-item">
              <div class="item-header">
                <h3>{{ t('resume.experience.uneb_current.role') }}</h3>
                <span class="period">{{ t('resume.experience.uneb_current.period') }}</span>
              </div>
              <p class="company">{{ t('resume.experience.uneb_current.company') }}</p>
              <p class="description">{{ t('resume.experience.uneb_current.description') }}</p>
            </div>

            <div class="experience-item">
              <div class="item-header">
                <h3>{{ t('resume.experience.uneb_past.role') }}</h3>
                <span class="period">{{ t('resume.experience.uneb_past.period') }}</span>
              </div>
              <p class="company">{{ t('resume.experience.uneb_past.company') }}</p>
              <p class="description">{{ t('resume.experience.uneb_past.description') }}</p>
            </div>
          </section>

          <section class="resume-section">
            <h2 class="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
              </svg>
              {{ t('resume.education.title') }}
            </h2>
            <ul class="education-list">
              <li>{{ t('resume.education.ai') }}</li>
              <li>{{ t('resume.education.ads') }}</li>
              <li>{{ t('resume.education.is') }}</li>
            </ul>
          </section>
        </div>

        <aside class="side-column">
          <section class="resume-section">
            <h2 class="section-title">{{ t('resume.skills.title') }}</h2>
            <div class="skill-group">
              <p>{{ t('resume.skills.languages') }}</p>
              <p>{{ t('resume.skills.devops') }}</p>
              <p>{{ t('resume.skills.databases') }}</p>
              <p>{{ t('resume.skills.quality') }}</p>
            </div>
          </section>

          <section class="resume-section">
            <h2 class="section-title">{{ t('resume.languages.title') }}</h2>
            <ul class="language-list">
              <li>{{ t('resume.languages.pt') }}</li>
              <li>{{ t('resume.languages.en') }}</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resume-container {
  flex: 1;
  background: #525659;
  padding: 40px 20px;
  overflow-y: auto;
  display: flex;
  justify-content: center;
}

.resume-paper {
  width: 100%;
  max-width: 800px;
  background: white;
  color: #333;
  padding: 60px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
}

.resume-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 20px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #444;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #e5e5e5;
  border-color: #ccc;
  transform: translateY(-1px);
}

.resume-header {
  border-bottom: 2px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 30px;
  text-align: center;
}

.resume-header h1 {
  font-size: 32px;
  margin: 0;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 18px;
  color: #666;
  margin: 8px 0;
  font-weight: 500;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 12px;
  font-size: 13px;
  color: #888;
  flex-wrap: wrap;
}

.dot {
  color: #ccc;
}

.resume-section {
  margin-bottom: 30px;
}

.profile-text {
  line-height: 1.6;
  font-size: 15px;
  color: #444;
  font-style: italic;
  text-align: justify;
}

.resume-content-grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  text-transform: uppercase;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 15px;
}

.experience-item {
  margin-bottom: 20px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.experience-item h3 {
  font-size: 15px;
  margin: 0;
  color: #2c3e50;
}

.period {
  font-size: 12px;
  color: #888;
  font-weight: 600;
}

.company {
  font-size: 14px;
  color: #0078d4;
  font-weight: 600;
  margin: 2px 0;
}

.description {
  font-size: 13px;
  line-height: 1.5;
  color: #555;
}

.education-list, .language-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.education-list li, .language-list li {
  font-size: 13px;
  margin-bottom: 8px;
  position: relative;
  padding-left: 15px;
}

.education-list li::before, .language-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #0078d4;
}

.skill-group p {
  font-size: 13px;
  margin-bottom: 12px;
  line-height: 1.4;
}

.side-column {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

/* Dark mode adjustments if needed when parent passed darkMode prop */
/* For now, the resume paper is always white for that PDF feel */

@media (max-width: 600px) {
  .resume-content-grid {
    grid-template-columns: 1fr;
  }
  .resume-paper {
    padding: 30px;
  }
}
</style>
