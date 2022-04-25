import {
	ChangeDetectionStrategy,
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
import { FriendsService } from '../../_services/friends.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit, OnDestroy {
	@ViewChild('messageForm') messageForm: NgForm;

	public isEmojiPickerVisible: boolean;
	chatMember: Member = null;
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
	loading: boolean;

	constructor(
		private cdref: ChangeDetectorRef,
		private memberService: MembersService,
		private route: ActivatedRoute,
		public messageService: MessageService,
		public presence: PresenceService,
		private accountService: AccountService,
		public friendsService: FriendsService,
		private spinner: NgxSpinnerService
	) {
		this.accountService.currentUser$
			.pipe(take(1))
			.subscribe((x) => (this.user = x));
	}
	ngOnDestroy(): void {
		this.messageService.stopHubConnection();
	}
	ngAfterContentChecked() {
		this.cdref.detectChanges();
	}
	ngOnInit(): void {
		this.route.params.subscribe((x) => {
			let username = x.username;
			if (username) {
				this.memberService.GetUser(username).subscribe((x) => {
					this.chatMember = x;
				});
				this.messageService.createHubConnection(this.user, username);
			}
		});
	}

	typingMessage(isTyping: boolean) {
		this.messageService.typingMessage(isTyping, this.chatMember.username);
	}
	sendMessage() {
		if (this.msgFile) {
			this.messageService.sendImage(this.msgFile).subscribe((x: any) => {
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
	}
}
