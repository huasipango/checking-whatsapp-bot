export class Periodico {
    private _name : string;
    private _title : string[];
    private _company : string[];
    private _date : string[];
    private _link : string[];
    
    constructor(name : string) {
        this._name = name;
        this._title = [];
        this._company = [];
        this._date = [];
        this._link = [];
    }    

    public get name() : string {return this._name}
    public get title() : string[] {return this._title}
    public get company() : string[] {return this._company}
    public get date() : string[] {return this._date}
    public get link() : string[] {return this._link}

    public set name(v : string) {this._name = v;}
    public set title(v : string[]) {this._title = v;}
    public set company(v : string[]) {this._company = v;}
    public set date(v : string[]) {this._date = v;}
    public set link(v : string[]) {this._link = v;}
}