import { Component, Input, OnInit } from '@angular/core';
import { Guff } from 'src/app/_models/guff';
import { Member } from 'src/app/_models/member';
import { MembersService } from '../../_services/members.service';

@Component({
	selector: 'app-timeline-event',
	templateUrl: './timeline-event.component.html',
	styleUrls: ['./timeline-event.component.css'],
})
export class TimelineEventComponent implements OnInit {
	@Input() member: Member;
	@Input() post: Guff;
	commentShow: boolean = true;
	constructor(private memberService: MembersService) {}

	ngOnInit(): void {
		console.log(this.post);
	}
}
