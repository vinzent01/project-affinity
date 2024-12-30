import AiCompletion, { Message } from "./AiCompletion";


export class TextProcessor {

    public AiCompletion : AiCompletion;
    public rule : string;

    constructor(Aicompletion : AiCompletion, rule : string){
        this.rule = rule;
        this.AiCompletion = Aicompletion;
    }

    public async Execute(input : string) : Promise<Message | { error : string}>{

        const result =  await this.AiCompletion.AutoComplete([
            {
                role : "system",
                content : this.rule
            },
            {
                role : "user",
                content : input
            }
        ])

        return result;

    }
}