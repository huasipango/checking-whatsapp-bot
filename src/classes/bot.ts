import { Client } from "../classes/client";
import { Periodico } from "../classes/periodico";

const venom = require('venom-bot');
const request = require('request');
let Parser = require('rss-parser');
const WPAPI = require( 'wpapi' );
const path = require('path');
const dbPath = path.resolve(__dirname, '../../../NodeTwitterStreamApi/database_twitter.db');
const sqlite3 = require('sqlite3').verbose();

// Imports the Google Cloud client library
const language = require('@google-cloud/language');

const client_lenguage = new language.LanguageServiceClient();

// open the database
//let db = new sqlite3.Database('../../../NodeTwitterStreamApi/database_twitter.db');


const welcome_message : string = `Hola. Soy *Checkingbot* 🤖.\n\nPara ayudarte, elige una de las siguientes opciones: \n*1.* Buscar un chequeo 🔎\n*2.* Consejos para luchar contra la desinformación 💪\n*3.* Sobre nosotros ℹ`;

const option_1 : string = `Escribe una palabra o una oración corta (en español) relacionada con el dato que quieres verificar, y te mandamos los 2 primeros resultados de nuestra base de datos.\n👀 Ejemplo: si viste rumores sobre *coronavirus*, escribe *coronavirus* o una oración corta como: *coronavirus en Ecuador*\n----------\nEscribe 0 para volver al menú principal ↩️`;

const answer_2 : string = `Consejos para luchar contra la desinformación 💡\n\nLa desinformación se lleva vidas. Revisa estos 6 consejos de chequeadores para evitar la desinformación durante la pandemia\n\nResiste el impulso de compartir. Respira.  🧘‍♂️\nRevisa cuál es la fuente de la información. ¿Hay una fuente? ¿Es confiable?  👀\nCréeles a los científicos antes que a los políticos 👩🏾‍⚕️\n¡Ten cuidado con tus emociones! Pueden nublar tu criterio 😤\nUsa herramientas como la búsqueda inversa de Google para verificar imágenes y videos 📷\nEdúcate con fuentes confiables. Tasas de infección, tasas de mortalidad... 🤓\n\n🌐 https://poy.nu/covidtips\n🌐 Cómo hacer una búsqueda inversa: https://bit.ly/2VK4KOu\n\n--\n📌Escribe un número para navegar\n0. Para volver al menú principal↩`

const answer_3 : string = `Esta iniciativa es impulsada por el Grupo de Investigación Comunicación, Poder y Ciudadanía en Red, en la ciudad de Loja, al sur de Ecuador. 🇪🇨\n\nBusca aportar en el conocimiento de los medios virtuales y potenciar las capacidades de recepción de la audiencia impulsando procesos que mejoren la interacción de estas con el contenido con el cual interactúa afín de alcanzar mayor rigurosidad en el contenido que consumen desde medios digitales.🎤\n----------\nEscribe 0 para volver al menú principal ↩️`;

const repeat_search : string = `\nEscribe para navergar\n\n0. Volver al menú principal ↩️`

const bad_option : string = `🙈Este chatbot sólo responde a números y algunas palabras claves. Vamos a ir mejorando.\n\nIntenta de nuevo con un número o letra de las opciones que te dimos\n\nO escribe 0 para volver al menú principal`;

async function quickstart(text: string) {
    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');

    // Instantiates a client
    const client = new language.LanguageServiceClient();

    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    try {
        const [result] = await client.analyzeEntities({document});    
        const entities = result.entities;     
        return entities;
    } catch (error) {
        console.error(error);
    }
}

export class Bot {
    
    private server_url : string;

    private _users : Client[] = new Array();

    private _diario_el_comercio : Periodico = new Periodico("El Comercio");
    private _diario_el_universo : Periodico = new Periodico("El Universo");
    private _diario_la_hora : Periodico = new Periodico("La Hora");
    private _diario_el_telegrafo : Periodico = new Periodico("El telégrafo");

    private _coincidencias : Periodico;

    constructor(server_url : string) {
        this.server_url = server_url;
    }    

    public init() : void{
        venom.create()
            .then((client) => this.start(client))
            .catch((erro) => {
                console.log(erro);
        });
    } 

    public redirectTo(client, message, option: number){
        switch (option) {
            case 0:
                client.sendText(message.from, welcome_message);
                break;
            case 1:
                client.sendText(message.from, option_1);
                break;
            case 2:
                client.sendLinkPreview(
                    message.from,
                    'https://poy.nu/covidtips',
                    answer_2
                );
                break;
            case 3:
                client.sendText(message.from, answer_3);
                break;
            default:
                break;
        }
    }

    public start(client) : void {
        client.onMessage((message) => {
            /*Llega cualquier mensaje
                1. Valido si el usuario ha intentado algo antes
                2. Consulto cuál fue la última opción que escogió
            */
            /*1. Valido si el usuario ha intentado algo antes*/
            if (message.isGroupMsg === false) {
                if (message.isMMS || message.isMedia || message.isForwarded || message.isPSA) {
                    client.sendText(message.from, `No aceptamos ese tipo de mensajes.❌ \nResponde con texto simple únicamente.`);
                } else {
                    if (this._users.length > 0) {
                        let existe = false;
                        for (var index in this._users) {
                            if (this._users[index].phone === message.from) {
                                existe = true;
                                let size : number = this._users[index].choose.length;
                                if (size == 0) {
                                    this._users[index].choose.push(0);
                                    this.redirectTo(client, message, 0);    
                                } else {
                                    let option : number = this._users[index].choose[size - 1];
                                    if (message.body === "0") {
                                        this.redirectTo(client, message, 0);
                                        this._users[index].choose.push(0);
                                    } else if (message.body === "1") {
                                        if (option == 0) //FORMA CORRECTA
                                        {
                                            this.redirectTo(client, message, 1);
                                            this._users[index].choose.push(1);
                                        }
                                        else{
                                            this.redirectTo(client, message, 0);
                                            this._users[index].choose.push(0);
                                        }
                                    } else if (message.body === "2") {
                                        if (option == 0) 
                                        {
                                            this.redirectTo(client, message, 2);
                                            this._users[index].choose.push(2);
                                            console.log(this._users[index].choose);
                                        }else{
                                            this.redirectTo(client, message, 0);
                                            this._users[index].choose.push(0);
                                        }
                                    } else if (message.body === "3") {
                                        if (option == 0) 
                                        {
                                            this.redirectTo(client, message, 3);
                                            this._users[index].choose.push(3);    
                                        }else{
                                            this.redirectTo(client, message, 0);
                                            this._users[index].choose.push(0);
                                        }                                
                                    } else {
                                        if (option == 1) {
                                            
                                            client.sendText(message.from, "Algunas noticias que tienen que ver 🌐");
                                            
                                            var personas = [];
                                            let db = new sqlite3.Database(dbPath);
                                            try {
                                                let entidades = quickstart(message.body).then(function(result){                                                    
                                                    /* let json2 = JSON.parse(result); */
                                                    for (const news_element of result) {
                                                        personas.push(news_element.name)
                                                    }
                                                    if (personas.length > 0) {
                                                        console.log(personas);
                                                        
                                                        let sql = "SELECT content, user_name, date_time FROM tweets WHERE content LIKE '%";
                                                        for (let index = 0; index < personas.length; index++) {                     
                                                            console.log(personas[index]);
                                                            sql = sql + `${personas[index]}%'`;
                                                            if ((index + 1) != personas.length) {
                                                                sql = sql +  " AND content LIKE '%";
                                                            }else
                                                                sql = sql + ";"
                                                        }
                                                        console.log(sql);
                                                        try {
                                                            db.each(sql, 
                                                                (error, row) => {
                                                                    var respuesta =  `📰 *Medio:* ${row.user_name}\n\n*Noticia:* ${row.content}\n*📅 Fecha:* ${row.date_time}`;
                                                                    client.sendText(message.from, respuesta);
                                                                });    
                                                        } catch (error) {
                                                            
                                                        }
                                                        
                                                    }
                                                });
                                            } catch (error) {
                                                console.log(error);
                                                
                                            }
                                            
                                            
                                            /* this._coincidencias = this.getRssCoincidences(message.body);

                                            if (this._coincidencias.title.length > 0) {
                                                this._coincidencias.title.forEach((element, i) => {
                                                    var respuesta = `*Fuente:* ${this._coincidencias.company[i]}\n\n*Título del artículo:* ${this._coincidencias.title[i]}. \n*Fecha:* ${this._coincidencias.date[i]}.\n\n🌎 ${this._coincidencias.link[i]}`; 
                                                    client.sendText(message.from, respuesta);
                                                });           
                                            }else{
                                                client.sendText(message.from, "No hemos encontrado noticias locales sobre el tema. 🔎");
                                            } */

                                            console.log("Realizando consulta en Google API:");
                                            request(
                                                `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${message.body}&key=AIzaSyBkgsZP_gMy0_ytjZE_o-LyH4XsAwLjvPU&languageCode=es-419`, (err, res, body) => {
                                                        var json = JSON.parse(body);      
                                                        try {
                                                            var length = Object.keys(json.claims).length;          
                                                        } catch (error) {
                                                            length=0;
                                                        }
                                                        if (length >0) {
                                                            client.sendText(message.from, "Verificaciones ✅");
                                                            for (let index = 0; index < 2; index++) {
                                                                var respuesta = `*${json.claims[index].claimReview[0].textualRating}:* ${json.claims[index].text}\n\nChequeado por *${json.claims[index].claimReview[0].publisher.name}*. el ${json.claims[index].claimDate}.\n\n*Respuesta:* ${json.claims[index].claimReview[0].title}\n\n🌎 ${json.claims[index].claimReview[0].url}`; 
                                                                client.sendText(message.from, respuesta);
                                                    }
                                                    client.sendText(message.from, repeat_search);    
                                                        }else{
                                                            client.sendText(message.from, 'No han habido verificaciones internacionales para tu búsqueda.\nIntenta buscando algo más.🔎');
                                                        }
                                            });
                                        } else if (option == 0) {
                                            client.sendText(message.from, bad_option);
                                        }
                                    }
                                }
                            }
                        }
                        if (existe == false) {
                            let newUser : Client = new Client(message.from);
                            newUser.choose.push(0);
                            this._users.push(newUser);
                            this.redirectTo(client, message, 0);
                        }
                        
                    } else {
                        try {
                            let newUser : Client = new Client(message.from);
                            newUser.choose.push(0);
                            this._users.push(newUser);
                            this.redirectTo(client, message, 0);
                            console.log(this._users);
                        } catch (error) {
                            console.error(error);    
                        }
                    }
                }
            }
            

            
        });
    }

    public loadRss(){
        let parser = new Parser();
        (async () => {

        let feed1 = await parser.parseURL('https://www.elcomercio.com/rss/');
        let feed2 = await parser.parseURL('https://www.eluniverso.com/rss/politica.xml');
        let feed3 = await parser.parseURL('https://www.lahora.com.ec/rss');
        let feed4 = await parser.parseURL('https://www.eltelegrafo.com.ec/contenido/categoria/1/regional-centro?format=feed');
        
        feed1.items.forEach(item => {
            this._diario_el_comercio.title.push(item.title);
            this._diario_el_comercio.date.push(item.pubDate);
            this._diario_el_comercio.link.push(item.link);
        });
        feed2.items.forEach(item => {
            this._diario_el_universo.title.push(item.title);
            this._diario_el_universo.date.push(item.pubDate);
            this._diario_el_universo.link.push(item.link);
        });
        feed3.items.forEach(item => {
            this._diario_la_hora.title.push(item.title);
            this._diario_la_hora.date.push(item.pubDate);
            this._diario_la_hora.link.push(item.link);
        });
        feed4.items.forEach(item => {
            this._diario_el_telegrafo.title.push(item.title);
            this._diario_el_telegrafo.date.push(item.pubDate);
            this._diario_el_telegrafo.link.push(item.link);
        });
        })();
    }   

    public getRssCoincidences(key : string) : Periodico{
        let coincidencias : Periodico = new Periodico("Coincidencias en diarios");
        // let busqueda_por_palabras = key.split(" ");
        // busqueda_por_palabras.forEach((item,i)=>{
        //     if(item.length < 5)
        //         busqueda_por_palabras = busqueda_por_palabras.splice(i, 1);
        // });
        // console.log(busqueda_por_palabras);
        this._diario_el_comercio.title.forEach((item, i) =>{
            if ((item.search(key) > -1) && (coincidencias.title.length < 4) ) {
                coincidencias.title.push(this._diario_el_comercio.title[i]);
                coincidencias.date.push(this._diario_el_comercio.date[i]);
                coincidencias.link.push(this._diario_el_comercio.link[i]);
                coincidencias.company.push("El Comercio");
            };
        });
        this._diario_el_universo.title.forEach((item, i) =>{
            if ((item.search(key) > -1) && (coincidencias.title.length < 4)) {
                coincidencias.title.push(this._diario_el_universo.title[i]);
                coincidencias.date.push(this._diario_el_universo.date[i]);
                coincidencias.link.push(this._diario_el_universo.link[i]);
                coincidencias.company.push("El Universo");
            } 
        });
        this._diario_la_hora.title.forEach((item, i) =>{
            if ((item.search(key) > -1) && (coincidencias.title.length < 4)) {
                coincidencias.title.push(this._diario_la_hora.title[i]);
                coincidencias.date.push(this._diario_la_hora.date[i]);
                coincidencias.link.push(this._diario_la_hora.link[i]);
                coincidencias.company.push("La Hora");
            } 
        });
        this._diario_el_telegrafo.title.forEach((item, i) =>{
            if ((item.search(key) > -1) && (coincidencias.title.length < 4)) {
                coincidencias.title.push(this._diario_el_telegrafo.title[i]);
                coincidencias.date.push(this._diario_el_telegrafo.date[i]);
                coincidencias.link.push(this._diario_el_telegrafo.link[i]);
                coincidencias.company.push("El Telégrafo");
            } 
        });
        return coincidencias;
    }
}
