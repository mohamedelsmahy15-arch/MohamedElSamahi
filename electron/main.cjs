/**
 * electron/main.cjs
 * نقطة انطلاق تطبيق سطح المكتب لنظام "السماحي OS"
 * معالجة فائقة للأداء، عزل العمليات، منع تعارض المنافذ، وتسريع الرندرة
 * الإصدار: 2.0 — مُصلَح ومُحسَّن للاستقرار الكامل
 */

const { app, BrowserWindow, shell, dialog } = require('electron');
const path = require('path');
const http = require('http');
const net = require('net');
const fs = require('fs');

// ضبط استهلاك الذاكرة لـ V8 على الأجهزة ذات الرامات المحدودة (~8GB)
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512');

let mainWindow = null;
let activeServerPort = 3000;

// منع ظهور نوافذ الخطأ المزعجة في الواجهة
if (dialog && typeof dialog.showErrorBox === 'function') {
  dialog.showErrorBox = function (title, content) {
    console.warn(`[Suppressed Dialog] ${title}: ${content}`);
  };
}

// حماية العملية الرئيسية من التعطل
process.on('uncaughtException', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.warn(`Port already in use, handling gracefully.`);
  } else {
    console.error('Electron uncaughtException:', err && err.message ? err.message : err);
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

// فحص جاهزية الخادم عبر HTTP — محمي من الاستدعاء المتكرر
function checkHttpReady(port, callback) {
  let done = false;
  const finish = (val) => {
    if (!done) {
      done = true;
      callback(val);
    }
  };

  const req = http.get(`http://127.0.0.1:${port}`, (res) => {
    res.resume(); // استهلاك البيانات فوراً لتحرير السوكيت
    finish(res.statusCode < 500);
  });

  req.on('error', () => {
    finish(false);
  });

  req.setTimeout(500, () => {
    req.destroy();
    finish(false);
  });
}

// الحصول على مسار dist الصحيح في كل البيئات
function resolveDistPath() {
  const candidates = [
    process.env.DIST_PATH,
    path.join(__dirname, '../dist'),
    path.join(process.resourcesPath || '', 'app.asar/dist'),
    path.join(process.resourcesPath || '', 'dist'),
    path.resolve(process.cwd(), 'dist'),
  ].filter(Boolean);

  for (const d of candidates) {
    const indexFile = path.join(d, 'index.html');
    if (fs.existsSync(indexFile)) {
      return d;
    }
  }
  return null;
}

// الحصول على مسار server.cjs الصحيح
function resolveServerPath() {
  const candidates = [
    path.join(__dirname, '../dist-server/server.cjs'),
    path.join(process.resourcesPath || '', 'app.asar/dist-server/server.cjs'),
    path.join(process.resourcesPath || '', 'dist-server/server.cjs'),
    path.resolve(process.cwd(), 'dist-server/server.cjs'),
  ].filter(Boolean);

  for (const sp of candidates) {
    if (fs.existsSync(sp)) return sp;
  }
  return null;
}

// تشغيل الخادم الخلفي المدمج بأمان
function startEmbeddedServer(port) {
  process.env.NODE_ENV = 'production';
  process.env.PORT = String(port);

  // تعيين مسار dist للسيرفر
  const distPath = resolveDistPath();
  if (distPath) {
    process.env.DIST_PATH = distPath;
    console.log(`[السماحي OS] dist path: ${distPath}`);
  }

  const serverPath = resolveServerPath();
  if (!serverPath) {
    console.warn('[السماحي OS] لم يتم العثور على حزمة السيرفر — سيتم الاعتماد على loadFile مباشرة.');
    return false;
  }

  try {
    require(serverPath);
    console.log(`[السماحي OS] الخادم المدمج يعمل بنجاح على المنفذ ${port}`);
    return true;
  } catch (err) {
    console.error('[السماحي OS] خطأ أثناء تشغيل حزمة السيرفر:', err);
    return false;
  }
}

function createWindow(port, useServerMode) {
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
      // السماح بتحميل الملفات المحلية بشكل صحيح
      webSecurity: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.webContents.on('console-message', (_event, _level, message) => {
    if (message && !message.includes('Download the React DevTools')) {
      console.log(`[Renderer] ${message}`);
    }
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

  if (useServerMode) {
    // وضع الخادم HTTP: انتظار الخادم ثم التحميل مرة واحدة فقط دون إعادة تحميل متكررة
    const loadUrl = `http://127.0.0.1:${port}`;
    let attempts = 0;
    const maxAttempts = 30; // 30 × 150ms = 4.5 ثانية كحد أقصى
    let pageLoaded = false;

    function tryLoad() {
      if (pageLoaded || !mainWindow) return;

      checkHttpReady(port, (isReady) => {
        if (pageLoaded || !mainWindow) return;

        if (isReady) {
          pageLoaded = true;
          console.log(`[السماحي OS] الخادم جاهز، جاري تحميل الصفحة: ${loadUrl}`);
          mainWindow.loadURL(loadUrl).catch((err) => {
            console.error('[السماحي OS] خطأ في loadURL:', err);
            loadFallback();
          });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryLoad, 150);
        } else {
          pageLoaded = true;
          console.warn('[السماحي OS] الخادم لم يستجب في الوقت المحدد، تفعيل loadFile...');
          loadFallback();
        }
      });
    }

    tryLoad();
  } else {
    // وضع loadFile المباشر (بدون خادم)
    loadFallback();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// تحميل الملف المحلي مباشرة (Fallback آمن وسريع)
function loadFallback() {
  if (!mainWindow) return;
  const distPath = resolveDistPath();
  if (distPath) {
    const indexPath = path.join(distPath, 'index.html');
    console.log(`[السماحي OS] تحميل مباشر من: ${indexPath}`);
    mainWindow.loadFile(indexPath).catch((err) => {
      console.error('[السماحي OS] فشل تحميل index.html:', err);
    });
  } else {
    console.error('[السماحي OS] لم يتم العثور على مجلد dist — التطبيق لا يمكنه الاستمرار.');
  }
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
      if (!app.isPackaged) {
        // وضع التطوير: اتصال مباشر بخادم Vite dev إذا كان يعمل
        const port3000Busy = await new Promise((res) => {
          const s = net.createServer()
            .once('error', () => res(true))
            .once('listening', () => s.close(() => res(false)))
            .listen(3000, '127.0.0.1');
        });

        if (port3000Busy) {
          activeServerPort = 3000;
          console.log('[السماحي OS] وضع التطوير: خادم نشط على 3000.');
          createWindow(activeServerPort, true);
        } else {
          activeServerPort = await findFreePort(3000);
          const serverStarted = startEmbeddedServer(activeServerPort);
          createWindow(activeServerPort, serverStarted);
        }
      } else {
        // الإنتاج: تشغيل الخادم المدمج
        activeServerPort = await findFreePort(3000);
        const serverStarted = startEmbeddedServer(activeServerPort);
        createWindow(activeServerPort, serverStarted);
      }
    } catch (e) {
      console.warn('[السماحي OS] خطأ في التهيئة:', e);
      activeServerPort = 3000;
      createWindow(activeServerPort, false);
    }

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow(activeServerPort, false);
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
