import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { GroceriesServiceProvider } from '../../providers/groceries-service/groceries-service';
import { InputDialogServiceProvider } from '../../providers/input-dialog-service/input-dialog-service';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //Title for the App
  title= "Grocery List";
  //Initialize item Arra & eroe msg string
  items = [];
  errorMessage: string;
  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public alertCtrl: AlertController, public dataService: GroceriesServiceProvider, public inputDialogService: InputDialogServiceProvider, public socialSharing: SocialSharing) {
    
    dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadItems();
    });
  }
  //Default method to load items along with Ionic contructor
  ionViewDidEnter() {
    this.loadItems();
  }

  //Method to load items in Async
  loadItems(){
    this.dataService.getItems()
      .subscribe(
        items => this.items = items,
        error => this.errorMessage = <any>error
        );
  }

  //Action for Remove items functionality - removeItem()
  removeItem(item, index){
    const toast = this.toastCtrl.create({
      message: 'Removing Item number '+ index,
      duration: 3000 }
    );
    toast.present();
    //Remove item by Provider function
    this.dataService.removeItem(item);
  }
  //Action for Share items functionality - shareItem()
  shareItem(item, index){
    const toast = this.toastCtrl.create({
      message: 'Sharing Item number '+ index,
      duration: 3000 }
    );
    toast.present();

    let message = "Grocery Item - Name: " + item.name + " - Quantity: " + item.quantity;
    let subject = "Share via Groceries app";
    this.socialSharing.share(message, subject).then(() => {
      // Sharing via email is possible
    }).catch((error) => {
      console.error("Error while Sharing: ", error);
    });

  }
  //Action for Edit items functionality - removeItem()
  editItem(item, index){
    const toast = this.toastCtrl.create({
      message: 'Editing Item number '+ index,
      duration: 2000 }
    );
    toast.present();
    //Edit item by Provider function
    this.inputDialogService.showPromt(item, index)
  }
  //Action for Add item functionality - addItem()
  addItem(){
    console.log("Adding Item");
    //Change item by Provider function
   this.inputDialogService.showPromt();
  }
  

}
