import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
	ModalDismissReasons,
	NgbModal,
	NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

@Component({
	selector: 'app-profile-complete',
	templateUrl: './profile-complete.component.html',
	styleUrls: ['./profile-complete.component.css'],
})
export class ProfileCompleteComponent implements OnInit {
	registerCompleteForm;
	interest;
	interestList = ['S', 'Cooking', 'Soccer', 'MMA', 'Basketball'];
	interestList$ = of(this.interestList);
	closeModal;
	genders = ['Male', 'Female', 'Other'];
	constructor(private fb: FormBuilder, private modalService: NgbModal) {}

	private initRegisterCompleteForm() {
		this.registerCompleteForm = this.fb.group({
			gender: ['', [Validators.required]],
			status: ['', [Validators.maxLength(75)]],
			interests: [''],
		});
	}

	ngOnInit(): void {
		this.initRegisterCompleteForm();
	}
	SaveChanges() {}
	addInterest() {
		this.interestList.push(this.interest);
	}
	removeInterest(interest) {
		this.interestList = this.interestList.filter((x) => x !== interest);
	}
	changeGender(e) {}

	triggerModal(content) {
		this.modalService
			.open(content, { ariaLabelledBy: 'modal-basic-title' })
			.result.then(
				(res) => {
					this.closeModal = `Closed with: ${res}`;
				},
				(res) => {
					this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
				}
			);
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}
}
