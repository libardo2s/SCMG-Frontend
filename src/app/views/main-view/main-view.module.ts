import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {mainViewComponent} from "./main-view.component";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { LoadingModule } from 'ngx-loading';
import { BsModalModule } from 'ng2-bs3-modal';
import { SearchFilterPipe } from '../../service/search.service';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module

@NgModule({
    declarations: [
        mainViewComponent,
        SearchFilterPipe
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        SimpleNotificationsModule,
        LoadingModule,
        BsModalModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
    ],
})

export class MainViewModule {}