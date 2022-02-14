import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component';
import { DiscoverComponent } from './homepage/discover/discover.component';
import { UserCardsComponent } from './homepage/discover/user-cards/user-cards.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FriendRequestComponent } from './homepage/discover/discover-left/friend-request/friend-request.component';
import { MessagesComponent } from './homepage/messages/messages.component';
import { MessagesLeftComponent } from './homepage/messages/messages-left/messages-left.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { SettingsComponent } from './homepage/settings/settings.component';
import { SettingsLeftComponent } from './homepage/settings/settings-left/settings-left.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TextInputComponent } from './_forms/text-input/text-input.component';
import { ProfileCompleteComponent } from './profile-complete/profile-complete.component';
import { DiscoverLeftComponent } from './homepage/discover/discover-left/discover-left.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GalleryImageComponent } from './gallery-image/gallery-image.component';
import { FileUploadComponent } from './_forms/file-upload/file-upload.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { GalleryImagePipe } from './pipes/gallery-image.pipe';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TimelineEventComponent } from './user-profile/timeline-event/timeline-event.component';
import { ToastrModule } from 'ngx-toastr';
import { FfbToastrComponent } from './components/ffb-toastr/ffb-toastr.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { TimeagoModule } from 'ngx-timeago';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { DashboardComponent } from './homepage/dashboard/dashboard.component';
import { DashboardLeftComponent } from './homepage/dashboard/dashboard-left/dashboard-left.component';
import { KhusComponent } from './_specials/khus/khus.component';

@NgModule({
	declarations: [
		AppComponent,
		HomepageComponent,
		NavComponent,
		LoginComponent,
		DiscoverComponent,
		UserCardsComponent,
		MessagesComponent,
		MessagesLeftComponent,
		SettingsComponent,
		SettingsLeftComponent,
		TextInputComponent,
		ProfileCompleteComponent,
		FriendRequestComponent,
		DiscoverLeftComponent,
		GalleryImageComponent,
		FileUploadComponent,
		GalleryImagePipe,
		UserProfileComponent,
		TimelineEventComponent,
		FfbToastrComponent,
		DashboardComponent,
		DashboardLeftComponent,
		KhusComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		NgxSpinnerModule,
		TabsModule,
		ImageCropperModule,
		NgbModule,
		PaginationModule.forRoot(),
		ButtonsModule.forRoot(),
		ToastrModule.forRoot({
			positionClass: 'toast-bottom-right',
			timeOut: 10000,
		}),
		PickerModule,
		TimeagoModule.forRoot(),
	],
	entryComponents: [FfbToastrComponent],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: JwtInterceptor,
			multi: true,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: LoadingInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
