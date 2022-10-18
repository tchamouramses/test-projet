import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Data } from "src/models/Data";
import { ResponseEntity } from "src/models/ResponseEntity";

@Injectable()
export class DataService {
    constructor(
        public http: HttpClient
    ) { }

    public record() {
        return this.http.get<ResponseEntity>(environment.defaultUrl + '/data');
    }

    public saveData(item: Data) {
        return this.http.post<ResponseEntity>(environment.defaultUrl + '/data', item);
    }
}