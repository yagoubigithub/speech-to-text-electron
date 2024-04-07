const { app, BrowserWindow , session , systemPreferences} = require('electron/main')



const {execFile}  = require("child_process")

const path = require("path");
const fs = require("fs");

const kill = require('tree-kill');

let python;


function createWindow () {
  const win = new BrowserWindow({
    show : false,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag : true
    }
  })

  win.loadFile('index.html')

// win.loadURL("http://localhost:3000")

// win.on("close" , ()=>{
  
//   kill(python.pid, 'SIGKILL', function(err) {
//     // Do things
//     console.log(err)

//     fs.writeFileSync("error.txt"  ,err.message)
//     app.quit()
//   app.exit(0)
// });
  
// })


// python = execFile(path.join(__dirname , "speech2.exe"), [],
// (error, stdout, stderr) => {
//     if (error) {
//       console.log(error)
        
//     }
//     console.log(stdout);
//     console.log(stderr);
   
// });
win.show()



}

app.whenReady().then(() => {
  createWindow()

 
})

