import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { FriendRequestComponent } from './homepage/discover/discover-left/friend-request/friend-request.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards/auth.guard';
import { DiscoverComponent } from './homepage/discover/discover.component';
import { MessagesLeftComponent } from './homepage/messages/messages-left/messages-left.component';
import { MessagesComponent } from './homepage/messages/messages.component';
import { SettingsLeftComponent } from './homepage/settings/settings-left/settings-left.component';
import { SettingsComponent } from './homepage/settings/settings.component';
import { DiscoverLeftComponent } from './homepage/discover/discover-left/discover-left.component';
import { ProfileCompleteComponent } from './profile-complete/profile-complete.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DashboardLeftComponent } from './homepage/dashboard/dashboard-left/dashboard-left.component';
import { DashboardComponent } from './homepage/dashboard/dashboard.component';
import { KhusComponent } from './_specials/khus/khus.component';

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent,
		data: { animationState: 'one' },
	},
	{
		path: 'profilecompletion',
		component: ProfileCompleteComponent,
		canActivate: [AuthGuard],
	},
	{
		path: '',
		component: HomepageComponent,
		canActivate: [AuthGuard],
		data: { animationState: 'two' },
		children: [
			{
				path: '',
				redirectTo: 'discover',
				pathMatch: 'full',
			},

			{
				path: 'discover',
				children: [
					{
						path: '',
						component: DiscoverLeftComponent,
						canActivate: [AuthGuard],
						outlet: 'left',
					},
					{
						path: '',
						component: DiscoverComponent,
						canActivate: [AuthGuard],
						outlet: 'right',
					},
				],
			},
			{
				path: 'messages/:username',
				pathMatch: 'full',
				children: [
					{
						path: '',
						component: MessagesLeftComponent,
						canActivate: [AuthGuard],
						outlet: 'left',
					},
					{
						path: '',
						component: MessagesComponent,
						canActivate: [AuthGuard],
						outlet: 'right',
					},
				],
			},

			{
				path: 'dashboard',
				children: [
					{
						path: '',
						component: DashboardLeftComponent,
						canActivate: [AuthGuard],
						outlet: 'left',
					},
					{
						path: '',
						component: DashboardComponent,
						canActivate: [AuthGuard],
						outlet: 'right',
					},
				],
			},
		],
	},
	{
		path: 'settings',
		pathMatch: 'full',
		redirectTo: 'profilecompletion',
		// children: [
		// 	{
		// 		path: '',
		// 		component: SettingsLeftComponent,
		// 		canActivate: [AuthGuard],
		// 		outlet: 'left',
		// 	},
		// 	{
		// 		path: '',
		// 		component: SettingsComponent,
		// 		canActivate: [AuthGuard],
		// 		outlet: 'right',
		// 	},
		// ],
	},
	{
		path: 'khus-specials',
		pathMatch: 'full',
		component: KhusComponent,
		canActivate: [AuthGuard],
		data: { animationState: 'one' },
	},
	{
		path: 'messages',
		pathMatch: 'full',
		redirectTo: 'messages/',
	},
	{
		path: ':username',
		pathMatch: 'full',
		component: UserProfileComponent,
		canActivate: [AuthGuard],
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
