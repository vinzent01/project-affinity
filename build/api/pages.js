"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function Setup(app) {
    app.express.get('/', (req, res) => {
        const template = fs_1.default.readFileSync(path_1.default.join("public/template.html")).toString();
        const page = fs_1.default.readFileSync(path_1.default.join("public/pages/home.html")).toString();
        const result = template.replace("{{ page }}", page);
        res.send(result);
    });
    app.express.get('/*', (req, res) => {
        const template = fs_1.default.readFileSync(path_1.default.join("public/template.html")).toString();
        const page = fs_1.default.readFileSync(path_1.default.join("public/pages", req.url + ".html")).toString();
        const result = template.replace("{{ page }}", page);
        res.send(result);
    });
    app.express.get('/play/:adventure', (req, res) => {
        const template = fs_1.default.readFileSync(path_1.default.join("public/template.html")).toString();
        const page = fs_1.default.readFileSync(path_1.default.join("public/pages/play.html")).toString();
        const result = template.replace("{{ page }}", page);
        res.send(result);
    });
}
exports.default = { Setup };
