import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';

@Component({
	selector: 'app-discover',
	templateUrl: './discover.component.html',
	styleUrls: ['./discover.component.css'],
})
export class DiscoverComponent implements OnInit {
	constructor(private memberService: MembersService) {}
	users;
	ngOnInit(): void {
		this.memberService.GetUsers().subscribe((x) => {
			this.users = x;
		});
	}
}
