
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

export function HasApiKey(){
    
    dotenv.config();
    
    if (process.env.GROQ_API_KEY == undefined){
        return false;
    }
    else {
        return true;
    }
}

export function ConfigureAPiKey(apiKey : string){
    process.env.GROQ_API_KEY = apiKey;
    fs.writeFileSync(".env", `GROQ_API_KEY=${apiKey}`);
}