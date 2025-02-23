import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../models/api-member.model';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private apiUrl = 'http://localhost:4222';

  constructor(private http: HttpClient) { }

  postAuth(password: string): Observable<any> {
    return this.http.post<Member[]>(`${this.apiUrl}/auth`, { "password": password });
  }

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/members`);
  }

  putAwnsers(member: Member): Observable<Member[]> {
    return this.http.put<Member[]>(`${this.apiUrl}/awnser`, member);
  }
}
