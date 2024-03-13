const { app, BrowserWindow , session , systemPreferences} = require('electron/main')



const {execFile}  = require("child_process")

const path = require("path");
const fs = require("fs")

const kill = require('tree-kill');

let python;


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag : true
    }
  })

  win.loadFile('index.html')

// win.loadURL("http://localhost:3000")

win.on("close" , ()=>{
  kill(python.pid)
})


python = execFile(path.join(__dirname , "speech2.exe"), [],
(error, stdout, stderr) => {
    if (error) {
        throw error;
    }
    console.log(stdout);
});



}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  kill(python.pid)
})