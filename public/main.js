const {BrowserWindow,app,ipcMain, Menu, Notification} = require("electron")
// const {createMenu} = require("./menus/MainMenu")
require('@electron/remote/main').initialize()
const path = require('path')
const isDev = require('electron-is-dev')
const { getFileStructure } = require("./methods/FileStructureMethods")
const walkdir = require('walkdir')
const dir = require("node-dir")
const fs = require('fs')
const spawn = require('child_process').spawn
let mainWindow 

// set to true if running from home or false if running from work.
// this will change the hardcoded paths
const DEV_HOME = true

let testsRoot = undefined
let reportsRoot = undefined

if(DEV_HOME){
     testsRoot = "C:\\Users\\JT\\Desktop\\dev\\electron\\testfiles"
     reportsRoot = "C:\\Users\\JT\\Desktop\\dev\\electron\\results"
}
else
{
    testsRoot = "C:\\Users\\john.thomson\\Desktop\\github\\testfiles"
    reportsRoot = "C:\\Users\\john.thomson\\Desktop\\github\\results"
}

const menuItems = [
    {
        label : "File",
        submenu : [
            {
                label : "Preferences"
            },
            {
                type : "separator"
            },
            {
                role : "quit"           
            }
            // {
            //     label : "New Window",
            //     click : async () => {
            //         const win2 = new BrowserWindow({
            //             height : 300,
            //             hieght : 400,
            //             show: false,
            //             webPreferences : {
            //                 preload : path.join(__dirname, "win2preload.js")
            //             }
            //         })

            //         win2.loadFile("index2.html")

            //         win2.once("ready-to-show", () => win2.show())
            //     }
            // },
           
        ]
    },
    {
        label : "About",
        submenu : [
            {
                label : "Information",
                click : async () => {
                    const aboutWindow = new BrowserWindow({
                        width:300,
                        height:300,
                        resizable : false,
                        movable : false,
                        parent : mainWindow,
                        modal : true,
                        show: false,
                        devTools : true,
                        title: "About",
                        webPreferences : {
                            preload : path.join(__dirname, "../aboutWindowPreload.js")
                        }
                    })
                    aboutWindow.loadURL("http://localhost:3000/about")
                    aboutWindow.setMenu(null)
                    aboutWindow.once("ready-to-show", aboutWindow.show())
                }

            }
        ]
    },
    {
        label : "Dev",
        submenu : [
            {
                label : "Toggle Dev Tools",
                click : async () => {
                    mainWindow.webContents.toggleDevTools()
                },
                accelerator : 'Ctrl+D'
            }
        ]
    }
]

createMenu = () => {   
    const menu = Menu.buildFromTemplate(menuItems)
    Menu.setApplicationMenu(menu)
}




const createWindow = () => {
    
     mainWindow = new BrowserWindow({
        width:1366,
        height: 768,
        webPreferences : {
            devTools : true,
            enableRemoteModule: true,
            nodeIntegration : true,
            contextIsolation : false,
            preload : path.join(__dirname, "preloads/mainWindowPreload.js")
        }
    })
    mainWindow.loadURL(isDev ? "http://localhost:3000" : path.join(__dirname, "../build/index.html") )
    exports.mainWindow
}

app.on("ready",() => {

    createWindow()
    createMenu()

    ipcMain.on('test-data', (event,data) => {
        console.log(data)

        mainWindow.webContents.send('data-received', "Some more data")
    })

    ipcMain.on("get-reports-explorer", async (event) => {
          try {
          dir.promiseFiles(reportsRoot)
            .then(files => {
                if(files)
                    event.reply('reports-explorer', files,reportsRoot) 
            })
            .catch(err => {
                console.log(err)
            })
        }
        catch(e)
        {
            console.log(e)
        }
    } )

    ipcMain.on("get-tests-explorer", async (event) => {
          try {
          dir.promiseFiles(testsRoot)
            .then(files => {
                if(files)
                    event.reply('tests-explorer', files.sort(),testsRoot) 
            })
            .catch(err => {
                console.log(err)
            })
        }
        catch(e)
        {
            console.log(e)
        }
    } )

    ipcMain.on('get-test-report', async (event,filePath) => {
        fs.readFile(filePath, "utf-8", (err,res) => {
            if(err)
            {
                console.log(err)
            }
            else
            {
                event.reply('test-report-contents',res)
            }
        })
    })

    ipcMain.on('run-test', async (event,path) => {
        try {
            const combinedPath = testsRoot + "/"+ path.trim()
            console.log(combinedPath)
            const process = spawn('python', [combinedPath])

            process.stdout.on('data', data => {
                event.reply('test-output', data.toString())
            })

            process.on('close', code => {
                console.log(`Child process for ${path} finished with exit code ${code}`)
                new Notification({title:"Test Finished", body: `${path} has finished`}).show()
            })

        }
        catch(e) {
            console.log(e)
        }
    })

    ipcMain.on('get-files-in-folder', async (event,folder) => {
        try{
            const files = fs.readdirSync(folder)
            event.reply('files-in-folder', files)            
        }
        catch(e) 
        {
            console.log(e)
        }
    })

    ipcMain.on('read-file-contents', async (event,path) => {
        try {
            
            const contents = fs.readFile(`${testsRoot}/${path.trim()}`, 'utf-8', (err,contents) => {
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    const lines = []
                    contents.split(/\r?\n/).forEach(line => {
                        lines.push(line)
                    })
    
                    event.reply('file-contents',lines)
                    fs.close(1)

                }
            });
            
        }
        catch(e)
        {
            console.log(e)
        }
    })

})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin')
        app.quit()
})

app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0)
        createWindow()
})

