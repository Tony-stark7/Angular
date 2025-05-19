import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { EmailDetailComponent } from './components/email-detail/email-detail.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'callback', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'email/:id', component: EmailDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
