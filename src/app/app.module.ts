import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import{FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import {DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/HomeComponent';
import { QuestionsComponent } from './questions/questions.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { UserRegistrationService } from './user-registration.service';
import { AuthGuard } from './auth.guard';
import { HighlightPipe } from './questions/highlight.pipe';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuestionsComponent,
    ThankyouComponent,
    HighlightPipe  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DragDropModule
  ],
  providers: [UserRegistrationService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
