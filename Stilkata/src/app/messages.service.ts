import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private messagesUrl: string = 'http://wd.etsisi.upm.es:10000/messages';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getMessages(): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });

    return this.http.get(this.messagesUrl, { headers });
  }

  deleteMessages(username: string): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });

    return this.http.delete(`${this.messagesUrl}/${username}`, { headers });
  }
}
