const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

function createWindow() {
    const size = screen.getPrimaryDisplay().workAreaSize;

    const win = new BrowserWindow({
        webPreferences: {
            width: 800,
            height: 600,
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    // Cargar la aplicación Angular dependiendo del entorno

    if (!app.isPackaged) {

        // En desarrollo, cargar desde el servidor de desarrollo de Angular

        win.loadURL('http://localhost:4200');
        win.webContents.openDevTools();

    } else {

        // En producción, cargar el archivo index.html generado por Angular

        const indexPath = path.join(__dirname, 'dist', 'my-angular-app', 'browser', 'index.html');
        console.log('Loading file:', indexPath);
        win.loadFile(indexPath);

        win.webContents.on('did-fail-load', () => {
            // Reintentar cargar el archivo en caso de fallo, esto previene errores en algunas plataformas
            console.log('Retrying to load file:', indexPath);
            win.loadFile(indexPath);
        });
    }

    // Maximizar la ventana y mostrarla
    win.maximize();
    win.show();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});