//import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { UserDetails } from './models/UserDetails';
import { UserService } from './services/user.service';
// import * as $ from 'jquery';
import 'datatables.net';
// import DataTables from 'datatables.net';
import * as DataTables from 'datatables.net';
import { UserDataService } from './services/user-data.service';
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

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  selectedLogonName: string | undefined;


  constructor(private userDataService: UserDataService, private renderer: Renderer2, private el: ElementRef, private readonly userService: UserService) {

    this.selectedLogonName = this.userDataService.getSelectedLogonName();

  }
  userChangeHandler(selectedUser: string) {
    debugger;
    this.userDataListForSave = [];
    if (selectedUser !== "" && selectedUser !== null) {
      this.selectedUser = selectedUser;
      this.filteredUserData = this.userDataArray.filter(x => x.userId == selectedUser);
    }
  }
  nodeSelectionHandler(node: any) {
    alert(JSON.stringify(node));
    const userDetails = {
      createD_TIMESTAMP: new Date(),
      createD_BY: this.selectedUser,
      modifieD_TIMESTAMP: new Date(),
      modifieD_BY: "",
      userId: this.selectedUser,
      userEmail: 'raj@yopmail.com',
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
        // Successful response
        if (data) {
          debugger;
          this.userDataArray = data;
          if(this.selectedUser){
            debugger;
            this.filteredUserData = this.userDataArray.filter(x => x.userId == this.selectedUser);
          }
        }
      },
      (error) => {
        // Error handling
        console.error('An error occurred:', error);
        // You can display an error message or perform any other error handling logic here
      }
    );
  };
  updateUser() {
    //alert('CLICKED');
    //please create proper userObject and send to service method
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
  deleteUser(userId: string) {
    debugger;
    this.userService.deleteUser(userId).subscribe((res) => {
      // Successful response
      if (res) {
        console.log(res);
      }
    });
  }
  addUser() {
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