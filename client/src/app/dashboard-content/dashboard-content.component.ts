import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-dashboard-content',
	templateUrl: './dashboard-content.component.html',
	styleUrls: ['./dashboard-content.component.css'],
	host: {
		class: 'dboard',
	},
})
export class DashboardContentComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
