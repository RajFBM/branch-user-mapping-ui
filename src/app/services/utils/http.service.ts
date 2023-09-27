import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CommonHttpService {
    constructor(private readonly http: HttpClient) {
    }

    public sendGetRequest<T>(path: string): Observable<T> {
        return this.http.get<T>(path, { headers: this.getHeaders() });
    }

    public sendPostRequest<T>(path: string, data: any): Observable<T> {
        return this.http.post<T>(path, data, { headers: this.getHeaders().set('Content-Type', 'application/json') });
    }

    public sendPutRequest<T>(path: string, data: any): Observable<T> {
        //alert('sendPutRequest');
        const res= this.http.put<T>(path, data, { headers: this.getHeaders().set('Content-Type', 'application/json')});
        return res;
    }

    public sendDeleteRequest<T>(path: string, data?:any):Observable<T> {
        return this.http.delete<T>(path, { headers: {} });
    }

    // public sendTreeGetRequest<T>(path: string): Observable<T> {
    //     return this.http.GetAll<T>(path, { headers: this.getHeaders() });
    // }
    
    public  getHeaders(): HttpHeaders{
        return new HttpHeaders({
            'Access-Control-Allow-Origin' : '*',
            //'Content-Type': 'application/json; charset=utf-8'
        })//.set('Content-Type', 'application/json; charset=utf-8')
    }

}