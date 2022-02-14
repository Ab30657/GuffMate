import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';
import { TimeLineEvent } from '../_models/timelineEvent';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
	member: Member;
	height: number = 400;
	headerShrink: boolean = false;
	dummyData: TimeLineEvent[] = [
		{
			Date: new Date(),
			Content:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc faucibus turpis quis tincidunt luctus. Nam sagittis dui in nunc consequat, in imperdiet nunc sagittis. ',
			Shares: 259,
			LikedUsers: 4300,
			Comments: 21,
		},
		{
			Date: new Date(-1),
			Content: 'Location: United States',
			Shares: 5,
			LikedUsers: 124,
			Comments: 9,
		},
		{
			Date: new Date('2014-02-24'),
			Content: `Quisque sed varius nisl. Nulla facilisi.
								Phasellus consequat sapien sit amet nibh
								molestie placerat. Donec nulla quam, ullamcorper
								ut velit vitae, lobortis condimentum magna.
								Suspendisse mollis in sem vel mollis.`,
			Shares: 46,
			LikedUsers: 99,
			Comments: 23,
		},
		{
			Date: new Date('2014-01-10'),
			Content: `795 Folsom Ave, Suite 600 San Francisco, CA 94107
						In hac habitasse platea dictumst. Pellentesque
						bibendum id sem nec faucibus. Maecenas molestie,
						augue vel accumsan rutrum, massa mi rutrum odio,
						id luctus mauris nibh ut leo.`,
			Shares: 26,
			LikedUsers: 49,
			Comments: 13,
		},
	];
	// @HostListener('scroll', ['$event'])
	// scrollHandler(event) {
	// 	var scrollAmount = event.target.scrollTop;
	// 	if (scrollAmount > 400) {
	// 		this.height = 100;
	// 	}
	// 	if (scrollAmount < 400) {
	// 		this.height = 400 - scrollAmount;
	// 		if (this.height < 100) {
	// 			this.height = 100;
	// 		}
	// 	}
	// 	// console.log(this.height);
	// }
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

	goToMessages() {
		this.router.navigateByUrl('/messages/' + this.member.username);
	}
}
