import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { TimeLineEvent } from 'src/app/_models/timelineEvent';
import { MembersService } from '../../_services/members.service';

@Component({
	selector: 'app-timeline-event',
	templateUrl: './timeline-event.component.html',
	styleUrls: ['./timeline-event.component.css'],
})
export class TimelineEventComponent implements OnInit {
	@Input() member: Member;
	@Input() post: TimeLineEvent;
	constructor(private memberService: MembersService) {}

	ngOnInit(): void {}
}
