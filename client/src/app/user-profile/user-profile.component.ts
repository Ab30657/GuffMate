import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';
import { Guff } from '../_models/guff';
import { GuffService } from '../_services/guff.service';
import { AccountService } from '../_services/account.service';
import { NgForm } from '@angular/forms';
import { User } from '../_models/user';
import { take, map } from 'rxjs/operators';
import { FriendsParams } from '../_models/friendsParams';
import { FriendsService } from '../_services/friends.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
	member: Member;
	height: number = 400;
	headerShrink: boolean = false;
	guffs: Guff[];
	Content: string;
	user: User;
	isFriend: boolean;
	constructor(
		private memberService: MembersService,
		public guffService: GuffService,
		private route: ActivatedRoute,
		private router: Router,
		public accountService: AccountService,
		public friendsService: FriendsService
	) {
		this.accountService.currentUser$
			.pipe(take(1))
			.subscribe((x) => (this.user = x));
	}

	ngOnInit(): void {
		this.loadMember();
	}

	loadMember() {
		this.memberService
			.GetUser(this.route.snapshot.paramMap.get('username'))
			.subscribe(
				(x) => {
					this.member = x;
					this.guffService.createHubConnection(
						this.user,
						this.member.username
					);
					console.log(this.member);
				},
				(error) => {
					this.router.navigate(['not-found']);
				}
			);
	}

	routeBack() {
		this.router.navigateByUrl('/discover');
	}

	goToMessages() {
		this.router.navigateByUrl('/messages/' + this.member.username);
	}
	postAGuff() {
		this.guffService.createGuff({ Content: this.Content }).finally(() => {
			this.Content = '';
		});
	}
	validateFriend(username) {
		this.friendsService.friends$.pipe(
			map((x) => {
				if (x && x.some((q) => q.username == username))
					this.isFriend = true;
				this.isFriend == false;
			})
		);
	}
}
