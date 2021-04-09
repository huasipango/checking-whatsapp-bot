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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
var client_1 = require("../classes/client");
var periodico_1 = require("../classes/periodico");
var venom = require('venom-bot');
var request = require('request');
var Parser = require('rss-parser');
var WPAPI = require('wpapi');
var path = require('path');
var dbPath = path.resolve(__dirname, '../../../NodeTwitterStreamApi/database_twitter.db');
var sqlite3 = require('sqlite3').verbose();
// Imports the Google Cloud client library
var language = require('@google-cloud/language');
var client_lenguage = new language.LanguageServiceClient();
// open the database
//let db = new sqlite3.Database('../../../NodeTwitterStreamApi/database_twitter.db');
var welcome_message = "Hola. Soy *Checkingbot* \uD83E\uDD16.\n\nPara ayudarte, elige una de las siguientes opciones: \n*1.* Buscar un chequeo \uD83D\uDD0E\n*2.* Consejos para luchar contra la desinformaci\u00F3n \uD83D\uDCAA\n*3.* Sobre nosotros \u2139";
var option_1 = "Escribe una palabra o una oraci\u00F3n corta (en espa\u00F1ol) relacionada con el dato que quieres verificar, y te mandamos los 2 primeros resultados de nuestra base de datos.\n\uD83D\uDC40 Ejemplo: si viste rumores sobre *coronavirus*, escribe *coronavirus* o una oraci\u00F3n corta como: *coronavirus en Ecuador*\n----------\nEscribe 0 para volver al men\u00FA principal \u21A9\uFE0F";
var answer_2 = "Consejos para luchar contra la desinformaci\u00F3n \uD83D\uDCA1\n\nLa desinformaci\u00F3n se lleva vidas. Revisa estos 6 consejos de chequeadores para evitar la desinformaci\u00F3n durante la pandemia\n\nResiste el impulso de compartir. Respira.  \uD83E\uDDD8\u200D\u2642\uFE0F\nRevisa cu\u00E1l es la fuente de la informaci\u00F3n. \u00BFHay una fuente? \u00BFEs confiable?  \uD83D\uDC40\nCr\u00E9eles a los cient\u00EDficos antes que a los pol\u00EDticos \uD83D\uDC69\uD83C\uDFFE\u200D\u2695\uFE0F\n\u00A1Ten cuidado con tus emociones! Pueden nublar tu criterio \uD83D\uDE24\nUsa herramientas como la b\u00FAsqueda inversa de Google para verificar im\u00E1genes y videos \uD83D\uDCF7\nEd\u00FAcate con fuentes confiables. Tasas de infecci\u00F3n, tasas de mortalidad... \uD83E\uDD13\n\n\uD83C\uDF10 https://poy.nu/covidtips\n\uD83C\uDF10 C\u00F3mo hacer una b\u00FAsqueda inversa: https://bit.ly/2VK4KOu\n\n--\n\uD83D\uDCCCEscribe un n\u00FAmero para navegar\n0. Para volver al men\u00FA principal\u21A9";
var answer_3 = "Esta iniciativa es impulsada por el Grupo de Investigaci\u00F3n Comunicaci\u00F3n, Poder y Ciudadan\u00EDa en Red, en la ciudad de Loja, al sur de Ecuador. \uD83C\uDDEA\uD83C\uDDE8\n\nBusca aportar en el conocimiento de los medios virtuales y potenciar las capacidades de recepci\u00F3n de la audiencia impulsando procesos que mejoren la interacci\u00F3n de estas con el contenido con el cual interact\u00FAa af\u00EDn de alcanzar mayor rigurosidad en el contenido que consumen desde medios digitales.\uD83C\uDFA4\n*Visita nuestro sitio web:* \uD83C\uDF10 https://chequeamosenred.com/ \n----------\nEscribe 0 para volver al men\u00FA principal \u21A9\uFE0F";
var repeat_search = "\nEscribe para navergar\n\n0. Volver al men\u00FA principal \u21A9\uFE0F";
var bad_option = "\uD83D\uDE48Este chatbot s\u00F3lo responde a n\u00FAmeros y algunas palabras claves. Vamos a ir mejorando.\n\nIntenta de nuevo con un n\u00FAmero o letra de las opciones que te dimos\n\nO escribe 0 para volver al men\u00FA principal";
function quickstart(text) {
    return __awaiter(this, void 0, void 0, function () {
        var language, client, document, result, entities, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    language = require('@google-cloud/language');
                    client = new language.LanguageServiceClient();
                    document = {
                        content: text,
                        type: 'PLAIN_TEXT',
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.analyzeEntities({ document: document })];
                case 2:
                    result = (_a.sent())[0];
                    entities = result.entities;
                    return [2 /*return*/, entities];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var Bot = /** @class */ (function () {
    function Bot(server_url) {
        this._users = new Array();
        this._diario_el_comercio = new periodico_1.Periodico("El Comercio");
        this._diario_el_universo = new periodico_1.Periodico("El Universo");
        this._diario_la_hora = new periodico_1.Periodico("La Hora");
        this._diario_el_telegrafo = new periodico_1.Periodico("El telégrafo");
        this._excluded_phones = ['593992276655@c.us', '593995105450@c.us', '593999525975@c.us', '593992517501@c.us'];
        this.chromiumArgs = [
            '--disable-web-security', '--no-sandbox', '--disable-web-security',
            '--aggressive-cache-discard', '--disable-cache', '--disable-application-cache',
            '--disable-offline-load-stale-cache', '--disk-cache-size=0',
            '--disable-background-networking', '--disable-default-apps', '--disable-extensions',
            '--disable-sync', '--disable-translate', '--hide-scrollbars', '--metrics-recording-only',
            '--mute-audio', '--no-first-run', '--safebrowsing-disable-auto-update',
            '--ignore-certificate-errors', '--ignore-ssl-errors', '--ignore-certificate-errors-spki-list'
        ];
        this.server_url = server_url;
    }
    Bot.prototype.init = function () {
        var _this = this;
        venom.create(
        //session
        'sessionName', //Pass the name of the client you want to start the bot
        //catchQR
        function (base64Qrimg, asciiQR, attempts, urlCode) {
            console.log('Number of attempts to read the qrcode: ', attempts);
            console.log('Terminal qrcode: ', asciiQR);
            console.log('base64 image string qrcode: ', base64Qrimg);
            console.log('urlCode (data-ref): ', urlCode);
        }, 
        // statusFind
        function (statusSession, session) {
            console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
            //Create session wss return "serverClose" case server for close
            console.log('Session name: ', session);
        }, 
        // options
        {
            folderNameToken: 'tokens',
            mkdirFolderToken: '',
            headless: true,
            devtools: false,
            useChrome: false,
            debug: false,
            logQR: true,
            browserWS: '',
            browserArgs: ['--disable-web-security', '--no-sandbox', '--disable-web-security',
                '--aggressive-cache-discard', '--disable-cache', '--disable-application-cache',
                '--disable-offline-load-stale-cache', '--disk-cache-size=0',
                '--disable-background-networking', '--disable-default-apps', '--disable-extensions',
                '--disable-sync', '--disable-translate', '--hide-scrollbars', '--metrics-recording-only',
                '--mute-audio', '--no-first-run', '--safebrowsing-disable-auto-update',
                '--ignore-certificate-errors', '--ignore-ssl-errors', '--ignore-certificate-errors-spki-list'],
            puppeteerOptions: {},
            disableSpins: true,
            disableWelcome: true,
            updatesLog: true,
            autoClose: 0,
            createPathFileToken: false,
        })
            .then(function (client) { return _this.start(client); })
            .catch(function (erro) {
            console.log(erro);
        });
    };
    Bot.prototype.redirectTo = function (client, message, option) {
        switch (option) {
            case 0:
                client.sendText(message.from, welcome_message);
                break;
            case 1:
                client.sendText(message.from, option_1);
                break;
            case 2:
                client.sendLinkPreview(message.from, 'https://poy.nu/covidtips', answer_2);
                break;
            case 3:
                client.sendText(message.from, answer_3);
                break;
            default:
                break;
        }
    };
    Bot.prototype.start = function (client) {
        var _this = this;
        client.onMessage(function (message) {
            /*Llega cualquier mensaje
                1. Valido si el usuario ha intentado algo antes
                2. Consulto cuál fue la última opción que escogió
            */
            /*1. Valido si el usuario ha intentado algo antes*/
            if ((message.isGroupMsg === false) && (_this._excluded_phones.indexOf(message.from) == -1)) {
                if (message.isMMS || message.isMedia || message.isForwarded || message.isPSA) {
                    client.sendText(message.from, "No aceptamos ese tipo de mensajes.\u274C \nResponde con texto simple \u00FAnicamente.");
                }
                else {
                    if (_this._users.length > 0) {
                        var existe = false;
                        var _loop_1 = function () {
                            if (_this._users[index].phone === message.from) {
                                existe = true;
                                var size = _this._users[index].choose.length;
                                if (size == 0) {
                                    _this._users[index].choose.push(0);
                                    _this.redirectTo(client, message, 0);
                                }
                                else {
                                    var option = _this._users[index].choose[size - 1];
                                    if (message.body === "0") {
                                        _this.redirectTo(client, message, 0);
                                        _this._users[index].choose.push(0);
                                    }
                                    else if (message.body === "1") {
                                        if (option == 0) //FORMA CORRECTA
                                         {
                                            _this.redirectTo(client, message, 1);
                                            _this._users[index].choose.push(1);
                                        }
                                        else {
                                            _this.redirectTo(client, message, 0);
                                            _this._users[index].choose.push(0);
                                        }
                                    }
                                    else if (message.body === "2") {
                                        if (option == 0) {
                                            _this.redirectTo(client, message, 2);
                                            _this._users[index].choose.push(2);
                                            console.log(_this._users[index].choose);
                                        }
                                        else {
                                            _this.redirectTo(client, message, 0);
                                            _this._users[index].choose.push(0);
                                        }
                                    }
                                    else if (message.body === "3") {
                                        if (option == 0) {
                                            _this.redirectTo(client, message, 3);
                                            _this._users[index].choose.push(3);
                                        }
                                        else {
                                            _this.redirectTo(client, message, 0);
                                            _this._users[index].choose.push(0);
                                        }
                                    }
                                    else {
                                        if (option == 1) {
                                            client.sendText(message.from, "Algunas noticias que tienen que ver 🌐");
                                            personas = [];
                                            var db_1 = new sqlite3.Database(dbPath);
                                            try {
                                                var entidades = quickstart(message.body).then(function (result) {
                                                    /* let json2 = JSON.parse(result); */
                                                    for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                                                        var news_element = result_1[_i];
                                                        personas.push(news_element.name);
                                                    }
                                                    if (personas.length > 0) {
                                                        console.log(personas);
                                                        var sql = "SELECT content, user_name, date_time FROM tweets WHERE content LIKE '%";
                                                        for (var index_1 = 0; index_1 < personas.length; index_1++) {
                                                            console.log(personas[index_1]);
                                                            sql = sql + (personas[index_1] + "%'");
                                                            if ((index_1 + 1) != personas.length) {
                                                                sql = sql + " AND content LIKE '%";
                                                            }
                                                            else
                                                                sql = sql + ";";
                                                        }
                                                        console.log(sql);
                                                        try {
                                                            db_1.each(sql, function (error, row) {
                                                                var respuesta = "\uD83D\uDCF0 *Medio:* " + row.user_name + "\n\n*Noticia:* " + row.content + "\n*\uD83D\uDCC5 Fecha:* " + row.date_time;
                                                                client.sendText(message.from, respuesta);
                                                            });
                                                        }
                                                        catch (error) {
                                                        }
                                                    }
                                                });
                                            }
                                            catch (error) {
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
                                            request("https://factchecktools.googleapis.com/v1alpha1/claims:search?query=" + message.body + "&key=AIzaSyBkgsZP_gMy0_ytjZE_o-LyH4XsAwLjvPU&languageCode=es-419", function (err, res, body) {
                                                var json = JSON.parse(body);
                                                try {
                                                    var length = Object.keys(json.claims).length;
                                                }
                                                catch (error) {
                                                    length = 0;
                                                }
                                                if (length > 0) {
                                                    client.sendText(message.from, "Verificaciones ✅");
                                                    for (var index_2 = 0; index_2 < 2; index_2++) {
                                                        var respuesta = "*" + json.claims[index_2].claimReview[0].textualRating + ":* " + json.claims[index_2].text + "\n\nChequeado por *" + json.claims[index_2].claimReview[0].publisher.name + "*. el " + json.claims[index_2].claimDate + ".\n\n*Respuesta:* " + json.claims[index_2].claimReview[0].title + "\n\n\uD83C\uDF0E " + json.claims[index_2].claimReview[0].url;
                                                        client.sendText(message.from, respuesta);
                                                    }
                                                    client.sendText(message.from, repeat_search);
                                                }
                                                else {
                                                    client.sendText(message.from, 'No han habido verificaciones internacionales para tu búsqueda.\nIntenta buscando algo más.🔎');
                                                }
                                            });
                                        }
                                        else if (option == 0) {
                                            client.sendText(message.from, bad_option);
                                        }
                                    }
                                }
                            }
                        };
                        var personas;
                        for (var index in _this._users) {
                            _loop_1();
                        }
                        if (existe == false) {
                            var newUser = new client_1.Client(message.from);
                            newUser.choose.push(0);
                            _this._users.push(newUser);
                            _this.redirectTo(client, message, 0);
                        }
                    }
                    else {
                        try {
                            var newUser = new client_1.Client(message.from);
                            newUser.choose.push(0);
                            _this._users.push(newUser);
                            _this.redirectTo(client, message, 0);
                            console.log(_this._users);
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                }
            }
        });
    };
    Bot.prototype.loadRss = function () {
        var _this = this;
        var parser = new Parser();
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var feed1, feed2, feed3, feed4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, parser.parseURL('https://www.elcomercio.com/rss/')];
                    case 1:
                        feed1 = _a.sent();
                        return [4 /*yield*/, parser.parseURL('https://www.eluniverso.com/rss/politica.xml')];
                    case 2:
                        feed2 = _a.sent();
                        return [4 /*yield*/, parser.parseURL('https://www.lahora.com.ec/rss')];
                    case 3:
                        feed3 = _a.sent();
                        return [4 /*yield*/, parser.parseURL('https://www.eltelegrafo.com.ec/contenido/categoria/1/regional-centro?format=feed')];
                    case 4:
                        feed4 = _a.sent();
                        feed1.items.forEach(function (item) {
                            _this._diario_el_comercio.title.push(item.title);
                            _this._diario_el_comercio.date.push(item.pubDate);
                            _this._diario_el_comercio.link.push(item.link);
                        });
                        feed2.items.forEach(function (item) {
                            _this._diario_el_universo.title.push(item.title);
                            _this._diario_el_universo.date.push(item.pubDate);
                            _this._diario_el_universo.link.push(item.link);
                        });
                        feed3.items.forEach(function (item) {
                            _this._diario_la_hora.title.push(item.title);
                            _this._diario_la_hora.date.push(item.pubDate);
                            _this._diario_la_hora.link.push(item.link);
                        });
                        feed4.items.forEach(function (item) {
                            _this._diario_el_telegrafo.title.push(item.title);
                            _this._diario_el_telegrafo.date.push(item.pubDate);
                            _this._diario_el_telegrafo.link.push(item.link);
                        });
                        return [2 /*return*/];
                }
            });
        }); })();
    };
    Bot.prototype.getRssCoincidences = function (key) {
        var _this = this;
        var coincidencias = new periodico_1.Periodico("Coincidencias en diarios");
        // let busqueda_por_palabras = key.split(" ");
        // busqueda_por_palabras.forEach((item,i)=>{
        //     if(item.length < 5)
        //         busqueda_por_palabras = busqueda_por_palabras.splice(i, 1);
        // });
        // console.log(busqueda_por_palabras);
        this._diario_el_comercio.title.forEach(function (item, i) {
            if ((item.search(key) > -1) && (coincidencias.title.length < 4)) {
                coincidencias.title.push(_this._diario_el_comercio.title[i]);
                coincidencias.date.push(_this._diario_el_comercio.date[i]);
                coincidencias.link.push(_this._diario_el_comercio.link[i]);
                coincidencias.company.push("El Comercio");
            }
            ;
        });
        this._diario_el_universo.title.forEach(function (item, i) {
            if ((item.search(key) > -1) && (coincidencias.title.length < 4)) {
                coincidencias.title.push(_this._diario_el_universo.title[i]);
                coincidencias.date.push(_this._diario_el_universo.date[i]);
                coincidencias.link.push(_this._diario_el_universo.link[i]);
                coincidencias.company.push("El Universo");
            }
        });
        this._diario_la_hora.title.forEach(function (item, i) {
            if ((item.search(key) > -1) && (coincidencias.title.length < 4)) {
                coincidencias.title.push(_this._diario_la_hora.title[i]);
                coincidencias.date.push(_this._diario_la_hora.date[i]);
                coincidencias.link.push(_this._diario_la_hora.link[i]);
                coincidencias.company.push("La Hora");
            }
        });
        this._diario_el_telegrafo.title.forEach(function (item, i) {
            if ((item.search(key) > -1) && (coincidencias.title.length < 4)) {
                coincidencias.title.push(_this._diario_el_telegrafo.title[i]);
                coincidencias.date.push(_this._diario_el_telegrafo.date[i]);
                coincidencias.link.push(_this._diario_el_telegrafo.link[i]);
                coincidencias.company.push("El Telégrafo");
            }
        });
        return coincidencias;
    };
    return Bot;
}());
exports.Bot = Bot;
