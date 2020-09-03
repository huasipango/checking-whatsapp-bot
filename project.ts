const venom = require('venom-bot');
const request = require('request')


const server = "https://localhost:44347/api/";

class Bot {

    private  welcome_message : string = `Hola. Soy *Checkingbot* 🤖.\n\nPara ayudarte, elige una de las siguientes opciones: \n*1.* Buscar un chequeo manual 🔎\n*2.* Necesito un chequeo inteligente 🤖\n*3.* Consejos para luchar contra la desinformación 💪\n*4.* Sobre nosotros ℹ`;

    private option_1 : string = `Escribe una palabra o una oración corta (en español) relacionada con el dato que quieres verificar, y te mandamos los 2 primeros resultados de nuestra base de datos.\n👀 Ejemplo: si viste rumores sobre ajo, escribe ajo o una oración corta como: ¿comer ajo cura el coronavirus?\n----------\nEscribe 0 para volver al menú principal ↩️`;
    constructor() {
        
    }

    public init() : void{
        venom.create().then((client) => this.start(client));
    }

    public guardarSolicitud(message : any){
        var datetime = new Date();
        var data : any = {
            contenido: message.body,
            fechaHora: datetime,
            solicitudId: 1
        }
        request({
            url: server + 'Solicitudes',
            rejectUnauthorized: false,
            method: "POST",
            headers : {
                "content-type": "application/json"
            },
            body: data,
            json: true
        },
        function (err, httpResponse, body) {
            console.log(err, body);
        }
        );
    }

    public start(client) : void {
        var past_option;
        client.onMessage((message) => {
            if (message.body === 'menu') {
                client.sendText(message.from, this.welcome_message);
                past_option = 'menu';
            }else if(past_option === 'menu'){
                if (message.body === '1') {
                    client.sendText(message.from, this.option_1);
                    past_option = '1';
                }else if (message.body === '2') {
                    
                }else if (message.body === '3') {
                    
                }else
                    client.sendText(message.from, this.welcome_message);
            }
            else if (past_option === '1') { //ELIJO CHEQUEO POR GOOGLE API
                this.guardarSolicitud(message);
                console.log("Realizando consulta en Google API:");
                request(
                `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${message.body}&key=AIzaSyBkgsZP_gMy0_ytjZE_o-LyH4XsAwLjvPU&languageCode=es-419`, (err, res, body) => {
                        var json = JSON.parse(body);      
                        try {
                            var length = Object.keys(json.claims).length;          
                        } catch (error) {
                            length=0;
                        }
                        
                        console.log(length);     
                        if (length >0) {
                            for (let index = 0; index < 2; index++) {
                                var respuesta = `*${json.claims[index].claimReview[0].textualRating}:* ${json.claims[index].text}
                                
        Chequeado por *${json.claims[index].claimReview[0].publisher.name}*. el ${json.claims[index].claimDate}.
                                
        *Respuesta:* ${json.claims[index].claimReview[0].title}
                                
        🌎 ${json.claims[index].claimReview[0].url}
                                `; 
                                client.sendText(message.from, respuesta);
        
                    }
                    past_option = 'menu';
                    client.sendText(message.from, this.welcome_message);    
                        }else{
                            client.sendText(message.from, 'No han habido coincidencias para tu búsqueda.\nIntenta buscando algo más.🔎');
                        }

            });
            }else if (past_option === '2') {    //ELIJO CHEQUEO AUTOMÁTICO
                console.log("Realizando chequeo automático:");
            }
        });
    }
}

class Cliente {
    private _telefono : string;
    private _eleccion : number[];
    
    constructor() {
    }    
    public get telefono() : string {return this._telefono}
    public get eleccion() : number[] {return this._eleccion}

    public set telefono(v : string) {this._telefono = v;}
    public set eleccion(v : number[]) {this._eleccion = v;}
}

class Sistema {
    constructor() {
        
    }
}

let bot = new Bot();
bot.init();