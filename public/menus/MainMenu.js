const {Menu, shell, BrowserWindow} = require("electron")
const path = require("path")
const {mainWindow} = require("../main")
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
                label : "Open Dev Tools",
                click : async () => {
                    mainWindow.webContents.openDevTools()
                }
            }
        ]
    }
]

exports.createMenu = () => {
    const menu = Menu.buildFromTemplate(menuItems)
    Menu.setApplicationMenu(menu)
}

