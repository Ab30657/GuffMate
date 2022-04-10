import { Component, Input, OnInit } from '@angular/core';
import { Guff } from 'src/app/_models/guff';
import { Member } from 'src/app/_models/member';
import { MembersService } from '../../_services/members.service';
import { AccountService } from '../../_services/account.service';
import { GuffService } from '../../_services/guff.service';
import { GuffComment } from 'src/app/_models/comment';

@Component({
	selector: 'app-timeline-event',
	templateUrl: './timeline-event.component.html',
	styleUrls: ['./timeline-event.component.css'],
})
export class TimelineEventComponent implements OnInit {
	@Input() member: Member;
	@Input() post: Guff;
	liked = false;
	newComment: string = '';
	commentShow: boolean = true;
	constructor(
		public accountService: AccountService,
		private guffService: GuffService
	) {}

	ngOnInit(): void {
		console.log(this.post);
		this.accountService.currentUser$.subscribe((user) => {
			this.liked = this.post.likedUsers.some(
				(x) => x.username == user.username
			);
			console.log(this.liked);
		});
	}

	deleteGuff() {
		this.guffService.deleteGuff(this.post.id).subscribe();
	}
	comment(commentForm) {
		let comment: GuffComment = {
			content: commentForm.value.Content,
			commentPosted: new Date(),
			commentUsername: '',
			commentUserPhotoUrl: '',
		};
		// console.log(comment);
		this.guffService.addComment(comment, this.post.id).subscribe();
	}
	likeGuff() {
		if (!this.liked) {
			this.guffService.addLike(this.post.id).subscribe();
		} else this.guffService.removeLike(this.post.id).subscribe();
		this.liked = !this.liked;
	}
}
