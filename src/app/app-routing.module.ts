import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import{AppComponent} from './app.component';
import { HomeComponent } from "./home/HomeComponent";
import { QuestionsComponent } from "./questions/questions.component";
import { ThankyouComponent } from './thankyou/thankyou.component';

const routes: Routes = [
  {path: '', redirectTo:'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'questions', component: QuestionsComponent},
  {path: 'thankyou', component: ThankyouComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
