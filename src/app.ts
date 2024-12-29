
import express from "express";
import path, { dirname } from "path";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import * as core from "express-serve-static-core";


import adventures from "./api/adventure";
import pages from "./api/pages";
import groq from "./AiCompletion";
import AiCompletion from "./AiCompletion";

import {app, BrowserWindow} from "electron";

import fs from "fs";

class App {

    public express : core.Express;
    public aicompletion : AiCompletion;
    public electron : Electron.App;
    
    public rootPath : string = ".";
    
    constructor() {
        this.electron = app;

        if (this.electron != undefined && this.electron.isPackaged){
            this.rootPath = this.electron.getAppPath();
        }


        this.express = express();
        this.express.use(cors());
        this.express.use(express.static(path.join(this.rootPath, 'public')));
        this.express.use(express.json());  // Middleware para interpretar o JSON no corpo das requisições
        this.express.use(bodyParser.json()); //Handles JSON requests
        this.express.use(bodyParser.urlencoded({ extended: false })); //Handles normal post requests
        this.express.use(compression({ filter: () => false })); // Desativa compressão
        this.aicompletion = new AiCompletion();        
    }

    SetupRoutes(){
        adventures.Setup(this);
        pages.Setup(this);
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

            this.SetupRoutes();
        }
        else {
            this.SetupRoutes();
        }



        this.express.listen(port, "localhost", () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        })
    }

}

export default App;