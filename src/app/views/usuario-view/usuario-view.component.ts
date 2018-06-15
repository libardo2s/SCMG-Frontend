import { Component, ViewChild } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { RequestService } from '../../service/request.service';
import { URLS } from '../../app.base.url';
import { ImageService } from 'angular2-image-upload/lib/image-upload/image.service';
import { UploadMetadata } from 'angular2-image-upload';
import { BsModalComponent } from 'ng2-bs3-modal';
import { CookieService } from 'angular2-cookie/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessagingService } from '../../service/messaging.service';

declare var $:any;

@Component({
    selector: 'usuarioView',
    templateUrl: 'usuario-view.template.html',
    providers: [NotificationsService, RequestService, ImageService],
    styleUrls: ['../../app.component.css'],
})


export class usuarioComponent implements OnInit {

    p: number = 1;

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

    message = [];

    private subscription: Subscription;

    constructor(
        private notificacionService: NotificationsService,
        private requestService: RequestService,
        private _cookieService: CookieService,
        private router : Router,
        private msgService: MessagingService
    ) {}

    ngOnInit(): void {
        if(URLS.getToken() === null) {
            this.router.navigate(['login']);
        }else {
            this.urlImage = URLS.imagePostCompare;
            this.msgService.getPermission()
            this.msgService.receiveMessage()
            this.msgService.currentMessage.subscribe(
                result=> {
                    if (result){
                        let data = JSON.parse(result.data.resultados);
                        this.message = data;
                        this.openToast('success', 'Proceso de comparación terminado');
                    }
                }, err => {
                    console.log(err);
                }
            );
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
        let token = URLS.getIdRegistration();
        let json_token = { 'registration_id': token};
        if (token){
            metadata.formData = json_token;
            metadata.abort = false;
        }else {
            metadata.abort = true;
        }
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
            //let timer_request = Observable.timer(0, 10000);
            //this.subscription = timer_request.subscribe(t => this.searchImages(response.id));
        }else {
            this.openToast('error', response.message);
        }
    };

    ngOnDestroy() { 
        this.msgService.deleteMessage();
    }
}