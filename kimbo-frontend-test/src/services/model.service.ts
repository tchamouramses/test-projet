import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Data } from "src/models/Data";
import { ResponseEntity } from "src/models/ResponseEntity";

@Injectable()
export class ModelService {
    constructor(
        public http: HttpClient
    ) { }
    public prefix = '/model/';

    public saveData(item: any) {
        const headers = new HttpHeaders();
        return this.http.post<ResponseEntity>(environment.defaultUrl + this.prefix, item);
    }

    public records() {
        return this.http.get<ResponseEntity>(environment.defaultUrl + this.prefix);
    }

    public delete(item: any) {
        return this.http.delete<ResponseEntity>(environment.defaultUrl + this.prefix + item.id);
    }
}