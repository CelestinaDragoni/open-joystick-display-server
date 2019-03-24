require('events').EventEmitter.defaultMaxListeners = 99;

const {app, BrowserWindow} = require('electron');
let mainWindow;

function createWindow () {

    if (process.platform === "win32") {
        cwd = __dirname.replace('app\\js', '');
        ico = cwd+"app/icons/icon.png"; 
    } else if (process.platform === "darwin") {
        cwd = __dirname.replace('app/js', '');
        ico = cwd+"app/icons/icon.icns";
    }else {
        cwd = __dirname.replace('app/js', '');
        ico = cwd+"app/icons/icon.png";
    } 
    
    const windowConfig = {
        icon:ico,
        width:300, 
        height:400,
        x:0, 
        y:0, 
        minWidth:50, 
        minHeight:50, 
        menu:null,
        toolbar:false,
        minimizable:false,
        fullscreen:false,
        resizable:false,
        title: "Open Joystick Display Server",
        webPreferences:{nodeIntegration:true}
    };

    mainWindow = new BrowserWindow(windowConfig);
    mainWindow.setMenu(null);

    // Our Controller FIle
    mainWindow.loadFile('app/index.html');
    
}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit();
    }
});
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});



