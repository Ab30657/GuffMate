import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Photo } from '../_models/photo';

@Component({
	selector: 'app-gallery-image',
	templateUrl: './gallery-image.component.html',
	styleUrls: ['./gallery-image.component.css'],
})
export class GalleryImageComponent implements OnInit {
	cardStyle: boolean;
	zIndexReset: boolean;
	@Input() photo: Photo;
	@Output() OldPhoto = new EventEmitter();
	constructor() {}

	ngOnInit(): void {}

	enlarge() {
		this.cardStyle = !this.cardStyle;
	}

	SetOldPhoto(e) {
		this.OldPhoto.emit(e);
	}
}
