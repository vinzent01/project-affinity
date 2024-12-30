import App from "./App";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import {  ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

dotenv.config();

export interface completionOptions {backend : "groq"}

export interface Message {
    role : string,
    content : string
}

class AiCompletion {

    public options : completionOptions;

    constructor(options : completionOptions){
        this.options = options;
    }

    groq = {
        async AutoComplete(messages :  Array<Message>) : Promise<Message>{
    
            const groq = new Groq();
    
            const chatCompletion = await groq.chat.completions.create({
                "messages": messages as Array<ChatCompletionMessageParam>,
                "model": "llama3-8b-8192",
                "temperature": 1,
                "max_tokens": 1024,
                "top_p": 1,
                "stream": true,
                "stop": null
            });
            
            
            async function process() {    
                let result = "";
    
                for await (const chunk of chatCompletion) {
                    result += chunk.choices[0]?.delta?.content || "";
                }
    
                return result;
            };

            const result = await process();

    
            return {
                "role" : "assistant",        
                "content" : result
            };
        }
    }



    async AutoComplete(messages : Array<Message>) : Promise<Message | {error : string}>{

        const backend = this.options.backend.toLowerCase();

        try {
            if (backend == "groq"){
                return await this.groq.AutoComplete(messages);
            }
        }
        catch (error){
            return { error : error as string}
        }

        return {error : "Invalid Backend"};

    }
}   

export default AiCompletion;
