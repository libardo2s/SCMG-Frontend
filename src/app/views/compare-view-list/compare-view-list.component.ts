import { Component, transition, ViewChild } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { RequestService } from '../../service/request.service';
import { Observable } from 'rxjs/Observable';
import { URLS } from '../../app.base.url';
import { ImageService } from 'angular2-image-upload/lib/image-upload/image.service';
import { UploadMetadata } from 'angular2-image-upload';
import { BsModalComponent } from 'ng2-bs3-modal';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

declare var jQuery:any;
declare var $:any;

@Component({
    selector: 'compareView',
    templateUrl: 'compare-view-list.template.html',
    providers: [NotificationsService, RequestService, ImageService],
    styleUrls: ['../../app.component.css'],
})

export class compareListViewComponent implements OnInit {

    title: string;
    imageToShow: string;

    @ViewChild('modalImage')
    modal: BsModalComponent;

    listImagesCompare = [];
    listCopy = [];
    loading = false;
    optionsNotifications = {
        position: ["top", "right"],
        timeOut: 5000,
        lastOnBottom: true
    }

    constructor( 
        private requestService: RequestService,
        private notificacionService: NotificationsService,
        private router : Router,
    ) {}

    ngOnInit(): void {
        if(URLS.getToken() === null) {
            this.router.navigate(['login']);
        }else {
            this.getImagesCompare();
        }
    }

    getImagesCompare() {
        this.loading = true;
        this.requestService.get('/api/compare/list/')
        .subscribe( result => {
            this.loading = false;
            if ( result.isOk) {
                this.listImagesCompare = result.content;
                this.listCopy = this.listImagesCompare;
            }else {
                this.openToast('error', result.message);
            }
            // console.log(result);
        }, err => {
            this.loading = false;
            this.openToast('error', 'Ha ocurrido un error, intente nuevamente');
        })
    }

    showImages(title: string, image: string) {
        this.imageToShow = image;
        this.title = title;
        this.modal.open();

    }

    onSearchChange(value: any){
        if (value) {
            this.listImagesCompare = this.listCopy.filter( x=> x.imagen_marca.propietario.documento === Number(value));
        }else {
            this.listImagesCompare = this.listCopy;
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
}