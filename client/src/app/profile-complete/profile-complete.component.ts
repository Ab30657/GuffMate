import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-profile-complete',
	templateUrl: './profile-complete.component.html',
	styleUrls: ['./profile-complete.component.css'],
})
export class ProfileCompleteComponent implements OnInit {
	registerCompleteForm;
	genders = ['Male', 'Female', 'Others'];
	constructor(private fb: FormBuilder) {}

	private initRegisterCompleteForm() {
		this.registerCompleteForm = this.fb.group({
			gender: ['', [Validators.required]],
		});
	}

	ngOnInit(): void {
		this.initRegisterCompleteForm();
	}
	SaveChanges() {}
	changeGender(e) {}
}
