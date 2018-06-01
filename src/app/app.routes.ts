import {Routes} from "@angular/router";
import {mainViewComponent} from "./views/main-view/main-view.component";
import {loginComponent} from "./views/login/login.component";
import {blankComponent} from "./components/common/layouts/blank.component";
import {basicComponent} from "./components/common/layouts/basic.component";
import { createViewComponent } from "./views/create-view/create-view.component";
import { compareViewComponent } from "./views/compare-view/compare-view.component";
import { compareListViewComponent } from "./views/compare-view-list/compare-view-list.component";
import { createUserComponent } from "./views/create-user/create-user.component";
import { usuarioComponent } from "./views/usuario-view/usuario-view.component";


export const ROUTES:Routes = [
  // Main redirect
  {path: '', redirectTo: 'login', pathMatch: 'full'},

  // App views
  {
    path: '', component: basicComponent,
    children: [
      {path: 'mainView', component: mainViewComponent},
      {path: 'createView', component: createViewComponent},
      {path: 'compareView', component: compareViewComponent},
      {path: 'compareListView', component: compareListViewComponent},
      {path: 'createUserView', component: createUserComponent},
    ]
  },
  {
    path: '', component: blankComponent,
    children: [
      { path: 'login', component: loginComponent },
      { path: 'usuario', component: usuarioComponent },
    ]
  },

  // Handle all other routes
  {path: '**',    component: mainViewComponent }
];
