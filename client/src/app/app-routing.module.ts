import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
	{ path: '', component: DashboardContentComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'home', component: DashboardContentComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
