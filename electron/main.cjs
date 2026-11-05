/**
 * electron/main.cjs
 * نقطة انطلاق تطبيق سطح المكتب لنظام "السماحي OS"
 * معالجة فائقة للأداء، عزل العمليات، منع تعارض المنافذ، وتسريع الرندرة
 */

const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const http = require('http');
const net = require('net');
const fs = require('fs');

// تسريع الأداء الرسومي وعتاد المعالج (Hardware Acceleration)
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');

let mainWindow = null;
let activeServerPort = 3000;

// حماية العملية الرئيسية من التعطل
process.on('uncaughtException', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.warn(`Port already in use, handling gracefully.`);
  } else {
    console.error('Electron uncaughtException:', err);
  }
});

// العثور على منفذ متاح تلقائياً لضمان عدم حدوث أي تصادم
function findFreePort(startPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findFreePort(startPort + 1));
    });
  });
}

// فحص جاهزية الخادم عبر HTTP
function checkHttpReady(port, callback) {
  const req = http.get(`http://127.0.0.1:${port}`, (res) => {
    callback(res.statusCode < 500);
  });
  req.on('error', () => {
    callback(false);
  });
  req.setTimeout(600, () => {
    req.destroy();
    callback(false);
  });
}

// تشغيل الخادم الخلفي المدمج بأمان
function startEmbeddedServer(port) {
  process.env.NODE_ENV = 'production';
  process.env.PORT = String(port);

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

  const possibleServerPaths = [
    path.join(__dirname, '../dist-server/server.cjs'),
    path.join(process.resourcesPath || '', 'dist-server/server.cjs'),
    path.join(process.resourcesPath || '', 'app.asar/dist-server/server.cjs'),
    path.resolve(process.cwd(), 'dist-server/server.cjs'),
  ];

  let serverLoaded = false;
  for (const sp of possibleServerPaths) {
    if (fs.existsSync(sp)) {
      try {
        require(sp);
        console.log(`السماحي OS: الخادم المدمج يعمل بنجاح على المنفذ ${port}`);
        serverLoaded = true;
        break;
      } catch (err) {
        console.error('خطأ أثناء تشغيل حزمة السيرفر:', err);
      }
    }
  }

  if (!serverLoaded) {
    console.warn('لم يتم العثور على حزمة السيرفر، سيتم الاعتماد على العرض المحلي للملفات.');
  }
}

function createWindow(port) {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'السماحي OS — سنة البناء 2027',
    backgroundColor: '#07090E',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: false,
      backgroundThrottling: false,
      devTools: !app.isPackaged,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.webContents.on('console-message', (_event, _level, message) => {
    console.log(`[Renderer] ${message}`);
  });

  // فتح الروابط الخارجية في المتصفح الافتراضي
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      if (!url.includes(`127.0.0.1:${port}`) && !url.includes(`localhost:${port}`)) {
        shell.openExternal(url);
        return { action: 'deny' };
      }
    }
    return { action: 'allow' };
  });

  const loadUrl = `http://localhost:${port}`;
  let attempts = 0;
  const maxAttempts = 25;

  function tryLoad() {
    checkHttpReady(port, (isReady) => {
      if (isReady && mainWindow) {
        mainWindow.loadURL(loadUrl);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryLoad, 150);
      } else {
        // بديل الطوارئ: تحميل الملف المحلي مباشرة (يعمل بنجاح تام بفضل المسارات النسبية)
        const possibleIndex = [
          path.join(__dirname, '../dist/index.html'),
          path.join(process.resourcesPath || '', 'dist/index.html'),
          path.join(process.resourcesPath || '', 'app.asar/dist/index.html'),
          path.resolve(process.cwd(), 'dist/index.html'),
        ];
        for (const p of possibleIndex) {
          if (fs.existsSync(p) && mainWindow) {
            mainWindow.loadFile(p);
            break;
          }
        }
      }
    });
  }

  tryLoad();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// قفل التشغيل الأحادي
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

  app.whenReady().then(async () => {
    try {
      // في وضع التطوير: إذا كان منفذ 3000 يعمل، اتصل به لدعم HMR
      if (!app.isPackaged) {
        const port3000Busy = await new Promise((res) => {
          const s = net.createServer().once('error', () => res(true)).once('listening', () => s.close(() => res(false))).listen(3000, '127.0.0.1');
        });

        if (port3000Busy) {
          activeServerPort = 3000;
          console.log('السماحي OS (وضع التطوير): تم العثور على خادم نشط على 3000.');
        } else {
          activeServerPort = await findFreePort(3000);
          startEmbeddedServer(activeServerPort);
        }
      } else {
        // في تطبيق .exe الإنتاجي: احجز منفذاً متاحاً وشغّل الخادم المدمج الخاص بالتطبيق
        activeServerPort = await findFreePort(3000);
        startEmbeddedServer(activeServerPort);
      }
    } catch (e) {
      console.warn('تهيئة المنفذ واجهت تحذيراً:', e);
      activeServerPort = 3000;
    }

    createWindow(activeServerPort);

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow(activeServerPort);
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
