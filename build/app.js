"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const adventure_1 = __importDefault(require("./api/adventure"));
const history_1 = __importDefault(require("./api/history"));
const pages_1 = __importDefault(require("./api/pages"));
class App {
    constructor() {
        this.express = (0, express_1.default)();
        this.express.use((0, cors_1.default)());
        this.express.use(express_1.default.static(path_1.default.join('public')));
        this.express.use(express_1.default.json()); // Middleware para interpretar o JSON no corpo das requisições
        this.express.use(body_parser_1.default.json()); //Handles JSON requests
        this.express.use(body_parser_1.default.urlencoded({ extended: false })); //Handles normal post requests
        this.express.use((0, compression_1.default)({ filter: () => false })); // Desativa compressão
        this.SetupRoutes();
    }
    SetupRoutes() {
        adventure_1.default.Setup(this);
        history_1.default.Setup(this);
        pages_1.default.Setup(this);
    }
    Listen(port) {
        this.express.listen(port, "localhost", () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        });
    }
}
exports.default = App;
