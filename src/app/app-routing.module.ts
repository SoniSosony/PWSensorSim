import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TheoryComponent } from '../app/components/theory/theory.component';
import { TitrationComponent } from './components/titration/titration.component';
import { EfphMainComponent } from './components/efph-main/efph-main.component';

const routes: Routes = [
  {path: "theory", component: TheoryComponent},

  {path: 'efphUsual', redirectTo: '/efphMain', pathMatch : 'full'},
  {path: 'efphBuffer', redirectTo: '/efphMain', pathMatch : 'full'},
  {path: 'eft', redirectTo: '/efphMain', pathMatch : 'full'},
  {path: 'efphMain', component : EfphMainComponent},

  {path: 'titrationAcid', redirectTo: '/titration', pathMatch : 'full'},
  {path: 'titrationAlkali', redirectTo: '/titration', pathMatch : 'full'},
  {path: "titration", component: TitrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
