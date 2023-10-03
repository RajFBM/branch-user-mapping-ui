import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { UserDetails } from './models/UserDetails';
import { UserService } from './services/user.service';

import 'datatables.net';

import * as DataTables from 'datatables.net';
import { UserDataService } from './services/user-data.service';
import { DataSharedService } from './services/data-shared.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements AfterViewInit {
  @ViewChild('userCategory')
  userCategory!: ElementRef;
  public userDataArray: UserDetails[] = [];
  public filteredUserData: UserDetails[] = [];
  public userDataListForSave: UserDetails[] = [];
  selectedUser!: string;
  sideBarOpen = true;
  userEmailValue: string = "";
 // dtOptions: any = {};

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  selectedLogonName: string | undefined;


  constructor(private userDataService: UserDataService, private renderer: Renderer2, private el: ElementRef,
    private readonly userService: UserService,
    private readonly dataSharedService: DataSharedService) {
    this.selectedLogonName = this.userDataService.getSelectedLogonName();
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 5,
    //   lengthMenu : [5,10,15,25,50,75,100],
    //   processing: true,
    //   ordering : true,
    //   columnDefs: [
    //     { "orderable": false, "targets": [0,1] }
    //   ]
    // };
  }
  userChangeHandler(selectedUserEmail: string) {
    this.userDataListForSave = [];
    this.userEmailValue = selectedUserEmail;



    if (selectedUserEmail !== "" && selectedUserEmail !== null) {
      this.selectedUser = selectedUserEmail;
      this.filteredUserData = this.userDataArray.filter(x => x.userEmail == selectedUserEmail);

      this.filteredUserData[0].userEmail;

      const userNmaeLst = this.filteredUserData.map(x => x.locationAccess);
      this.dataSharedService.userSavedData.next(userNmaeLst);
    }
  }
  nodeSelectionHandler(node: any) {
    debugger

    const userDetails = {
      createD_TIMESTAMP: new Date(),
      createD_BY: this.selectedUser,
      modifieD_TIMESTAMP: new Date(),
      modifieD_BY: this.userEmailValue,
      userId: this.selectedUser,
      userEmail: this.userEmailValue,
      userCategory: this.userCategory.nativeElement.value,
      locationAccess: node.item
    };
    this.userDataListForSave.push(userDetails)
  }

  ngAfterViewInit(): void {
    const element = this.el.nativeElement.querySelector('#myDataTable');
  }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userDataArray = [];
    this.userService.getAllUsers().subscribe(
      (data) => {

        if (data) {
          this.userDataArray = data;
          if (this.selectedUser) {
            this.filteredUserData = this.userDataArray.filter(x => x.userEmail == this.selectedUser);
            //console.log(this.filteredUserData,"userdata");
          }
        }
      },
      (error) => {
        // Error handling
        console.error('An error occurred:', error);

      }
    );
  };
  updateUser() {

    const userDetails = {
      createD_TIMESTAMP: new Date("2020-07-02T00:00:00"),
      createD_BY: "SeanC",
      modifieD_TIMESTAMP: new Date("0001-01-01T00:00:00"),
      modifieD_BY: "DEV USER",
      userId: "HABS",
      userEmail: "Lindsey.Miller@fbmsales.com",
      userCategory: "Trainer",
      locationAccess: "808 -- SBP Midwest"
    }
    this.userService.updateUser(userDetails, userDetails.userId).subscribe((data) => {
      // Successful response
      console.log(data);
    }

    )
  }
  deleteUser(userId: string, locationAccess: string) {
    this.userService.deleteUser(userId, locationAccess).subscribe({
      next: (response) => {
        this.getAllUsers();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  addUser() {
    debugger
    this.userService.addUser(this.userDataListForSave[0]).subscribe({
      next: (response) => {
        this.getAllUsers();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }


}