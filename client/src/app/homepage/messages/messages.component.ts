import {
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MessageService } from '../../_services/message.service';
import { IPagination } from 'src/app/_models/pagination';
import { NgForm } from '@angular/forms';
import { PresenceService } from '../../_services/presence.service';
import { AccountService } from '../../_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';
import { AfterViewInit } from '@angular/core';
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit, OnDestroy {
	@ViewChild('messageForm') messageForm: NgForm;

	public isEmojiPickerVisible: boolean;

	chatMember: Member;
	messages: Message[];
	pageNumber = 1;
	pageSize = 5;
	container = 'Unread';
	pagination: IPagination;
	messageContent: string;
	user: User;
	ScrollContainer: HTMLElement;
	isImage: boolean;
	msgFile: File;
	constructor(
		private memberService: MembersService,
		private route: ActivatedRoute,
		public messageService: MessageService,
		public presence: PresenceService,
		private accountService: AccountService,
		private router: Router
	) {
		this.accountService.currentUser$
			.pipe(take(1))
			.subscribe((x) => (this.user = x));
	}
	ngOnDestroy(): void {
		this.messageService.stopHubConnection();
	}

	ngOnInit(): void {
		this.route.params.subscribe((x) => {
			let username = x.username;
			if (username) {
				this.memberService.GetUser(username).subscribe((x) => {
					this.chatMember = x;
					console.log(x);
				});
				this.messageService.createHubConnection(this.user, username);
				// this.messageService.latestMessages$.subscribe((x) => {
				// 	x.find(
				// 		(a) =>
				// 			a.senderUsername == this.chatMember.username ||
				// 			a.recipientUsername == this.chatMember.username
				// 	).dateRead = new Date(Date.now());
				// });
			}
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
	typingMessage(isTyping: boolean) {
		this.messageService.typingMessage(isTyping, this.chatMember.username);
	}
	sendMessage() {
		if (this.msgFile) {
			this.messageService.sendImage(this.msgFile).subscribe((x: any) => {
				console.log(x);
				this.messageService
					.sendMessage(
						this.chatMember.username,
						this.messageContent,
						this.isImage,
						x.url
					)
					.then(() => {
						this.isEmojiPickerVisible = false;
						this.messageForm.reset();
					});
			});
		} else {
			this.messageService
				.sendMessage(
					this.chatMember.username,
					this.messageContent,
					this.isImage,
					null
				)
				.then(() => {
					this.isEmojiPickerVisible = false;
					this.messageForm.reset();
				});
		}
	}

	addEmoji(event) {
		var emoji: Emoji;
		this.messageContent == null
			? (this.messageContent = event.emoji.native)
			: (this.messageContent += event.emoji.native);
		event.event$.stopPropagation();
	}

	onFileSelected(event) {
		const file: File = event.target.files[0];
		this.isImage = file ? true : false;
		this.msgFile = file;
		console.log(file);
	}
}
