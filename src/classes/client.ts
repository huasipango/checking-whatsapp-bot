export class Client {
    private _phone : string;
    private _choose : number[];
    
    constructor(phone : string) {
        this._phone = phone;
        this._choose = [];
    }    

    public get phone() : string {return this._phone}
    public get choose() : number[] {return this._choose}

    public set phone(v : string) {this._phone = v;}
    public set choose(v : number[]) {this._choose = v;}
}