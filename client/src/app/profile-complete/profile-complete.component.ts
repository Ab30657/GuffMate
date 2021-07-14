import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
	ModalDismissReasons,
	NgbModal,
	NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { of } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { Member } from '../_models/member';
import { take } from 'rxjs/operators';
import { User } from '../_models/user';
import { MembersService } from '../_services/members.service';

@Component({
	selector: 'app-profile-complete',
	templateUrl: './profile-complete.component.html',
	styleUrls: ['./profile-complete.component.css'],
})
export class ProfileCompleteComponent implements OnInit {
	profilePicPath;
	prevImages;
	member: Member;
	user: User;
	cardStyle;
	registerCompleteForm;
	interest;
	interestList = ['S', 'Cooking', 'Soccer', 'MMA', 'Basketball'];
	closeModal;
	genders = ['Male', 'Female', 'Other'];

	imageChangedEvent;
	croppedImage;
	constructor(
		private fb: FormBuilder,
		private modalService: NgbModal,
		private accountService: AccountService,
		private memberService: MembersService
	) {
		this.accountService.currentUser$.pipe(take(1)).subscribe((x) => {
			this.user = x;
		});
	}

	private initRegisterCompleteForm() {
		this.registerCompleteForm = this.fb.group({
			gender: ['', [Validators.required]],
			status: ['', [Validators.maxLength(75)]],
			interests: [''],
		});
	}
	loadMember() {
		this.memberService.GetUser(this.user.username).subscribe((x) => {
			this.member = x;
			console.log(this.member.photos);
		});
	}
	onImageChanged(e, photoEditor) {
		this.profilePicPath = e.event;
		this.triggerModal(photoEditor);
		this.imageChangedEvent = e.event;
	}
	ngOnInit(): void {
		this.loadMember();
		this.initRegisterCompleteForm();
	}
	SaveChanges() {
		this.registerCompleteForm.controls['interests'].setValue(
			this.interestList
		);
	}
	enlarge() {
		this.cardStyle = !this.cardStyle;
	}
	addInterest() {
		this.interestList.push(this.interest);
		this.interest = '';
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
	SetOldPhoto(photo) {
		this.croppedImage = photo;
	}
	imageCropped(event: ImageCroppedEvent) {
		this.croppedImage = event.base64;
	}

	imageLoaded() {
		console.log('Hello');
	}
	cropperReady() {
		console.log('Ready');
	}
	loadImageFailed() {
		console.log('Not found');
	}
}
