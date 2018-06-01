import { Component } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { RequestService } from '../../service/request.service';
import { Router } from '@angular/router';
import { URLS } from '../../app.base.url';


@Component({
    selector: 'login',
    templateUrl: 'login.template.html',
    providers: [NotificationsService, RequestService]
})
export class loginComponent {

    loading = false;
    options = {
        position: ["top", "right"],
        timeOut: 5000,
        lastOnBottom: true
    }

    constructor( 
        private notificacionService: NotificationsService,
        private requestService: RequestService,
        private router : Router
    ) {}

    login(form: any) {
        this.loading = true;
        this.requestService.post('/api/login/', form.value)
        .subscribe( result => {
            this.loading = false;
            if (result.isOk) {
                let tokenResponse = JSON.stringify(result.content);
                let token = JSON.parse(tokenResponse);
                URLS.setToken(token[0].token);
                if (token[0].tipo === "0"){
                    this.router.navigate(['mainView']);
                }else {
                    this.router.navigate(['usuario']);
                }
            }else {
                this.openToast('error', result.message);
            }
        }, err => {
            this.loading = false;
            this.openToast('error', 'Ha ocurrido un error, intente nuevamente');
        })
    }

    openToast(type:string, message: any) {
        switch(type) {
            case  'suscess':
                this.notificacionService.success(
                    'Ok',
                    message,
                    {
                        timeOut: 5000,
                        showProgressBar: true,
                        pauseOnHover: false,
                        clickToClose: false,
                        maxLength: 10
                    }
                )
            break;
            case 'error':
                this.notificacionService.error(
                    'Ups !!!',
                    message,
                    {
                        timeOut: 5000,
                        showProgressBar: true,
                        pauseOnHover: false,
                        clickToClose: false,
                        maxLength: 10
                    }
                )
            break;
        }
    }
 }