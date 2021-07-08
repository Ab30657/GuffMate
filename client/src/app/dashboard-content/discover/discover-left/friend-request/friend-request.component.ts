import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-friend-request',
	templateUrl: './friend-request.component.html',
	styleUrls: ['./friend-request.component.css'],
})
export class FriendRequestComponent implements OnInit {
	isActive: boolean = false;
	constructor() {}

	ngOnInit(): void {}
	requestClick() {
		this.isActive = !this.isActive;
	}
}
