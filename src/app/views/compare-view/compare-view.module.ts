import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { LoadingModule } from 'ngx-loading';
import { ImageUploadModule } from "angular2-image-upload";
import { compareViewComponent } from './compare-view.component';
import { BsModalModule } from 'ng2-bs3-modal';

@NgModule({
    declarations: [compareViewComponent],
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

export class CompareViewModule {
}