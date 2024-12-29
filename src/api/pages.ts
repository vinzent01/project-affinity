import fs from "fs";
import path from "path";
import App from "../app";


function Setup(app : App){
    app.express.get('/play/:adventure', (req, res) => {
        const template  = fs.readFileSync(path.join(app.rootPath,"public/template.html")).toString();
        const page      = fs.readFileSync(path.join(app.rootPath, "public/pages/play.html")).toString();

        const result = template.replace("{{ page }}", page);
        res.send(result);
    });

    app.express.get('/', (req, res ) => {
        const template = fs.readFileSync(path.join(app.rootPath, "public/template.html")).toString();
        const page     = fs.readFileSync(path.join(app.rootPath, "public/pages/home.html")).toString();
        
        const result = template.replace("{{ page }}", page);
        res.send(result);
    });
    
    app.express.get('/*', (req, res) => {
        const template  = fs.readFileSync(path.join(app.rootPath, "public/template.html")).toString();
        const page      = fs.readFileSync(path.join(app.rootPath, "public/pages", req.url + ".html")).toString();

        const result = template.replace("{{ page }}", page);
        res.send(result);
    })

}

export default {Setup}