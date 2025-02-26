import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ResultsComponent } from './results/results.component';
import { FormComponent } from './form/form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/form', pathMatch: 'full' },
  { path: 'form', component: FormComponent },
  { path: 'results', component: ResultsComponent }
];
