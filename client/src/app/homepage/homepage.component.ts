import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FriendsService } from '../_services/friends.service';

@Component({
	selector: 'app-homepage',
	templateUrl: './homepage.component.html',
	styleUrls: ['./homepage.component.css'],
	host: {
		class: 'dboard',
	},
})
export class HomepageComponent implements OnInit {
	constructor(public friendsService: FriendsService) {}

	ngOnInit(): void {}
}
