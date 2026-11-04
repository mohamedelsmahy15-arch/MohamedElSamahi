const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

let mainWindow = null;
const PORT = 3000;

// فحص جاهزية السيرفر المحلي
function checkServer(port, callback) {
  const req = http.get(`http://127.0.0.1:${port}`, (res) => {
    callback(true);
  });
  req.on('error', () => {
    callback(false);
  });
  req.setTimeout(800, () => {
    req.destroy();
    callback(false);
  });
}

// تشغيل السيرفر الداخلي المدمج في الإنتاج
function startEmbeddedServer() {
  process.env.NODE_ENV = 'production';
  process.env.PORT = String(PORT);

  const possibleDist = [
    path.join(__dirname, '../dist'),
    path.join(process.resourcesPath || '', 'dist'),
    path.join(process.resourcesPath || '', 'app.asar/dist'),
    path.resolve(process.cwd(), 'dist'),
  ];

  for (const d of possibleDist) {
    if (fs.existsSync(d)) {
      process.env.DIST_PATH = d;
      break;
    }
  }

  try {
    const serverBundlePath = path.join(__dirname, '../dist-server/server.cjs');
    if (fs.existsSync(serverBundlePath)) {
      require(serverBundlePath);
      console.log('السماحي OS Embedded Server Started on Port 3000');
    } else {
      console.warn('Server bundle not found at', serverBundlePath);
    }
  } catch (err) {
    console.error('Failed to start embedded server:', err);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 880,
    minWidth: 960,
    minHeight: 640,
    title: 'السماحي OS — سنة البناء 2027',
    backgroundColor: '#0a0a0a',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: true,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // فتح الروابط الخارجية (مثل روابط الدروس والتعلم) في متصفح النظام الافتراضي (Chrome / Edge)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      if (!url.includes('localhost:3000') && !url.includes('127.0.0.1:3000')) {
        shell.openExternal(url);
        return { action: 'deny' };
      }
    }
    return { action: 'allow' };
  });

  // محاولة التحميل والاتصال
  const loadUrl = `http://localhost:${PORT}`;
  let attempts = 0;
  const maxAttempts = 40;

  function tryLoad() {
    checkServer(PORT, (isReady) => {
      if (isReady) {
        mainWindow.loadURL(loadUrl);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryLoad, 250);
      } else {
        const localFile = path.join(__dirname, '../dist/index.html');
        if (fs.existsSync(localFile)) {
          mainWindow.loadFile(localFile);
        }
      }
    });
  }

  tryLoad();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// قفل التشغيل الأحادي لمنع فتح نسختين في نفس الوقت
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    checkServer(PORT, (isRunning) => {
      if (!isRunning) {
        startEmbeddedServer();
      }
      createWindow();
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
