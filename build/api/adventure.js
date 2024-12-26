"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function Setup(app) {
    console.log(__dirname);
    app.express.get("/api/adventures", (req, res) => {
        const files = fs_1.default.readdirSync("../game/adventures");
        res.json(files);
    });
    app.express.post("/api/new-adventure", (req, res) => {
        const { name } = req.body;
        if (name == undefined)
            res.status(400).json({ succes: false, error: "Invalid empty name" });
        try {
            fs_1.default.mkdir(path_1.default.join("/game/adventures/", name), (result) => {
                if (result === null || result === void 0 ? void 0 : result.errno)
                    res.status(400).json({ success: false, error: "Could not create folder for adventure" });
            });
            res.status(200).json({ success: true });
        }
        catch (_a) {
            res.status(400).json({ succes: false, error: "Could not create adventure" });
        }
    });
}
exports.default = { Setup };
