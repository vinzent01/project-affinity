import App from "./app";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import {  ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

dotenv.config();

export interface completionOptions {
    backend : "groq",
    messages : Array<ChatCompletionMessageParam>
}

class AiCompletion {

    constructor(){

    }

    groq = {
        async AutoComplete(messages :  Array<ChatCompletionMessageParam>){
    
            const groq = new Groq();
    
            const chatCompletion = await groq.chat.completions.create({
                "messages": messages,
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


    async AutoComplete(options : completionOptions) : Promise<any>{

        const backend = options.backend.toLowerCase();

        console.log(options)
        try {
            if (backend == "groq"){
                return await this.groq.AutoComplete(options.messages);
            }
        }
        catch (error){
            return { error : error}
        }

        return undefined;
    }
}   

export default AiCompletion;
