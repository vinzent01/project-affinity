import fs from "fs";
import path from "path";
import App from "../app";
import { appendAdata, LoadAdataJson } from "../data";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

function Setup(app : App){


    function TruncateMessages(messages : Array<any>, max : number){
        return messages.slice(Math.max(messages.length - max, 1));
    }

    app.express.get("/api/adventures", (req, res) => {
        const files = fs.readdirSync("game/adventures");
    
        res.json(files);
    
    })
    
    app.express.post("/api/adventures/new", (req, res) => {
        const { name } = req.body;
    
        if (name == undefined)
            res.status(400).json({succes : false, error : "Invalid empty name"});
        try {
            fs.mkdir(path.join("game/adventures/",name), (result) => {
                if (result?.errno)
                    res.status(400).json({success :false, error : "Could not create folder for adventure"});
            });

            res.status(200).json({success : true});
        }
        catch {
            res.status(400).json({succes : false, error : "Could not create adventure"});
        }
    })

    app.express.post("/api/adventures/delete", (req, res) => {
        const { adventure } = req.body;
    
        if (adventure == undefined){
            res.status(400).json({succes : false, error : "Invalid empty name"});
            return
        }

        try {
            fs.rm(path.join("game/adventures/",adventure), {recursive : true}, () => {});

            res.status(200).json({success : true});
            return;
        }
        catch (error) {
            res.status(400).json({succes : false, error : "Could not delete adventure " + error});
        }
    })

    app.express.get("/api/adventures/:adventure/history", (req, res) => {
        const adventure = req.params.adventure;

        const adventurePath = path.join("game/adventures", adventure);
        const historyPath = path.join(adventurePath, "history.adata");

        if (adventure == undefined){
            res.status(400).json({succes : false, error : "invalid adventure param"});
            return;
        }

        try {
            // verify if has history
            const hasAdventure = fs.statSync(adventurePath).isDirectory();

            if (hasAdventure == false){
                res.status(400).json({success : false, error : "Adventure does nont exists"});
            }

            const hasHistory = fs.existsSync(historyPath);

            if (!hasHistory){
                console.log("does not have history");
                // create initial history
                fs.appendFileSync(historyPath, "role -|- content -;-\n");
            }

            const history = LoadAdataJson(historyPath)

            res.json(history);
        }
        catch (error){
            res.status(400).json({succes : false, error : "Could not load adventure history " + error});
        }
    })

    app.express.post("/api/adventures/:adventure/send-message", async (req, res) => {
        const {adventure } = req.params;
        const adventurePath = path.join("game", "adventures", adventure);
        const historyPath = path.join(adventurePath, "history.adata");
        const message = req.body.message;

        let system = [
            {
                "role" : "system",
                "content" : 
                    "Aja como um mestre de RPG, seja breve responda com no máximo 1 paragrafo\n"+
                    "Como um mestre você possui alguns comandos, mas que o player não pode acessar, são eles:\n"+
                    'Algumas regras:\n'+
                    'Não crie informações, como mostrar items, equipamentos ou pertences que não tem\n'+
                    'Sempre que o jogador realizar algo decisivo peça um teste de rolagem de dados\n'
            }
        ]
    
        try {
            // verify if adventurePath exists
            if (!fs.statSync(adventurePath).isDirectory()){
                res.status(400).json({success: false, error : `Adventure ${adventure} does not exist`})
                return;
            }

            // create file
            if (!fs.statSync(historyPath).isFile()){
                fs.writeFileSync(historyPath, "role -|- content -;-\n");
            }

            if (message.role in ["user", "system", "assistant"]){
                res.status(400).json({success : false, error : "invalid message role"});
                return;
            }
            // truncate data
            
            // append data
            appendAdata(historyPath,  [message.role, message.content]);
            const data = LoadAdataJson(historyPath);
            const TruncatedData = TruncateMessages(data, 8);

            // complete with ai
            const messages = [
                ...system,
                ...TruncatedData
            ];

            const result = await app.aicompletion.AutoComplete({
                backend : "groq",
                messages : messages as Array<ChatCompletionMessageParam>
            });


            appendAdata(historyPath, [result.role, result.content]);

            res.json({message : result});
        }
        catch(error){
            res.status(400).json({success:false, error : error});
        }
    })

}

export default { Setup }
