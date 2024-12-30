import AiCompletion from "./AiCompletion";
import Context from "./Context";

async function main() {
    const aiCompletion = new AiCompletion({
        backend : "groq"
    });

    const context = new Context(aiCompletion);

    const result = await context.TellStory("game/adventures/nova aventura", {
        "role" : "user",
        "content" : "Olá quem é você?"
    })

    console.log(result);

}



main();


