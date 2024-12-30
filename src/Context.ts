import AiCompletion, {completionOptions, Message} from "./AiCompletion";
import { ChatCompletionContentPart, ChatCompletionMessageParam, ChatCompletionSystemMessageParam } from "groq-sdk/resources/chat/completions";
import fs from "fs";
import path from "path";
import { appendAdata, LoadAdataJson, TruncateHistory as TruncateMessages } from "./Data";

export default class Context{
    public aiCompletion : AiCompletion;
    public initialContext : Array<ChatCompletionSystemMessageParam>;
    
    constructor(AiCompletion : AiCompletion){
        this.aiCompletion = AiCompletion;
        this.initialContext = this.InitialContext();
    }

    public InitialContext() : Array<ChatCompletionSystemMessageParam>{

        return [{
            role : "system",
            content : 
                "Haja como se fosse um mestre de RPG de mesa em um mundo medieval\n" +
                "Seja realista com um pouco de misticismo e fantasia\n" +
                "O mundo é o mundo de DarkAges um mundo místico medieval\n" +
                "As regras são as seguintes:\n" +
                "1. Não saia do papel de mestre\n" +
                "2. No inicio é preciso criar um personagem\n"+
                "3. Peça ao player que ele guarde informações sobre seu personagem em uma ficha\n"+
                "4. seja breve mas detalhista responda somente com no maximo 1 paragráfo\n"+
                "5. Sempre que o jogador realizar uma ação decisiva peça para ele rolar dados\n"+
                "6. caso o jogador morrer o jogo acaba e será preciso criar outro personagem\n" +
                "7. Espere sempre pelo comando do jogador antes de realizar qualquer ação\n"
        }]
    }

    public async TellStory( adventurePath : string, message : Message): Promise<Message | {error : string}> {

        const historyPath = path.join(adventurePath, "history.adata");
        
        // verify if adventurePath exists
        if (!fs.statSync(adventurePath).isDirectory()){
            return {
                error : "Adventure does not exists"
            }
        }

        // create history if does not exists
        if (!fs.statSync(historyPath).isFile()){
            fs.writeFileSync(historyPath, "role -|- content -;-\n");
        }

        if (message.content == undefined)
            return {
                error : "invalid message content empty"
            };

        // append input message
        appendAdata(historyPath,  [message.role, message.content.toString()]);

        // load history
        const history = LoadAdataJson(historyPath);
        const TruncatedHistory = TruncateMessages(history, 8);

        const messages  =[
            ...this.initialContext,
            ...TruncatedHistory as Array<ChatCompletionMessageParam>,
            message
        ] as Array<Message>

        const result = await this.aiCompletion.AutoComplete(messages);

        // append result to history
        if ("role" in result && "content" in result ){
            appendAdata(historyPath, [result.role, result.content]);
        }

        return result;
    }
}
