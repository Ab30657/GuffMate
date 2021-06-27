import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../_models/member';

@Injectable({
	providedIn: 'root',
})
export class MembersService {
	baseUrl = environment.apiUrl;
	constructor(private http: HttpClient) {}

	GetUsers() {
		return this.http.get<Member[]>(this.baseUrl + 'users');
	}

	GetUser(username: string) {
		return this.http.get<Member>(this.baseUrl + 'users/' + username);
	}
}
