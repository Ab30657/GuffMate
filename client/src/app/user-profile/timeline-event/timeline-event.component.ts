import { Component, Input, OnInit } from '@angular/core';
import { Guff } from 'src/app/_models/guff';
import { Member } from 'src/app/_models/member';
import { MembersService } from '../../_services/members.service';
import { AccountService } from '../../_services/account.service';
import { GuffService } from '../../_services/guff.service';
import { GuffComment } from 'src/app/_models/comment';
import { take } from 'rxjs/operators';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
	selector: 'app-timeline-event',
	templateUrl: './timeline-event.component.html',
	styleUrls: ['./timeline-event.component.css'],
})
export class TimelineEventComponent implements OnInit {
	@Input() member: Member;
	@Input() guff: Guff;
	liked = false;
	newComment: string = '';
	commentShow: boolean = true;
	closeModal;
	openModal;
	constructor(
		public accountService: AccountService,
		private guffService: GuffService,
		private modalService: NgbModal,
		private router: Router
	) {}

	ngOnInit(): void {
		this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
			this.liked = this.guff.likedUsers.some(
				(x) => x.username == user.username
			);
		});
	}

	deleteGuff() {
		this.guffService.deleteGuff(this.guff.id);
	}
	comment(commentForm) {
		if (commentForm.valid)
			this.guffService
				.createComment({
					Content: commentForm.value.Content,
					GuffId: this.guff.id,
				})
				.finally(() => {
					commentForm.resetForm();
				});
	}
	likeGuff() {
		if (!this.liked) {
			this.guffService.likeGuff(this.guff.id);
		} else this.guffService.unlikeGuff(this.guff.id);
		this.liked = !this.liked;
	}

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
	routeToUser(username) {
		if (username) {
			this.router.navigate(['../', username]);
		}
	}
}
