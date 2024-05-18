import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  loading: any;

  constructor(
    public toastController: ToastController,
    public loadingController: LoadingController
  ) { }

  async presentToast(mensaje: string, time: number, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      position: 'top',
      color: color,
      duration: time
    });
    toast.present();
  }

  async presentToastB(mensaje: string, color: string, button: any) {
    const toast = await this.toastController.create({
      message: mensaje,
      position: 'middle',
      color: color,
      buttons: button
    });
    toast.present();
  }

  async presentLoading(mensaje: string) {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: mensaje,
    });
    await this.loading.present();
  }

  async closeLoading() {
    await this.loading.dismiss();
  }
}

