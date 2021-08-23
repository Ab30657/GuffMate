import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../_models/member';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
	providedIn: 'root',
})
export class MembersService {
	baseUrl = environment.apiUrl;
	members: Member[] = [];
	paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<
		Member[]
	>();

	constructor(private http: HttpClient) {}

	GetUsers(page?: number, itemsPerPage?: number) {
		// if (this.members.length > 0) {
		// 	return of(this.members);
		// }
		let params = new HttpParams();

		if (page !== null && itemsPerPage !== null) {
			params = params.append('pageNumber', page.toString());
			params = params.append('pageSize', itemsPerPage.toString());
		}
		return this.http
			.get<Member[]>(this.baseUrl + 'users', {
				observe: 'response',
				params,
			})
			.pipe(
				map((response) => {
					this.paginatedResult.result = response.body;
					if (response.headers.get('Pagination') !== null) {
						this.paginatedResult.pagination = JSON.parse(
							response.headers.get('Pagination')
						);
					}
					return this.paginatedResult;
				})
			);
	}

	GetUser(username: string) {
		const member = this.members.find((x) => x.username === username);
		if (member !== undefined) return of(member);
		return this.http.get<Member>(this.baseUrl + 'users/' + username);
	}

	setMainPhoto(photoId: number) {
		return this.http.put(
			this.baseUrl + 'users/set-main-photo/' + photoId,
			{}
		);
	}
	deleteMainPhoto() {
		return this.http.put(this.baseUrl + 'users/remove-main-photo/', {});
	}
	update(profileCompleteForm) {
		return this.http
			.put(this.baseUrl + 'users', profileCompleteForm.value)
			.pipe(
				map(() => {
					const index = this.members.indexOf(
						profileCompleteForm.value
					);
					this.members[index] = profileCompleteForm.value;
				})
			);
	}
}
