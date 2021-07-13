import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';

@Component({
	selector: 'app-gallery-image',
	templateUrl: './gallery-image.component.html',
	styleUrls: ['./gallery-image.component.css'],
})
export class GalleryImageComponent implements OnInit {
	cardStyle: boolean;
	zIndexReset: boolean;
	constructor() {}

	ngOnInit(): void {}

	enlarge() {
		this.cardStyle = !this.cardStyle;
	}
}
