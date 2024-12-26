"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function Setup(app) {
    app.express.get("/api/history/:adventure", (req, res) => {
        const adventure = req.params.adventure;
        if (adventure == undefined)
            res.status(400).json({ succes: false, error: "invalid adventure param" });
        try {
            const history = JSON.parse(fs_1.default.readFileSync(path_1.default.join("game/adventures", adventure), { "encoding": "utf-8" }));
            res.json(history);
        }
        catch (error) {
            res.status(400).json({ succes: false, error: "Could not load adventure history " + error });
        }
    });
    app.express.post("/api/append-history/:adventure", (req, res) => {
        const adventure = req.params.adventure;
        const newHistory = req.body.history;
        if (adventure == undefined)
            res.status(400).json({ succes: false, error: "invalid adventure param" });
        try {
            const previousHistory = JSON.parse(fs_1.default.readFileSync(path_1.default.join("game/adventures", adventure, "history.json"), { "encoding": "utf-8" }));
            console.log(newHistory);
            const UpdatedHistory = JSON.stringify([
                ...previousHistory,
                ...newHistory
            ]);
            fs_1.default.writeFileSync(path_1.default.join("game/adventures", adventure, "history.json"), UpdatedHistory);
            res.json({ succes: true });
        }
        catch (error) {
            res.status(400).json({ succes: false, error: "Could not load adventure history " + error });
        }
    });
}
exports.default = { Setup };
