<template>
  <div class="linux-container">
    <div class="terminal-card">
      <div class="terminal-header">
        <div class="dots">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <div class="tab">portfolio@linux:~$</div>
      </div>
      <div class="terminal-body">
        <div class="line">
          <span class="prompt">portfolio@linux:~$</span>
          <span class="cursor-line">whoami</span>
        </div>
        <div class="output">
          Welcome to my Linux-inspired portfolio.
        </div>
        <div class="line">
            <span class="prompt">portfolio@linux:~$</span>
            <span class="cursor-line">ls -la</span>
        </div>
        <div class="grid">
          <div class="folder">drwxr-xr-x  projects/</div>
          <div class="folder">drwxr-xr-x  about/</div>
          <div class="folder">drwxr-xr-x  contact/</div>
        </div>
        <div class="line last">
            <span class="prompt">portfolio@linux:~$</span>
            <span class="cursor">_</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.linux-container {
  height: 100vh;
  background: #2e3440;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
}

.terminal-card {
  width: 90%;
  max-width: 900px;
  height: 60vh;
  background: #3b4252;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #4c566a;
  animation: slideUp 0.6s ease-out;
}

.terminal-header {
  height: 35px;
  background: #434c5e;
  display: flex;
  align-items: center;
  padding: 0 15px;
  position: relative;
}

.dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red { background: #bf616a; }
.dot.yellow { background: #ebcb8b; }
.dot.green { background: #a3be8c; }

.tab {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #d8dee9;
  font-size: 14px;
}

.terminal-body {
  flex: 1;
  padding: 20px;
  color: #d8dee9;
  font-size: 1.1rem;
  line-height: 1.6;
}

.prompt {
  color: #81a1c1;
  margin-right: 15px;
}

.output {
    color: #a3be8c;
    margin: 10px 0 20px 0;
}

.grid {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin: 10px 0 20px 0;
    color: #88c0d0;
}

.folder {
    cursor: pointer;
}

.folder:hover {
    text-decoration: underline;
}

.cursor {
  display: inline-block;
  width: 10px;
  background: white;
  animation: blink 1s infinite alternate;
}

@keyframes blink {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
