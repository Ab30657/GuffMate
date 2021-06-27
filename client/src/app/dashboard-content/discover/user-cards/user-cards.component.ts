import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { Member } from '../../../_models/member';

@Component({
	selector: 'app-user-cards',
	templateUrl: './user-cards.component.html',
	styleUrls: ['./user-cards.component.css'],
})
export class UserCardsComponent implements OnInit {
	@Input() member: Member;
	constructor() {}

	ngOnInit(): void {}
}
