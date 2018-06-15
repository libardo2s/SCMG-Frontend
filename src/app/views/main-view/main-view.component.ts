import { Component, transition, ViewChild } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { RequestService } from '../../service/request.service';
import { BsModalComponent } from 'ng2-bs3-modal';
import {FormGroup,FormBuilder,FormControl, Validators} from '@angular/forms';
import { URLS } from '../../app.base.url';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
    selector: 'mianView',
    templateUrl: 'main-view.template.html',
    providers: [NotificationsService, RequestService]
})

export class mainViewComponent implements OnInit {  

    @ViewChild('modalDatos')
    modal: BsModalComponent;

    @ViewChild('modalUpdate')
    modalUpdate: BsModalComponent;


    p: number = 1;
    loading = false;
    options = {
        position: ["top", "right"],
        timeOut: 5000,
        lastOnBottom: true
    }

    listGanaderos = [];
    listImages = [];
    image: any;

    lista_departamentos = [];
    lista_full_departamentos = [];
    lista_municipios = [];

    formUpdate : FormGroup;
    modelUpdate: any;

    constructor(
        private notificacionService: NotificationsService,
        private requestService: RequestService,
        private router : Router,
        fb: FormBuilder,
    ) {
        this.formUpdate= fb.group({
            'id' : ['', [Validators.required] ],
            'documento' : ['', [Validators.required] ],
            'nombre' : ['', [Validators.required] ],
            'segundo_nombre' : ['',],
            'apellido' : ['', [Validators.required] ],
            'segundo_apellido' : ['', [Validators.required] ],
            'finca' : ['', [Validators.required] ],
            'telefono' : ['', [Validators.required] ],
            'direccion' : ['', [Validators.required] ],
            'ciudad' : ['', [Validators.required] ],
            'departamento' : ['', [Validators.required] ],
        });
    }

    ngOnInit(): void {
        if(URLS.getToken() === null) {
            this.router.navigate(['login']);
        }else {
            this.getGanaderos();
            this.getDepartamentos();
        }
    }

    openEdit(ganadero: any){
        this.getImageMarca(ganadero.documento);
    }

    updateGanadero(data: any) {
        this.modalUpdate.open()
        this.formUpdate.controls['id'].setValue(data.id);
        this.formUpdate.controls['documento'].setValue(data.documento);
        this.formUpdate.controls['nombre'].setValue(data.nombre);
        this.formUpdate.controls['segundo_nombre'].setValue(data.segundo_nombre);
        this.formUpdate.controls['apellido'].setValue(data.apellido);
        this.formUpdate.controls['segundo_apellido'].setValue(data.segundo_apellido);
        this.formUpdate.controls['telefono'].setValue(data.telefono);
        this.formUpdate.controls['direccion'].setValue(data.direccion);
        this.formUpdate.controls['finca'].setValue(data.finca);
        this.formUpdate.controls['departamento'].setValue(data.region);
        this.lista_municipios = this.lista_full_departamentos[data.region];
        this.formUpdate.controls['ciudad'].setValue(data.ciudad);
    }

    updateGan(formUpdate) {
        this.modalUpdate.close();
        this.loading = true;
        this.requestService.post('/api/propietario/update/', formUpdate.value)
        .subscribe ( result => {
            this.loading = false;
            console.log(result);
            if (result.isOk) {
                this.openToast('suscess', result.message)
                this.listGanaderos = result.content;
            }else {
                this.openToast('error', result.message);
            }
        }, err => {
            console.log(err);
            this.openToast('error', 'Ha ocurrido un error, intente nuevamente');
        })
    }

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
    
    loadMunicipios(event) {
        this.lista_municipios = this.lista_full_departamentos[event];
    }

    openDelete(document: Number){
        swal({
            title: 'Eliminar ganadero ?',
            text: "Seguro desea eliminar al gandero identificado con el documento " + document + "?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#337ab7',
            cancelButtonColor: '#ed5565',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) {
                this.requestService.delete('/api/propietario/delete/'+document+'/')
                .subscribe( result=> {
                    if (result.isOk){
                        this.openToast('suscess',result.message);
                        let index = this.listGanaderos.findIndex(x=>x.documento===document);
                        this.listGanaderos.splice(index,1);
                    }else {
                        this.openToast('error',result.message);
                    }
                },err => {
                    this.openToast('error', 'Ha ocurrido un error, intente nuevamnete');
                })
            }
        })
    }

    private openToast(type:string, message: any) {
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

    private getGanaderos(){
        this.loading = true;
        this.requestService.get('/api/propietario/')
        .subscribe( result => {
            this.loading = false;
            if(result.isOk) {
                this.listGanaderos = result.content;
            }else {
                this.openToast('Error', result.message);
            }
        }, err => {
            this.loading = false;
            this.openToast('Error', 'Ha ocurrido un error, por favor intente nuevamente');
        })
    }

    private getImageMarca(id: string) {
        this.loading = true;
        this.requestService.get('/api/marca/' + id + '/')
        .subscribe(result => {
            // console.log(result);
            this.loading = false;
            if(result.isOk) {
                this.listImages = result.content
                this.modal.open();
            }else {
                this.openToast('error', result.message);
            }
        }, err => {
            this.loading = false;
            this.openToast('error', 'Ha ocurrido un error, por favor intente nuevamente');
        })
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
}