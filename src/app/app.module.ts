import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';

import { ROUTES } from "./app.routes";
import { AppComponent } from './app.component';

// App views
import { MainViewModule } from "./views/main-view/main-view.module";
import { LoginModule } from "./views/login/login.module";
import { CreateViewModule } from './views/create-view/create-view.module';

// App modules/components
import { LayoutsModule } from "./components/common/layouts/layouts.module";
import { CompareViewModule } from './views/compare-view/compare-view.module';
import { CompareListViewModule } from './views/compare-view-list/compare-view-list.module';
import { CreateUserModule } from './views/create-user/create-user.module';
import { CookieService } from 'angular2-cookie/core';
import { UsuarioModule } from './views/usuario-view/usuario-view.module';

// Firebase 
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { MessagingService } from './service/messaging.service';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    // Angular modules
    BrowserModule,
    HttpModule,

    // Views
    MainViewModule,
    LoginModule,
    CreateViewModule,
    CompareViewModule,
    CompareListViewModule,
    CreateUserModule,
    UsuarioModule,

    RouterModule.forRoot(ROUTES),

    // Modules
    LayoutsModule,

    //Firebase
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }, CookieService, MessagingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
