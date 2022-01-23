import { Component, OnInit, ViewChild } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MessageService } from '../../_services/message.service';
import { IPagination } from 'src/app/_models/pagination';
import { NgForm } from '@angular/forms';
import { PresenceService } from '../../_services/presence.service';

@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
	@ViewChild('messageForm') messageForm: NgForm;
	chatMember: Member;
	messages: Message[];
	pageNumber = 1;
	pageSize = 5;
	container = 'Unread';
	pagination: IPagination;
	messageContent: string;
	constructor(
		private memberService: MembersService,
		private route: ActivatedRoute,
		private messageService: MessageService,
		public presence: PresenceService
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

	sendMessage() {
		this.messageService
			.sendMessage(this.chatMember.username, this.messageContent)
			.subscribe((x) => {
				this.messages.push(x);
				this.messageForm.reset();
			});
	}
}
