import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AdUser } from 'app/models/ad-user';
import { LocationDetails } from 'app/models/locations';
import { UserDataService } from 'app/services/user-data.service';
import { UserService } from 'app/services/user.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrls: ['./search-dropdown.component.css']
})
export class SearchDropdownComponent implements OnInit {
  @Output() userChange: EventEmitter<string> = new EventEmitter();
  length: number = 0;
  adUsers: AdUser[] = [];//Observable<AdUser[]>;
  location_lis: LocationDetails[] = [];
  userList: any[] = [];

  //adUsers: AdUser[] = [];
  constructor(private readonly _userService: UserService, private userDataService: UserDataService) {

  }
  ngOnInit() {
    this.userChange.emit("");
  }
  onOptionSelected(selectedLogonName: string) {

    this.userDataService.setSelectedLogonName(selectedLogonName);
    this.userChange.emit(selectedLogonName);
  }



  onInput(event: Event): void {
    // Update the user input as the user types
    let val = (event.target as HTMLInputElement).value;
    let charLength = val.length;
    if (charLength >= 3) {
      this._userService.getAdUsersId(val).subscribe(res => {
        this.adUsers = res;
      });

    }
  }
}
