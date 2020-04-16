const electron = require("electron");
const { v4 : uuidv4 } = require('uuid');
uuidv4();
const {app, BrowserWindow, Menu, ipcMain} = electron;

let todayWindow;
let createWindow;

let allAppointment = [];

app.on("ready",  () => {
    todayWindow = new BrowserWindow({
       webPreferences : {
           nodeIntegration : true
        },
        title : "Aplikasi Temperature"  
    });

    todayWindow.loadURL(`file://${__dirname}/today.html`);
    todayWindow.on("closed", () => {
        app.quit();
        todayWindow = null;
    });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

});

const createWindowCreator = () =>{
    createWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration : true
        },

        width: 600,
        height: 400,
        title : "Riwayat"
    });
    
    createWindow.setMenu(null);
    createWindow.loadURL(`File://${__dirname}/create.html`);

    createWindow.on("closed", () => (createtWindow = null ));
};

ipcMain.on("appointment:create", (event, appointment) =>{
    appointment["id"] = uuidv4();
    appointment["done"] = 0;
    allAppointment.push(appointment);
    
    createWindow.close();
    console.log(allAppointment);
});
 
 
const menuTemplate = [{
    label : "File",
    submenu : [{
        label : "History",

            click(){
                createWindowCreator();
            }
        },
        {
            label: "Quit",
            accelerato : process.platform === "darwin" ? "Command+Q" :
            "Ctrl+Q",
            click(){
                app.quit(); 
            }


        }

    ]
}];