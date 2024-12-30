import { ConfigureAPiKey } from "../apiKey";
import App from "../App";

function Setup(app : App){


    app.express.post("/api/set-api", (req, res) => {
        if (req.body.api == undefined){
            res.status(400).json({success : false, error : "Expecting api field"});
            return;
        }
    
        ConfigureAPiKey(req.body.api);
        res.status(200).json({success : true});
    })
}

export default {
    Setup
}