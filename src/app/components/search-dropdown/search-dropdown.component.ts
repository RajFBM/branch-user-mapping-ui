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
  @Output() userChange: EventEmitter<string>= new EventEmitter();
  length: number = 0;
  // countryCtrl: FormControl;
  // filteredCountry: Observable<any[]>;
  adUsers: AdUser[] = [];//Observable<AdUser[]>;
  location_lis: LocationDetails[] = [];
  userList: any[] = [];

  //adUsers: AdUser[] = [];
  constructor(private readonly _userService: UserService,private userDataService: UserDataService) {

    // this.countryCtrl = new FormControl();
    // this.filteredCountry = this.countryCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map((country) =>
    //     country ? this.filtercountry(country) : this.userList.slice()
    //   )
    // );
  }
  ngOnInit() {
    this.userChange.emit("");
  }
  onOptionSelected(selectedLogonName: string) {
    
    this.userDataService.setSelectedLogonName(selectedLogonName);
    this.userChange.emit(selectedLogonName);
  }
  
  // filtercountry(name: string) {
  //   let arr = this.userList.filter(
  //     (country) => country.name.toLowerCase().indexOf(name.toLowerCase()) === 0
  //   );
  //   return arr.length ? arr : [{ name: 'No Item found', code: 'null' }];
  // }
  handleDropdownClick() {
    // Implement your logic here
    console.log('Dropdown clicked');
  }

  onInput(event: Event): void {
    // Update the user input as the user types
   let val= (event.target as HTMLInputElement).value;

   let charLength=val.length;

   console.log("Character Count"+charLength);//RIP
   console.log("Character Count"+val);//

   if(charLength >= 3)
   {
  
    this._userService.getAdUsersId(val).subscribe(res => {
      this.adUsers =res;
    });
    console.log("Character Count"+charLength);
   }   
  }  
}
