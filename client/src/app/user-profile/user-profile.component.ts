import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';
import { Guff } from '../_models/guff';
import { GuffService } from '../_services/guff.service';
import { AccountService } from '../_services/account.service';
import { NgForm } from '@angular/forms';

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
	guffContent: string;
	constructor(
		private memberService: MembersService,
		private guffService: GuffService,
		private route: ActivatedRoute,
		private router: Router,
		public accountService: AccountService
	) {}

	ngOnInit(): void {
		this.loadMember();
	}

	loadMember() {
		this.memberService
			.GetUser(this.route.snapshot.paramMap.get('username'))
			.subscribe((x) => {
				this.member = x;
				this.guffService
					.getGuffs(this.member.username)
					.subscribe((x: Guff[]) => {
						this.guffs = x;
						console.log(this.guffs);
					});
			});
	}

	routeBack() {
		this.router.navigateByUrl('/discover');
	}

	goToMessages() {
		this.router.navigateByUrl('/messages/' + this.member.username);
	}
	postAGuff() {
		let guff: Guff = {
			guffContent: this.guffContent,
			id: 0,
			datePosted: new Date(),
			comments: [],
			likedUsers: [],
			shares: [],
		};
		this.guffService.createGuff(guff).subscribe();
	}
}
