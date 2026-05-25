const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let serverProcess = null;
let mainWindow = null;

function startBackend() {
  // Запуск Express-сервера (из скомпилированного dist/server.cjs)
  serverProcess = fork(path.join(__dirname, 'dist', 'server.cjs'), [], {
    env: { ...process.env, NODE_ENV: 'production', PORT: '3000' }
  });

  serverProcess.on('error', (err) => {
    console.error('Не удалось запустить сервер автозаполнения:', err);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Справка-Вызов Automate",
    autoHideMenuBar: true, // Скрыть верхнее меню
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Небольшая задержка перед загрузкой, чтобы дать Express подняться
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000').catch((err) => {
      console.log('Попытка переподключения...', err);
      // Если сервер не успел подняться, пробуем еще раз
      setTimeout(() => {
        mainWindow.loadURL('http://localhost:3000');
      }, 1000);
    });
  }, 1000);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Запуск приложения
app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Завершение работы при закрытии всех окон
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Полное завершение процессов при выходе
app.on('will-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
