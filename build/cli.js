"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
const dotenv = require('dotenv');
const Groq = require('groq-sdk');
dotenv.config();
const groq = new Groq();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        var _d, _e;
        const chatCompletion = yield groq.chat.completions.create({
            "messages": [
                {
                    "role": "system",
                    "content": "fale como se fosse um mestre de RPG, seja breve escreva no máximo 1 paragráfo"
                },
                {
                    "role": "user",
                    "content": "Olá vamos jogar um RPG?"
                },
                {
                    "role": "system",
                    "content": "o personagem se chama Alexandre"
                },
                {
                    "role": "assistant",
                    "content": 'Excelente escolha! Bem-vindo ao nosso mundo de aventura, chamado de "Elyria". Você assume o papel de um valoroso guerreiro, com habilidades em combate e magia ao seu dispor. Sua jornada começa na cidade de Willowdale, onde rumores surgiram sobre um antigo e poderoso artefato escondido em uma cidade abandonada, rodeada de templos antigos e criaturas perigosas. Você tem três opções para abordar sua jornada: investigar o fogo queima em um local suspeito na cidade, prosseguir para a cidade abandonada em busca do artefato ou rencontrer um grupo de mercadores em busca de trabalho. Qual é sua escolha?'
                },
                {
                    "role": "user",
                    "content": "qual o nome do meu personagem?"
                }
            ],
            "model": "llama3-8b-8192",
            "temperature": 1,
            "max_tokens": 1024,
            "top_p": 1,
            "stream": true,
            "stop": null
        });
        try {
            for (var _f = true, chatCompletion_1 = __asyncValues(chatCompletion), chatCompletion_1_1; chatCompletion_1_1 = yield chatCompletion_1.next(), _a = chatCompletion_1_1.done, !_a; _f = true) {
                _c = chatCompletion_1_1.value;
                _f = false;
                const chunk = _c;
                process.stdout.write(((_e = (_d = chunk.choices[0]) === null || _d === void 0 ? void 0 : _d.delta) === null || _e === void 0 ? void 0 : _e.content) || '');
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_f && !_a && (_b = chatCompletion_1.return)) yield _b.call(chatCompletion_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
main();
