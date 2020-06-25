const electron = require ("electron");
const { v4 : uuidv4 } = require ('uuid');
uuidv4 ();
const fs = require ('fs'); 
const {
app,
BrowserWindow,
Menu,
ipcMain,
} = electron;

let tampilWindow;
let inputWindow;
let dataWindow;
let transaksiWindow;
let jualWindow;

let alllist = [];

let alldata = [];

fs.readFile("pembayaran.json", (err, jsonpembayaran) => {
    if(!err){
        const oldpembayaran =JSON.parse(jsonpembayaran);
        alllist = oldpembayaran;
    }
});

fs.readFile("daftar.json", (err, jsondaftar) => {
    if(!err){
        const olddaftar =JSON.parse(jsondaftar);
        alldata = olddaftar;
    }
});



app.on("ready", () => {
tampilWindow = new BrowserWindow({
webPreferences: {
   nodeIntegration: true
},
title: "Aplikasi Kasir"
});

tampilWindow.loadURL(`file://${__dirname}/tampil.html`);
tampilWindow.on("closed", () => {

    const jsonpembayaran = JSON.stringify(alllist);
    fs.writeFileSync("pembayaran.json", jsonpembayaran);

    const jsondaftar = JSON.stringify(alldata);
    fs.writeFileSync("daftar.json", jsondaftar);

   app.quit();
   tampilWindow = null;
});
   const mainMenu = Menu.buildFromTemplate(menuTemplate);
   Menu.setApplicationMenu(mainMenu);
});
const inputWindowCreator = () => {
   inputWindow = new BrowserWindow({
       webPreferences: {
           nodeIntegration: true
       },
       width: 600,
       height: 400,
       title: "Input Barang"
   });
   inputWindow.setMenu(null);
   inputWindow.loadURL(`file://${__dirname}/input.html`);
   inputWindow.on("closed", () =>(inputWindow = null ))
   // fungsi memanggil halaman input
};

const dataWindowCreator = () => {
   dataWindow = new BrowserWindow({
       webPreferences: {
           nodeIntegration: true
       },
       width: 600,
       height: 400,
       title: "Data Barang"
   });
   dataWindow.setMenu(null);
   dataWindow.loadURL(`file://${__dirname}/data.html`);
   dataWindow.on("closed", () =>(dataWindow = null ))
   // fungsi memanggil halaman data
};
const jualWindowCreator = () => {
    jualWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Transaksi Stock Keluar"
    });
    jualWindow.setMenu(null);
    jualWindow.loadURL(`file://${__dirname}/penjualan.html`);
    jualWindow.on("closed", () =>(jualWindow = null ))
    // fungsi memanggil halaman data
 };
 
const transaksiWindowCreator = () => {
   transaksiWindow = new BrowserWindow({
       webPreferences: {
           nodeIntegration: true
       },
       width: 600,
       height: 400,
       title: " Data Transaksi Keluar"
   });
   transaksiWindow.setMenu(null);
   transaksiWindow.loadURL(`file://${__dirname}/transaksi.html`);
   transaksiWindow.on("closed", () =>(transaksiWindow = null ))
   // fungsi memanggil halaman transaksi
};
// pembelian
ipcMain.on("transaksi:input", (event, transaksi) => {
    transaksi["id"] = uuidv4();
    transaksi["done"] = 0;
    alllist.push(transaksi);
    
    inputWindow.close();

    console.log(alllist);
});

ipcMain.on("transaksi:request:list", event =>{
    dataWindow.webContents.send('transaksi:request:list',alllist);
});

ipcMain.on("tampilan:request:list", event => {
    console.log("here2");
});

ipcMain.on("transaksi:done", (event, id) => {
    console.log("here3");
});

// penjualan
ipcMain.on("penjualan:data", (event, penjualan) =>{
    penjualan["id"] = uuidv4();
    penjualan["done"] =0;
    alldata.push(penjualan);
    jualWindow.close();
    console.log(alldata);
});

ipcMain.on("penjualan:request:data", event =>{
    transaksiWindow.webContents.send("penjualan:request:data",alldata);
});

const menuTemplate = [{
   label: "Pembelian",
   submenu: [{
       label: "Transaksi Stock Masuk",

       click() {
           inputWindowCreator();
       }
       },
         {
             label: "Data Barang Masuk",
             click() {
                 dataWindowCreator();
             }
         },
        
   ]
},
{
label: "Penjualan",
submenu: [{
    label: "Transaksi Stock Keluar",        
        click() {
                jualWindowCreator();
            }
        },
      {
            label:"Data Transaksi Keluar",
            click()
                {
                 transaksiWindowCreator();
                }
         },
     
]
},
{
    label: "Quit",
    //accelerator: process.platform ==="darwin" ? "Command+Q" : "Ctrl + Q",
    click() {
        app.quit();

    }
},
{
    label:"View",
    submenu:[{
        role: "reload"
    }, {
        role: "toggledevtools"
    }]
},
]