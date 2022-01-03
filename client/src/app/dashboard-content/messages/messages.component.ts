import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MessageService } from '../../_services/message.service';
import { IPagination } from 'src/app/_models/pagination';

@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
	chatMember: Member;
	messages: Message[];
	pageNumber = 1;
	pageSize = 5;
	container = 'Unread';
	pagination: IPagination;
	constructor(
		private memberService: MembersService,
		private route: ActivatedRoute,
		private messageService: MessageService
	) {}

	ngOnInit(): void {
		this.route.params.subscribe((x) => {
			let username = this.route.snapshot.paramMap.get('username');
			this.memberService.GetUser(username).subscribe((x) => {
				this.chatMember = x;
				this.loadMessages();
			});
		});
	}

	loadMessages() {
		//Get latest unread messages for all users present in the paginated list ------------Add feature later
		this.messageService
			.getMessageThread(this.chatMember.username)
			.subscribe((x) => {
				this.messages = x;
			});
	}

	pageChanged(event: any) {
		this.pageNumber = event.page;
		this.loadMessages();
	}
}
