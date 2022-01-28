import {
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MessageService } from '../../_services/message.service';
import { IPagination } from 'src/app/_models/pagination';
import { NgForm } from '@angular/forms';
import { PresenceService } from '../../_services/presence.service';
import { AccountService } from '../../_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';

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
	user: User;
	constructor(
		private memberService: MembersService,
		private route: ActivatedRoute,
		public messageService: MessageService,
		public presence: PresenceService,
		private accountService: AccountService
	) {
		this.accountService.currentUser$
			.pipe(take(1))
			.subscribe((x) => (this.user = x));
	}

	ngOnInit(): void {
		this.route.params.subscribe((x) => {
			let username = this.route.snapshot.paramMap.get('username');
			this.memberService.GetUser(username).subscribe((x) => {
				this.chatMember = x;
			});
			this.messageService.createHubConnection(this.user, username);
		});
	}

	loadMessages() {
		//Get latest unread messages for all users present in the paginated list ------------Add feature later
		// this.messageService
		// 	.getMessageThread(this.chatMember.username)
		// 	.subscribe((x) => {
		// 		this.messages = x;
		// 	});
	}

	// pageChanged(event: any) {
	// 	this.pageNumber = event.page;
	// 	this.loadMessages();
	// }

	sendMessage() {
		this.messageService
			.sendMessage(this.chatMember.username, this.messageContent)
			.then(() => {
				this.messageForm.reset();
			});
	}
}
