import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
	ModalDismissReasons,
	NgbActiveModal,
	NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import {
	base64ToFile,
	ImageCroppedEvent,
	LoadedImage,
} from 'ngx-image-cropper';
import { AccountService } from '../_services/account.service';
import { Member } from '../_models/member';
import { take, finalize } from 'rxjs/operators';
import { User } from '../_models/user';
import { MembersService } from '../_services/members.service';
import { FileUploadService } from '../_services/file-upload.service';
import { Photo } from '../_models/photo';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
	selector: 'app-profile-complete',
	templateUrl: './profile-complete.component.html',
	styleUrls: ['./profile-complete.component.css'],
	providers: [NgbActiveModal],
})
export class ProfileCompleteComponent implements OnInit {
	savedImage;
	member: Member;
	user: User;
	registerCompleteForm;
	interest;
	interestList: string[];
	closeModal;
	openModal;
	genders = ['Male', 'Female', 'Other'];
	imageChangedEvent = '';
	ImageList$ = new BehaviorSubject([]);

	constructor(
		private fb: FormBuilder,
		private modalService: NgbModal,
		private accountService: AccountService,
		private memberService: MembersService,
		private fileUploadService: FileUploadService,
		private router: Router
	) {
		this.accountService.currentUser$.pipe(take(1)).subscribe((x) => {
			this.user = x;
		});
	}
	ngOnInit(): void {
		this.initRegisterCompleteForm();
		this.loadMember();
	}
	private initRegisterCompleteForm() {
		this.registerCompleteForm = this.fb.group({
			gender: ['', [Validators.required]],
			status: ['', [Validators.maxLength(75)]],
			interests: [''],
			phoneNumber: [''],
		});
	}
	loadMember() {
		this.memberService.GetUser(this.user.username).subscribe((x) => {
			console.log(x);
			this.member = x;
			this.registerCompleteForm.setValue({
				gender: this.member.gender,
				status: this.member.status,
				interests: '',
				phoneNumber: this.member.phoneNumber,
			});
			this.interestList = this.member.interests
				? this.member.interests.map((x) => x.title)
				: [];
			this.savedImage = this.member.photoUrl;
			this.ImageList$.next(
				this.member.photos.filter((x) => !x.isMain).slice(0, 8)
			);
		});
	}
	SaveChanges() {
		this.user.gender = this.registerCompleteForm.value.gender;
		this.accountService.setCurrentUser(this.user);
		console.log(this.interestList);
		this.registerCompleteForm.controls['interests'].setValue(
			this.interestList
		);
		console.log(this.interestList);
		this.memberService.update(this.registerCompleteForm).subscribe(() => {
			this.router.navigateByUrl('/discover');
		});
	}
	//Interest addition and removal
	addInterest() {
		this.interestList.push(this.interest.trim());
		this.interest = '';
	}
	removeInterest(interest) {
		this.interestList = this.interestList.filter((x) => x !== interest);
	}
	//
	// Modal Functions
	triggerModal(content) {
		this.openModal = this.modalService.open(content, {
			ariaLabelledBy: 'modal-basic-title',
		});
		this.openModal.result.then(
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
	//

	SetOldPhoto(photo: Photo) {
		this.memberService.setMainPhoto(photo.id).subscribe(() => {
			this.savedImage = photo.url;
			this.user.photoUrl = photo.url;
			this.accountService.setCurrentUser(this.user);
			this.member.photoUrl = photo.url;
			this.member.photos.forEach((x) => {
				if (x.isMain) x.isMain = false;
				if (x.id == photo.id) photo.isMain = true;
			});
			this.ImageList$.next(
				this.member.photos.filter((x) => !x.isMain).slice(0, 8)
			);
		});
	}

	//Image cropper
	onImageChanged(e, photoEditor) {
		this.imageChangedEvent = e.event;
		this.triggerModal(photoEditor);
	}
	imageCropped(event: ImageCroppedEvent) {
		this.savedImage = base64ToFile(event.base64);
	}

	imageLoaded(image: LoadedImage) {}
	cropperReady() {}
	loadImageFailed() {
		// console.log('Not found');
	}
	//

	intializeUpload() {
		this.fileUploadService
			.UploadInit(this.savedImage)
			.pipe(
				finalize(() => {
					this.openModal.close();
				})
			)
			.subscribe((photo: Photo) => {
				// console.log('here');
				this.member.photos.push(photo);
				this.memberService.setMainPhoto(photo.id).subscribe(() => {
					this.savedImage = photo.url;
					this.user.photoUrl = photo.url;
					this.accountService.setCurrentUser(this.user);
					this.member.photoUrl = photo.url;
					this.member.photos.forEach((x) => {
						if (x.isMain) x.isMain = false;
						if (x.id == photo.id) photo.isMain = true;
					});
					this.ImageList$.next(
						this.member.photos.filter((x) => !x.isMain).slice(0, 8)
					);
				});
			});
	}

	removeImage() {
		this.memberService.deleteMainPhoto().subscribe(() => {
			this.savedImage = null;
			this.user.photoUrl = null;
			this.accountService.setCurrentUser(this.user);
			this.member.photoUrl = null;
			this.member.photos.find((x) => x.isMain).isMain = false;
			this.ImageList$.next(
				this.member.photos.filter((x) => !x.isMain).slice(0, 8)
			);
		});
	}
	sendEmail() {
		this.memberService.sendEmailVerification().subscribe((x) => {
			console.log('An email has been sent!');
		});
	}

	checkEmailVerificationCode(code) {
		console.log(code);
		this.memberService.checkEmailVerification(code).subscribe((x) => {
			if (x) {
				this.member.emailConfirmed = true;
			}
		});
	}
	// sendSms() {
	// 	var num = this.registerCompleteForm.value.phoneNumber;
	// 	this.memberService.sendSmsVerification(num).subscribe((x) => {
	// 		console.log('An sms has been sent');
	// 	});
	// }

	// verifySms(code) {
	// 	this.memberService.checkSmsVerification(code).subscribe((x) => {
	// 		if (x) {
	// 			this.member.phoneNumberConfirmed = true;
	// 		}
	// 	});
	// }
	removeEmailAuth() {
		this.memberService.removeEmailAuth().subscribe((x) => {
			if (x) {
				this.member.emailConfirmed = false;
			}
		});
	}
}
