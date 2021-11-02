import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
	member: Member;
	height: number = 400;
	headerShrink: boolean = false;
	@HostListener('scroll', ['$event'])
	scrollHandler(event) {
		var scrollAmount = event.target.scrollTop;
		if (scrollAmount > 400) {
			this.height = 100;
		}
		if (scrollAmount < 400) {
			this.height = 400 - scrollAmount;
			if (this.height < 100) {
				this.height = 100;
			}
		}
		// console.log(this.height);
	}
	constructor(
		private memberService: MembersService,
		private route: ActivatedRoute,
		private router: Router
	) {}

	ngOnInit(): void {
		this.loadMember();
	}

	loadMember() {
		this.memberService
			.GetUser(this.route.snapshot.paramMap.get('username'))
			.subscribe((x) => {
				this.member = x;
				// console.log(this.member);
			});
	}

	routeBack() {
		this.router.navigateByUrl('/discover');
	}
}
