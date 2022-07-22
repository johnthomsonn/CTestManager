const {BrowserWindow,app,ipcMain, Menu} = require("electron")
// const {createMenu} = require("./menus/MainMenu")
require('@electron/remote/main').initialize()
const path = require('path')
const isDev = require('electron-is-dev')
const { getFileStructure } = require("./methods/FileStructureMethods")
const walkdir = require('walkdir')
const dir = require("node-dir")

let mainWindow 

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
const root = "C:\\Users\\JT\\Desktop\\dev\\electron\\testfiles"
app.on("ready",() => {

    createWindow()
    createMenu()

    ipcMain.on('test-data', (event,data) => {
        console.log(data)

        mainWindow.webContents.send('data-received', "Some more data")
    })

    ipcMain.on("get-reports-explorer", async (event) => {
        /*
        console.log("\n"+root+"\n")
        walkdir("C:\\Users\\JT\\Desktop\\dev\\electron\\testfiles\\", {})
        .on('file', (fn, stat) => {
            mainWindow.webContents.send('file', fn.slice(rootdir.length + 1), stat);
        })
        .on('directory', (fn, stat) => {
            mainWindow.webContents.send('directory', fn.slice(rootdir.length + 1), stat);
        })
        .on('error', (fn, err) => {
            console.error(`!!!! ${fn} ${err}`);
        });
                //event.reply('reports-explorer', sctructure)
           */
          try {
          let allFiles = null
          dir.promiseFiles(root)
            .then(files => {
                console.log('processing content of file', files);
                allFiles = files
            })
            .then(() => {
                if(allFiles)
                    event.reply('reports-explorer', allFiles.sort(),root)  
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

})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin')
        app.quit()
})

app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0)
        createWindow()
})

