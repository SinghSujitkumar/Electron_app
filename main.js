const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;
// listen for app to be ready
app.on('ready', function() {
	// create a window
	mainWindow = new BrowserWindow({});
	// load html into window
	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, 'mainWindow.html'),
			protocol: 'file:',
			slashes: true
		})
	);
	// quit app when closed
	mainWindow.on('closed', function() {
		app.quit();
	});
	// build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	// insert menu
	Menu.setApplicationMenu(mainMenu);
});

// Handle  create add windiw
function createAddWindow() {
	// create a new window
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Add Shopping List Items'
	});
	// load html into window
	addWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, 'addWindow.html'),
			protocol: 'file:',
			slashes: true
		})
	);
	// garbage collection
	addWindow.on('close', () => {
		addWindow = null;
	});
}
// catch item:add
ipcMain.on('item:add', (e, item) => {
	console.log(item);
	mainWindow.webContents.send('item:add', item);
	addWindow.close();
});

// create a menu template
const mainMenuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Add Item',
				click() {
					createAddWindow();
				}
			},
			{
				label: 'Clear Item'
			},
			{
				label: 'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click() {
					app.quit();
				}
			}
		]
	}
];
// if mac , add empty objec to menu
if (process.platform == 'darwni') {
	mainMenuTemplate.unshift({});
}
// add developer tools item if not in production
if (process.env.NODE_ENV != 'production') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [
			{
				label: 'Toggle DevTools',
				accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	});
}
