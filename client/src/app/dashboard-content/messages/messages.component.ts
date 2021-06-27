import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';

@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
	constructor(private memberService: MembersService) {}

	ngOnInit(): void {}
}
