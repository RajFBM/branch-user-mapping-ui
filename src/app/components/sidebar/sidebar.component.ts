// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-sidebar',
//   templateUrl: './sidebar.component.html',
//   styleUrls: ['./sidebar.component.css']
// })
// export class SidebarComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }


import { Component, OnInit } from '@angular/core';
// import { Userdata } from 'app/model/userdata';
// import { ModelServiceService } from 'app/services/ModelService.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    id : number;
    isDisable : boolean;
    isVisible : boolean;
}
export const ROUTES: RouteInfo[] = [
    { path: '/home', title: 'HOME',  icon: 'home', class: '', id : 1, isDisable : false, isVisible : true },
   // { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
    { path: '/input-form', title: 'INPUT FORM',  icon:'content_paste', class: '', id : 2, isDisable : false, isVisible : true },
    { path: '/payroll-download', title: 'PAYROLL DOWNLOAD',  icon:'payment', class: '', id : 3, isDisable : false, isVisible : true }
];
@Component({
   selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  // menuItems: any[];
  public sideNavState: boolean = true;
  public linkText: boolean = false;
  
  // public userDetails : Userdata;
  public isInputFormDisable : boolean = false;
  constructor() {
    // this.userDetails = this.modelService.getItems();
   }


  ngOnInit(): void {
    // this.menuItems = ROUTES.filter(menuItem => menuItem);
    // if(this.userDetails.RoleId == 3 || this.userDetails.RoleId == 2){
    //   this.isInputFormDisable = true;
    // }
  }

}
