import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

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

    // Modules
    LayoutsModule,

    RouterModule.forRoot(ROUTES)
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
