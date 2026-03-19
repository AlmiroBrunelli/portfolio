<template>
  <div class="windows-container">
    <div class="acrylic-card">
      <div class="title-bar">
        <div class="title">My Portfolio - Windows Edition</div>
        <div class="controls">
          <span class="btn">_</span>
          <span class="btn">□</span>
          <span class="btn close">x</span>
        </div>
      </div>
      <div class="content">
        <h1>Welcome, Windows User</h1>
        <p class="subtitle">Experience the fluidity of design.</p>
        <div class="grid">
          <div class="item">Projects</div>
          <div class="item">About Me</div>
          <div class="item">Contact</div>
        </div>
      </div>
    </div>
    <div class="taskbar">
        <div class="start-btn">⊞</div>
    </div>
  </div>
</template>

<style scoped>
.windows-container {
  height: 100vh;
  background: linear-gradient(135deg, #0078d4, #00bcf2);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
}

.acrylic-card {
  width: 80%;
  max-width: 1000px;
  height: 70vh;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: fadeIn 0.8s ease-out;
}

.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.1);
  color: white;
  font-size: 14px;
}

.controls .btn {
  padding: 4px 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.controls .btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.controls .btn.close:hover {
  background: #e81123;
}

.content {
  flex: 1;
  padding: 40px;
  color: white;
  overflow-y: auto;
}

h1 {
  font-size: 3rem;
  font-weight: 300;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.8;
  margin-bottom: 40px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.item {
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 4px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s, background 0.3s;
  cursor: pointer;
}

.item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.taskbar {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 48px;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    padding: 0 10px;
}

.start-btn {
    font-size: 24px;
    color: white;
    padding: 5px 15px;
    transition: background 0.2s;
    cursor: pointer;
}

.start-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
