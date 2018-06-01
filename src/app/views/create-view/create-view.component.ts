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
import { ResourceLoader } from '@angular/compiler';

@Component({
    selector: 'createView',
    templateUrl: 'create-view.template.html',
    providers: [NotificationsService, RequestService, ImageService],
    styleUrls: ['../../app.component.css'],
})

export class createViewComponent implements OnInit {

    private document: number;
    private type: number;
    private lista_ganadero = [];
    ganaderoStr: String;
    lista_departamentos = [];
    lista_full_departamentos = [];
    lista_municipios = [];

    @ViewChild('modalUpdate')
    modal: BsModalComponent;

    urlImage = URLS.imagePost;
    public options: { [name: string]: any } = {
        'X-CSRFToken': this._cookieService.get('csrftoken'),
    };
    loading = false;
    optionsNotifications = {
        position: ["top", "right"],
        timeOut: 5000,
        lastOnBottom: true
    }

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
            this.getDepartamentos();
        }
    }

    private getDepartamentos() {
        this.requestService.get('/departamentos/')
        .subscribe(result => {
            let data = JSON.stringify(result);
            let data_json = JSON.parse(data);
            this.lista_full_departamentos = data_json;
            for(let item in result) {
                this.lista_departamentos.push(item);
            }
        }, err => {
            console.log(err);
        });
    }

    private openToast(type:string, message: any) {
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

    loadMunicipios(event) {
        this.lista_municipios = this.lista_full_departamentos[event];
    }

    saveGanadero(form: any) {
        this.loading = true;
        this.requestService.post('/api/propietario/', form.value)
        .subscribe( result => {
            console.log(result);
            this.loading = false;
            if(result.isOk) {
                this.openToast('success', result.message);
                this.document = form.value.documento;
                this.ganaderoStr = form.value.nombre + " " 
                                + form.value.segundo_nombre + " "
                                + form.value.apellido + " "
                                + form.value.segundo_apellido;
            }else {
                this.openToast('error', result.message);
                console.log(result.message);
            }
        }, err => {
            this.loading = false;
            this.openToast('error', 'Ha ocurrido un error, por favor intente nuevamente');
        });
    }

    searchGanadero(form: any) {
        this.loading = true;
        this.requestService.get('/api/propietario/'+ form.value.documento_ganadero+ '/')
        .subscribe( result => {
            this.loading = false;
            if(result.isOk) {
                this.lista_ganadero = result.content;
                this.document = this.lista_ganadero[0].documento;
                this.ganaderoStr = this.lista_ganadero[0].nombre + " " 
                                + this.lista_ganadero[0].segundo_nombre + " "
                                + this.lista_ganadero[0].apellido + " "
                                + this.lista_ganadero[0].segundo_apellido;
            }else {
                this.loading = false;
                this.openToast('error', result.message);
            }
        }, err => {
            this.loading = false;
            this.openToast('error', 'Ha ocurrido un error, intente nuevamente');
        });
    }

    assigType(type: number) {
        this.type = type;
    }

    onBeforeUpload = (metadata: UploadMetadata) => {
        let data = { 
            documento: this.document,
            type: this.type
        };
        if (this.document) {
            metadata.formData = data;
            metadata.abort = false;
        }else {
            this.openToast('error', 'Primero registre un ganadero, antes de subir la marca');
            metadata.abort = true;
        }
        return metadata;
    };

    onUploadFinished = (data: any) => {
        let response = JSON.parse(data.serverResponse._body);
        if (response.isOk) {
            this.openToast('success', response.message);
        }else {
            this.openToast('error', response.message);
        }
    };

    onlyNumbers(event: any) {
        const pattern = /[0-9\+\$]/;
        let char = String.fromCharCode(event.charCode);
        if (!pattern.test(char))
            event.preventDefault();
    }

    onlyText(event: any) {
        const pattern = /[A-Z\a-z\+\$\ ]/;
        let char = String.fromCharCode(event.charCode);
        if (!pattern.test(char))
            event.preventDefault();
    }

    assingDocumento(documento) {
        this.document = documento;
    }
}
