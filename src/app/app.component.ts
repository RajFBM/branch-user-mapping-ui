//import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit , AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { UserDetails } from './models/UserDetails';
import { UserService } from './services/user.service';
// import * as $ from 'jquery';
import 'datatables.net';
// import DataTables from 'datatables.net';
import * as DataTables from 'datatables.net';



@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.css'],  
})

export class AppComponent implements AfterViewInit {
public userDataArray : UserDetails[] = [];
// dtOptions: DataTables.Settings = {};
// dtApprovedOptions: DataTables.Settings = {};
// dtOptions: DataTables.Settings = {};
sideBarOpen = true;

sideBarToggler() {
  this.sideBarOpen = !this.sideBarOpen;
}
constructor(private renderer: Renderer2, private el: ElementRef , private readonly userService: UserService) {}


ngAfterViewInit(): void {
  // Use Renderer2 to manipulate the DOM
  const element = this.el.nativeElement.querySelector('#myDataTable');
  // Perform DOM manipulation or interact with third-party libraries here
}
// ngAfterViewInit(): void {
//   $(document).ready(() => {
//     // $('#myDataTable').DataTables();
//     $('#myDataTable').DataTable();
//   });
// }
ngOnInit() {
  this.getAllUsers();
}

getAllUsers()
{
  this.userDataArray = [];
  this.userService.getAllUsers().subscribe(
    (data) => {
      // Successful response
      if (data) {
        this.userDataArray = data;
      }
    },
    (error) => {
      // Error handling
      console.error('An error occurred:', error);
      // You can display an error message or perform any other error handling logic here
    }
  );
  };
  updateUser(){
    //alert('CLICKED');
    //please create proper userObject and send to service method
    const userDetails= {
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
  deleteUser(){ 
    this.userService.deleteUser(1).subscribe((res) => {
      // Successful response
      if (res) {
    console.log(res);
      }
    }

    );
  }
  addUser(){
//please create proper userObject and send to service method
const userDetails= {
  createD_TIMESTAMP: new Date("2020-07-02T00:00:00"),
  createD_BY: "SeanC",
  modifieD_TIMESTAMP: new Date("0001-01-01T00:00:00"),
  modifieD_BY: "DEV USER",
  userId: "HABS\\Lindsey.Miller",
  userEmail: "Lindsey.Miller@fbmsales.com",
  userCategory: "Test",
  locationAccess: "888 -- SBP Midwest"
}
this.userService.addUser(userDetails).subscribe((data: any) => {
  // Successful response
  if (data) {
console.log(data);
  }
}

);
  }
}
/////PUT,POST,DELETE
//   ngOnInit(): void {
//   }
// }


// // @Component({
// //  selector: 'app-root',
// //   templateUrl: './app.component.html',
// //   styleUrls: ['./app.component.css'],

  
// // })
// // export class AppComponent {
// //   title = 'branch-user-mapping-ui';
// //   userList: string[] = ['User 1', 'User 2', 'User 3'];
// // selectedOption1: any;
// // inputValue: any;
// //   userCategory: string[] = ['Option A', 'Option B', 'Option C']
// //   nodes = [
// //     {
// //       name: 'Root',
// //       children: [
// //         { name: 'Node 1' },
// //         { name: 'Node 2' },
// //         {
// //           name: 'Node 3',
// //           children: [
// //             { name: 'Node 3.1' },
// //             { name: 'Node 3.2' }
// //           ]
// //         }
// //       ]
// //     }
// //   ];
// // } */

