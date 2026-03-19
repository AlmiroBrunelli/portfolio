<template>
  <div class="mac-container">
    <div class="glass-window">
      <div class="traffic-lights">
        <span class="light red"></span>
        <span class="light yellow"></span>
        <span class="light green"></span>
      </div>
      <div class="mac-content">
        <h1>Welcome to my Mac-style Portfolio</h1>
        <p class="subtitle">Simplicity and elegance in every pixel.</p>
        <div class="mac-grid">
            <div class="mac-card">Projects</div>
            <div class="mac-card">About</div>
            <div class="mac-card">Contact</div>
        </div>
      </div>
    </div>
    <div class="dock">
        <div class="dock-item">📁</div>
        <div class="dock-item">🎨</div>
        <div class="dock-item">⚙️</div>
    </div>
  </div>
</template>

<style scoped>
.mac-container {
  height: 100vh;
  background: url('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3') no-repeat center center/cover;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.glass-window {
  width: 75%;
  max-width: 900px;
  height: 65vh;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 18px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: zoomIn 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.traffic-lights {
  display: flex;
  gap: 8px;
  padding: 15px 20px;
}

.light {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.light.red { background: #ff5f56; }
.light.yellow { background: #ffbd2e; }
.light.green { background: #27c93f; }

.mac-content {
  flex: 1;
  padding: 40px;
  text-align: center;
  color: #1d1d1f;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1.1rem;
  font-weight: 400;
  opacity: 0.8;
  margin-bottom: 50px;
}

.mac-grid {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.mac-card {
    background: white;
    padding: 20px 40px;
    border-radius: 12px;
    font-weight: 500;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s;
    cursor: pointer;
}

.mac-card:hover {
    transform: scale(1.05);
}

.dock {
    position: absolute;
    bottom: 20px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 10px;
    display: flex;
    gap: 15px;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.dock-item {
    font-size: 32px;
    cursor: pointer;
    transition: transform 0.2s;
}

.dock-item:hover {
    transform: scale(1.5);
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
