import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { URLS } from '../app.base.url';
import { ResponseRequest } from '../models/response.request.models';
import { CookieService } from 'angular2-cookie/core';

@Injectable()
export class RequestService {

    private baseUrl: string;
    private options: RequestOptions;
    private header: Headers;
    private token: string;

    constructor(private http: Http, private _cookieService: CookieService) {
        this.baseUrl = URLS.debug;
        this.token = URLS.getToken();
        this.header = new Headers();
        this.header.append('Authorization', this.token);
        this.header.append('X-CSRFToken', this._cookieService.get('csrftoken'));
        this.options = new RequestOptions({ headers: this.header });
        
    }

    get(url: string): Observable<ResponseRequest> {
        return this.http.get(this.baseUrl + url, this.options)
        .map((res : Response) => <ResponseRequest> res.json())
        .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    post(url: string, data: any): Observable<ResponseRequest> {
        return this.http.post(this.baseUrl + url, data, this.options)
        .map((res : Response) => <ResponseRequest> res.json())
        .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    delete(url: string): Observable<ResponseRequest> {
        return this.http.delete(this.baseUrl + url, this.options)
        .map((res : Response) => <ResponseRequest> res.json())
        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}