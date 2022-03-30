import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  protected url: string = 'https://awovcw7p76.execute-api.us-east-1.amazonaws.com/dev/entity/v2.1/entities/';

  constructor(private readonly http: HttpClient) { }

  getEntity(id: number): Observable<any>{
    return this.http.get<any>(this.url + id);
  }

}
