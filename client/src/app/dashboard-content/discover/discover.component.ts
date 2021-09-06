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
	users: Member[];
	pagination: Pagination;
	userParams: UserParams;
	genderList = [
		{ display: 'Male', value: 'Male' },
		{ display: 'Female', value: 'Female' },
		{ display: 'All', value: 'Not Specified' },
	];

	constructor(private memberService: MembersService) {
		this.userParams = this.memberService.GetUserParams();
	}
	ngOnInit(): void {
		this.loadMembers();
	}

	loadMembers() {
		this.memberService.SetUserParams(this.userParams);
		this.memberService.GetUsers(this.userParams).subscribe((response) => {
			this.users = response.result;
			this.pagination = response.pagination;
			console.log(this.users);
		});
	}

	pageChanged(event: any) {
		this.userParams.pageNumber = event.page;
		this.memberService.SetUserParams(this.userParams);
		this.loadMembers();
	}

	resetFilters() {
		this.userParams = this.memberService.ResetUserParams();
		this.loadMembers();
	}
}
