import { Component, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';
//import { ModelServiceService } from 'app/services/ModelService.service';
//import { Userdata } from 'app/model/userdata';
import { MatSidenav } from '@angular/material/sidenav';
//import { MsalService } from '@azure/msal-angular';
import { BehaviorSubject } from 'rxjs';
//import Swal from 'sweetalert2/dist/sweetalert2.js';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  {
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

 // private listTitles: any[];
  location: Location;
    mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
 // public userDetails : 2;
  constructor(location: Location,  private element: ElementRef, private router: Router//,
   // private modelService : ModelServiceService, private msalService: MsalService
    ) {
  
      this.location = location;
      this.sidebarVisible = true;
    //  this.userDetails = this.modelService.getItems();

  }
  
  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  } 

}
