import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-khus',
	templateUrl: './khus.component.html',
	styleUrls: ['./khus.component.css'],
})
export class KhusComponent implements OnInit {
	open: boolean;
	constructor(
		private accountService: AccountService,
		private router: Router
	) {
		this.accountService.currentUser$.pipe().subscribe((x) => {
			if (x.username != 'khubs') {
				this.router.navigateByUrl('/');
			}
		});
	}

	ngOnInit(): void {}
}
