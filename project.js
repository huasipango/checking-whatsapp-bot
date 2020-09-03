var venom = require('venom-bot');
var request = require('request');
var server = "https://localhost:44347/api/";
var Bot = /** @class */ (function () {
    function Bot() {
        this.welcome_message = "Hola. Soy *Checkingbot* \uD83E\uDD16.\n\nPara ayudarte, elige una de las siguientes opciones: \n*1.* Buscar un chequeo manual \uD83D\uDD0E\n*2.* Necesito un chequeo inteligente \uD83E\uDD16\n*3.* Consejos para luchar contra la desinformaci\u00F3n \uD83D\uDCAA\n*4.* Sobre nosotros \u2139";
        this.option_1 = "Escribe una palabra o una oraci\u00F3n corta (en espa\u00F1ol) relacionada con el dato que quieres verificar, y te mandamos los 2 primeros resultados de nuestra base de datos.\n\uD83D\uDC40 Ejemplo: si viste rumores sobre ajo, escribe ajo o una oraci\u00F3n corta como: \u00BFcomer ajo cura el coronavirus?\n----------\nEscribe 0 para volver al men\u00FA principal \u21A9\uFE0F";
    }
    Bot.prototype.init = function () {
        var _this = this;
        venom.create().then(function (client) { return _this.start(client); });
    };
    Bot.prototype.guardarSolicitud = function (message) {
        var datetime = new Date();
        var data = {
            contenido: message.body,
            fechaHora: datetime,
            solicitudId: 1
        };
        request({
            url: server + 'Solicitudes',
            rejectUnauthorized: false,
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: data,
            json: true
        }, function (err, httpResponse, body) {
            console.log(err, body);
        });
    };
    Bot.prototype.start = function (client) {
        var _this = this;
        var past_option;
        client.onMessage(function (message) {
            if (message.body === 'menu') {
                client.sendText(message.from, _this.welcome_message);
                past_option = 'menu';
            }
            else if (past_option === 'menu') {
                if (message.body === '1') {
                    client.sendText(message.from, _this.option_1);
                    past_option = '1';
                }
                else if (message.body === '2') {
                }
                else if (message.body === '3') {
                }
                else
                    client.sendText(message.from, _this.welcome_message);
            }
            else if (past_option === '1') { //ELIJO CHEQUEO POR GOOGLE API
                _this.guardarSolicitud(message);
                console.log("Realizando consulta en Google API:");
                request("https://factchecktools.googleapis.com/v1alpha1/claims:search?query=" + message.body + "&key=AIzaSyBkgsZP_gMy0_ytjZE_o-LyH4XsAwLjvPU&languageCode=es-419", function (err, res, body) {
                    var json = JSON.parse(body);
                    try {
                        var length = Object.keys(json.claims).length;
                    }
                    catch (error) {
                        length = 0;
                    }
                    console.log(length);
                    if (length > 0) {
                        for (var index = 0; index < 2; index++) {
                            var respuesta = "*" + json.claims[index].claimReview[0].textualRating + ":* " + json.claims[index].text + "\n                                \n        Chequeado por *" + json.claims[index].claimReview[0].publisher.name + "*. el " + json.claims[index].claimDate + ".\n                                \n        *Respuesta:* " + json.claims[index].claimReview[0].title + "\n                                \n        \uD83C\uDF0E " + json.claims[index].claimReview[0].url + "\n                                ";
                            client.sendText(message.from, respuesta);
                        }
                        past_option = 'menu';
                        client.sendText(message.from, _this.welcome_message);
                    }
                    else {
                        client.sendText(message.from, 'No han habido coincidencias para tu búsqueda.\nIntenta buscando algo más.🔎');
                    }
                });
            }
            else if (past_option === '2') { //ELIJO CHEQUEO AUTOMÁTICO
                console.log("Realizando chequeo automático:");
            }
        });
    };
    return Bot;
}());
var Cliente = /** @class */ (function () {
    function Cliente() {
    }
    Object.defineProperty(Cliente.prototype, "telefono", {
        get: function () { return this._telefono; },
        set: function (v) { this._telefono = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cliente.prototype, "eleccion", {
        get: function () { return this._eleccion; },
        set: function (v) { this._eleccion = v; },
        enumerable: false,
        configurable: true
    });
    return Cliente;
}());
var Sistema = /** @class */ (function () {
    function Sistema() {
    }
    return Sistema;
}());
var bot = new Bot();
bot.init();
