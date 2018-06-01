import { Component, transition, ViewChild } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { RequestService } from '../../service/request.service';
import { Observable } from 'rxjs/Observable';
import { URLS } from '../../app.base.url';
import { ImageService } from 'angular2-image-upload/lib/image-upload/image.service';
import { UploadMetadata } from 'angular2-image-upload';
import { BsModalComponent } from 'ng2-bs3-modal';
import swal from 'sweetalert2'
import { CookieService } from 'angular2-cookie/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ɵPRE_STYLE } from '@angular/animations';

declare var jQuery:any;
declare var $:any;

@Component({
    selector: 'compareView',
    templateUrl: 'compare-view.template.html',
    providers: [NotificationsService, RequestService, ImageService],
    styleUrls: ['../../app.component.css'],
})

export class compareViewComponent implements OnInit {

    @ViewChild('confirmModal')
    modal: BsModalComponent;
    imagesResult = [];
    private list_result = [];
    urlImage: string;
    public options: { [name: string]: any } = {
        'X-CSRFToken': this._cookieService.get('csrftoken'),
    };
    loading = false;
    optionsNotifications = {
        position: ["top", "right"],
        timeOut: 5000,
        lastOnBottom: true
    }

    private subscription: Subscription;

    constructor(
        private notificacionService: NotificationsService,
        private requestService: RequestService,
        private _cookieService: CookieService,
        private router : Router,
    ) {}

    ngOnInit(): void {
        if(URLS.getToken() === null) {
            this.router.navigate(['login']);
        }else {
            this.urlImage = URLS.imagePostCompare;
            // console.log(this._cookieService.get('csrftoken'));
        }
    }

    private openToast(type:string, message: any) {
        switch(type) {
            case  'success':
                this.notificacionService.success(
                    'Ok',
                    message,
                    {
                        timeOut: 2000,
                        showProgressBar: true,
                        pauseOnHover: false,
                        clickToClose: true,
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

    private loadImage() {
        let input = $('[type=file]');
        if (input[0].files && input[0].files[0]) {
            let reader = new FileReader();
            reader.onload = (event:any) => {
                $('#img-load').attr('src', event.target.result);
              }
            reader.readAsDataURL(input[0].files[0]);
        } else {
            // console.log('input false');
        }
    }

    onBeforeUpload = (metadata: UploadMetadata) => {
        this.loading = true;
        metadata.abort = false;
        return metadata;
    };

    onUploadFinished = (data: any) => {
        this.loadImage();
        this.loading = false;
        let response = JSON.parse(data.serverResponse._body);
        if (response.isOk) {
            this.openToast('success', response.message);
            this.imagesResult = response.content;
            // console.log(this.imagesResult);
            let timer_request = Observable.timer(0, 10000);
            this.subscription = timer_request.subscribe(t => this.searchImages(response.id));
        }else {
            this.openToast('error', response.message);
        }
    };

    confirmation(data: any, pos: number, comparation: any) {
        swal({
            title: 'Advertencia',
            text: 'Seguro la imagen seleccionada coincide con la imagen provista ?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si '
          }).then((result) => {
            if (result.value) {
                this.saveMarca(data, comparation);
            }
          }
        )
    }

    saveMarca(data: any, comparation: any) {
        if( comparation === null ) {
            comparation = 0;
        }
        // console.log(data)
        this.loading = true;
        const form_data = new FormData();
        form_data.append('id_marca', data.propietario.id);
        form_data.append('image', $('#img-load').attr('src'));
        form_data.append('coincidencia', comparation);
        this.requestService.post('/api/compare/save/',form_data)
        .subscribe( result => {
            this.loading = false;
            if (result.isOk) {
                this.openToast('success', result.message);
            }else {
                this.openToast('error', result.message);
            }
        }, err => {
            this.loading = false;
            this.openToast('error', ' Ha ocurrido un error, intente nuevamente');
        });
    }

    searchImages(id) {
        this.loading = true;
        this.requestService.get('/api/compare/list-intermediate/'+id+'/')
        .subscribe( result => {
            console.log(result);
            if (result.isOk) {
                if(result.content.length !== 0){
                    this.list_result = result.content;
                    if (this.list_result[0].imagen_compare_intermediate !== null) {    
                        this.imagesResult = this.list_result
                        this.subscription.unsubscribe();
                        this.loading = false;
                    }
                }
            }
        })
    }

    ngOnDestroy() { 
        // this.subscription.unsubscribe();    
    }
}