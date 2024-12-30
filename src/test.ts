import AiCompletion from "./AiCompletion";
import Context from "./Context";

async function main() {
    const aiCompletion = new AiCompletion({
        backend : "groq"
    });

    const context = new Context(aiCompletion);

    const result = await context.TellStory("game/adventures/Adventure 01", {
        "role" : "user",
        "content" : "pego uma pedra do chão adicionando em meu inventário"
    })

    console.log(result);

}



main();


