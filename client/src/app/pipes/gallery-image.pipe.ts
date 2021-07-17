import { Pipe, PipeTransform } from '@angular/core';
import { Photo } from '../_models/photo';

@Pipe({
	name: 'galleryImage',
})
export class GalleryImagePipe implements PipeTransform {
	transform(value: Photo[]): Photo[] {
		console.log(value?.filter((x) => !x.isMain));
		return value?.filter((x) => !x.isMain);
	}
}
