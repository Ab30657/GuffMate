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

@Component({
	selector: 'app-profile-complete',
	templateUrl: './profile-complete.component.html',
	styleUrls: ['./profile-complete.component.css'],
	providers: [NgbActiveModal],
})
export class ProfileCompleteComponent implements OnInit {
	savedImage;
	profilePicPath;
	prevImages;
	member: Member;
	user: User;
	cardStyle;
	registerCompleteForm;
	uploadLoading;
	interest;
	interestList: string[];
	closeModal;
	openModal;
	genders = ['Male', 'Female', 'Other'];
	imageChangedEvent = '';
	croppedImage;
	constructor(
		private fb: FormBuilder,
		private modalService: NgbModal,
		private accountService: AccountService,
		private memberService: MembersService,
		private fileUploadService: FileUploadService
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
			phone: [''],
		});
	}
	loadMember() {
		this.memberService.GetUser(this.user.username).subscribe((x) => {
			this.member = x;
			this.registerCompleteForm.setValue({
				gender: this.member.gender,
				status: this.member.status,
				interests: '',
				phone: this.member.phone,
			});
			this.interestList = this.member.interests
				? this.member.interests.map((x) => x.title)
				: [];
			this.croppedImage = this.member.photoUrl;
		});
	}
	onImageChanged(e, photoEditor) {
		this.profilePicPath = e.imagePath;
		this.imageChangedEvent = e.event;
		this.triggerModal(photoEditor);
	}
	ngOnInit(): void {
		this.initRegisterCompleteForm();
		this.loadMember();
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
	SetOldPhoto(photo: Photo) {
		this.memberService.setMainPhoto(photo.id).subscribe(() => {
			this.croppedImage = photo.url;
			this.user.photoUrl = photo.url;
			this.accountService.setCurrentUser(this.user);
			this.member.photoUrl = photo.url;
			this.member.photos.forEach((x) => {
				if (x.isMain) x.isMain = false;
				if (x.id == photo.id) photo.isMain = true;
			});
			console.log('Photo updated successfully');
		});
	}
	imageCropped(event: ImageCroppedEvent) {
		this.savedImage = base64ToFile(event.base64);
	}

	imageLoaded(image: LoadedImage) {}
	cropperReady() {}
	loadImageFailed() {
		console.log('Not found');
	}

	intializeUpload() {
		this.fileUploadService
			.UploadInit(this.savedImage)
			.pipe(
				finalize(() => {
					this.openModal.close();
				})
			)
			.subscribe((photo: Photo) => {
				console.log(photo);
				this.memberService.setMainPhoto(photo.id).subscribe(() => {
					this.croppedImage = photo.url;
					this.user.photoUrl = photo.url;
					this.accountService.setCurrentUser(this.user);
					this.member.photoUrl = photo.url;
					this.member.photos.forEach((x) => {
						if (x.isMain) x.isMain = false;
						if (x.id == photo.id) photo.isMain = true;
					});
					console.log('Photo updated successfully');
				});
				this.uploadLoading = true;
			});
	}
}
