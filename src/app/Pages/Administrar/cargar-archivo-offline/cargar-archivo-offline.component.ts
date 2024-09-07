import { Component, OnInit } from '@angular/core';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';
import { formatDate } from '@angular/common';
import { DetalleCierre } from 'src/models/usuario.model';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-cargar-archivo-offline',
  templateUrl: './cargar-archivo-offline.component.html',
  styleUrls: ['./cargar-archivo-offline.component.scss'],
})
export class CargarArchivoOfflineComponent  implements OnInit {

  empresa: string|null = localStorage.getItem('empresaCOD');
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token');

  selectedFile: File | null = null;
  respuesta:any

  constructor(private recaudoService: RecaudoService,private loadingController: LoadingController) { }

  ngOnInit() {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async onSubmit(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Cargando Archivo...',
      spinner: 'crescent',
    });

    await loading.present();
    if (this.selectedFile && this.empresa && this.usuario && this.token) {
      this.recaudoService.postCargarArchivo(this.selectedFile, this.empresa, this.usuario, this.token).subscribe(
        async (response) => {
          this.respuesta=response
          console.log('Archivo enviado exitosamente', response);
          alertify.success(this.respuesta);
          await loading.dismiss();
        },
        async (error) => {
          console.error('Error al enviar el archivo', error);
          await loading.dismiss();
        }
      );
    } else {
      console.error('Todos los campos son requeridos');
    }
  }

}
