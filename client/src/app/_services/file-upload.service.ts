import { Injectable } from '@angular/core';
import { config } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class FileUploadService {
	baseUrl = environment.apiUrl;
	constructor(private http: HttpClient) {}

	UploadInit(file) {
		const formData = new FormData();
		formData.append('file', file, file.name);
		return this.http.post(this.baseUrl + 'users/add-photo/', formData);
	}
}
