import App from "./app"

const PORT = Number(process.env.PORT || 3000);

const app = new App();

app.Listen(PORT);