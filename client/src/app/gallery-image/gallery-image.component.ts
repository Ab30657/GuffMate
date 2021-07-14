import { Component, Input, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';

@Component({
	selector: 'app-gallery-image',
	templateUrl: './gallery-image.component.html',
	styleUrls: ['./gallery-image.component.css'],
})
export class GalleryImageComponent implements OnInit {
	cardStyle: boolean;
	zIndexReset: boolean;
	@Input() photo;
	constructor() {}

	ngOnInit(): void {
		console.log(this.photo);
	}

	enlarge() {
		this.cardStyle = !this.cardStyle;
	}
}
