import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from '../../_models/pagination';
import { UserParams } from '../../_models/userParams';
import { AccountService } from '../../_services/account.service';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';

@Component({
	selector: 'app-discover',
	templateUrl: './discover.component.html',
	styleUrls: ['./discover.component.css'],
})
export class DiscoverComponent implements OnInit {
	user: User;
	constructor(
		private memberService: MembersService,
		private accountService: AccountService
	) {
		this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
			this.user = user;
			this.userParams = new UserParams(user);
		});
	}
	users: Member[];
	pagination: Pagination;
	userParams: UserParams;
	genderList = [
		{ display: 'Male', value: 'Male' },
		{ display: 'Female', value: 'Female' },
		{ display: 'All', value: 'Not Specified' },
	];

	ngOnInit(): void {
		this.loadMembers();
	}

	loadMembers() {
		this.memberService.GetUsers(this.userParams).subscribe((response) => {
			this.users = response.result;
			this.pagination = response.pagination;
			console.log(this.pagination);
		});
	}

	pageChanged(event: any) {
		this.userParams.pageNumber = event.page;
		this.loadMembers();
	}

	resetFilters() {
		this.userParams = new UserParams(this.user);
		this.loadMembers();
	}
}
