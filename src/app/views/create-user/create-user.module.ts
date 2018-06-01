import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { LoadingModule } from 'ngx-loading';
import { ImageUploadModule } from "angular2-image-upload";
import { BsModalModule } from 'ng2-bs3-modal';
import { createUserComponent } from './create-user.component';

@NgModule({
    declarations: [createUserComponent],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        SimpleNotificationsModule,
        LoadingModule,
        FormsModule,
        ReactiveFormsModule,
        ImageUploadModule,
        BsModalModule
    ],
})

export class CreateUserModule {
}