
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import * as core from "express-serve-static-core";


import adventures from "./api/adventure";
import pages from "./api/pages";
import groq from "./AiCompletion";
import AiCompletion from "./AiCompletion";

class App {

    public express : core.Express;
    public aicompletion : AiCompletion;

    constructor() {
        this.express = express();
        this.express.use(cors());
        this.express.use(express.static('public'));
        this.express.use(express.json());  // Middleware para interpretar o JSON no corpo das requisições
        this.express.use(bodyParser.json()); //Handles JSON requests
        this.express.use(bodyParser.urlencoded({ extended: false })); //Handles normal post requests
        this.express.use(compression({ filter: () => false })); // Desativa compressão
        this.aicompletion = new AiCompletion();

        this.SetupRoutes();
    }

    SetupRoutes(){
        adventures.Setup(this);
        pages.Setup(this);
    }


    Listen(port : number) {
        this.express.listen(port, "localhost", () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        })
    }

}

export default App;