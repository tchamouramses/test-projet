import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Data } from "src/models/Data";
import { ResponseEntity } from "src/models/ResponseEntity";

@Injectable()
export class DataService {
    constructor(
        public http: HttpClient
    ) { }
    public prefix = '/data/';

    public record() {
        return this.http.get<ResponseEntity>(environment.defaultUrl + this.prefix);
    }

    public extractData(item: any) {
        const headers = new HttpHeaders();
        return this.http.post<ResponseEntity>(environment.defaultUrl + this.prefix + 'extract', item, {
            headers: headers
        });
    }

    public save(item: any) {
        const headers = new HttpHeaders();
        return this.http.post<ResponseEntity>(environment.defaultUrl + this.prefix, item, {
            headers: headers
        });
    }

    public delete(item: Data) {
        return this.http.delete<ResponseEntity>(environment.defaultUrl + this.prefix + item.id);
    }
}