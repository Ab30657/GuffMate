import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from '../../_models/pagination';

@Component({
	selector: 'app-discover',
	templateUrl: './discover.component.html',
	styleUrls: ['./discover.component.css'],
})
export class DiscoverComponent implements OnInit {
	constructor(private memberService: MembersService) {}
	users: Member[];
	pagination: Pagination;
	pageNumber = 1;
	pageSize = 5;
	ngOnInit(): void {
		this.loadMembers();
	}

	loadMembers() {
		this.memberService
			.GetUsers(this.pageNumber, this.pageSize)
			.subscribe((response) => {
				this.users = response.result;
				this.pagination = response.pagination;
				console.log(this.pagination);
			});
	}

	pageChanged(event: any) {
		this.pageNumber = event.page;
		this.loadMembers();
	}
}
