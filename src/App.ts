
import express from "express";
import path, { dirname } from "path";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import * as core from "express-serve-static-core";


import adventures from "./api/adventure";
import pages from "./api/pages";
import apiKey from "./api/apiKey"

import {app, BrowserWindow} from "electron";

import fs from "fs";
import Context from "./Context";
import AiCompletion from "./AiCompletion";

class App {

    public express : core.Express;
    public electron : Electron.App;
    public rootPath : string = ".";
    public Context : Context;
    public AiCompletion : AiCompletion;
    
    constructor() {
        this.electron = app;
        
        if (this.electron && this.electron.isPackaged){
            this.rootPath = this.electron.getAppPath();
        }
        
        this.express = express();
        this.express.use(cors());
        this.express.use(express.static(path.join(this.rootPath, 'public')));
        this.express.use(express.json());  // Middleware para interpretar o JSON no corpo das requisições
        this.express.use(bodyParser.json()); //Handles JSON requests
        this.express.use(bodyParser.urlencoded({ extended: false })); //Handles normal post requests
        this.express.use(compression({ filter: () => false })); // Desativa compressão
        
        this.AiCompletion = new AiCompletion({
            backend : 'groq'
        });
        
        this.Context = new Context(this.AiCompletion);
        this.SetupRoutes();
    }

    SetupRoutes(){
        adventures.Setup(this);
        pages.Setup(this);
        apiKey.Setup(this);
    }


    Listen(port : number) {
        if (this.electron){
            this.electron.on("ready", () => {


                fs.writeFileSync("output.txt", this.rootPath);

                const window = new BrowserWindow({
                    width : 1200,
                    height : 600,
                    resizable: true,
                    fullscreenable : true,
                    autoHideMenuBar : true,
                    webPreferences : {
                        nodeIntegration : true
                    }
                });
        
                window.loadURL("http://localhost:3000");
            })

            this.electron.on('window-all-closed', () => {
                if (process.platform !== 'darwin') app.quit();
            })
        }




        this.express.listen(port, "localhost", () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        })
    }

}

export default App;