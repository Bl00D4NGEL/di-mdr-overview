import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ConfigService {
  mdrUrl = 'https://mdr.d-peters.com:2048/';
  constructor(private http: HttpClient) { }

  getMdr(): Observable<any> {
    const url = this.mdrUrl + 'mdr';
    return this.http.get(url);
  }

  getDivision(division?: string): Observable<any> {
    const url = this.mdrUrl + 'division/' + division;
    return this.http.get(url);
  }

  getHouse(house?: string): Observable<any> {
    const url = this.mdrUrl + 'house/' + house;
    return this.http.get(url);
  }

  getDivisionNames(): Observable<any> {
    const url = this.mdrUrl + 'get/divisionNames';
    return this.http.get(url);
  }

  getTagList(roles: Array<string>, divisions: Array<string>): Observable<any> {
    const url = this.mdrUrl + 'get/tagList';
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    const data = {
      roles,
      divisions
    };
    return this.http.post(url, data, {headers, responseType: 'text'});
  }
}
