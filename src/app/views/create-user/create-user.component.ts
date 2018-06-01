import { Component, transition, ViewChild } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { RequestService } from '../../service/request.service';
import { Observable } from 'rxjs/Observable';
import { URLS } from '../../app.base.url';
import { ImageService } from 'angular2-image-upload/lib/image-upload/image.service';
import { UploadMetadata } from 'angular2-image-upload';
import { BsModalComponent } from 'ng2-bs3-modal';
import { COMPILER_OPTIONS } from '@angular/core/src/linker/compiler';
import { CookieService } from 'angular2-cookie/core';
import { RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';

@Component({
    selector: 'createUserView',
    templateUrl: 'create-user.template.html',
    providers: [NotificationsService, RequestService, ImageService],
    styleUrls: ['../../app.component.css'],
})
export class createUserComponent implements OnInit {

    loading: boolean;
    listaUsuarios = [];
    listaGanaderos = [];
    usuario_select: any;

    optionsNotifications = {
        position: ["top", "right"],
        timeOut: 5000,
        lastOnBottom: true
    }

    @ViewChild('modalCrearUsuario')
    modalCrear: BsModalComponent;

    @ViewChild('modalCambiarContrasena')
    modalPsw: BsModalComponent;

    constructor( 
        private notificacionService: NotificationsService,
        private requestService: RequestService,
        private _cookieService: CookieService,
        private router : Router,
    ) {
    }
    
    ngOnInit(): void {
        if(URLS.getToken() === null) {
            this.router.navigate(['login']);
        }else {
            this.getUsuarios();
            this.getGanaderos();
        }
    }

    openModalCrear(){
        this.modalCrear.open();
    }

    onSubmitUsuario(form){
        this.modalCrear.close();
        this.loading = true;
        this.requestService.post('/api/propietario/usuario/', form.value)
        .subscribe( result => {
            this.loading = false;
            // console.log(result);
            if(result.isOk) {
                this.openToast('success', result.message);
            }else {
                this.openToast('error', result.message);
            }
        }, err => {
            this.loading = false;
            this.openToast('Error', 'Ha ocurrido un error, por favor intente nuevamente');
        });
    }

    cambiarPws(usuario) {
        this.modalPsw.open();
        this.usuario_select = usuario;
    }

    onSubmitContrasena(form) {
        form.value.propietario = this.usuario_select.propietario.id
        form.value.usuario = 'None';
        this.modalPsw.close()
        this.loading = true;
        this.requestService.post('/api/propietario/usuario/', form.value)
        .subscribe( result => {
            this.loading = false;
            if(result.isOk) {
                this.openToast('success', result.message);
            }else {
                this.openToast('error', result.message);
            }
        }, err => {
            this.loading = false;
            this.openToast('Error', 'Ha ocurrido un error, por favor intente nuevamente');
        });
    }

    private getUsuarios(){
        this.loading = true;
        this.requestService.get('/api/propietario/usuario/')
        .subscribe( result => {
            // console.log(result);
            this.loading = false;
            if(result.isOk) {
                this.listaUsuarios = result.content;
            }else {
                this.openToast('Error', result.message);
            }
        }, err => {
            this.loading = false;
            this.openToast('Error', 'Ha ocurrido un error, por favor intente nuevamente');
        })
    }

    private getGanaderos(){
        this.loading = true;
        this.requestService.get('/api/propietario/')
        .subscribe( result => {
            this.loading = false;
            if(result.isOk) {
                this.listaGanaderos = result.content;
            }else {
                this.openToast('Error', result.message);
            }
        }, err => {
            this.loading = false;
            this.openToast('Error', 'Ha ocurrido un error, por favor intente nuevamente');
        })
    }

    private openToast(type:string, message: any) {
        // console.log(type);
        switch(type) {
            case  'success':
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