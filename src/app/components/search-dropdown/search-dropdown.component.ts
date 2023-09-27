import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LocationDetails } from 'app/models/locations';
import { UserService } from 'app/services/user.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrls: ['./search-dropdown.component.css']
})
export class SearchDropdownComponent implements OnInit {
  length: number = 0;
  countryCtrl: FormControl;
  filteredCountry: Observable<any[]>;
  location_lis: LocationDetails[] = [];
  userList: any[] = [];
  constructor(private readonly _userService: UserService) {
    this.countryCtrl = new FormControl();
    this.filteredCountry = this.countryCtrl.valueChanges.pipe(
      startWith(''),
      map((country) =>
        country ? this.filtercountry(country) : this.userList.slice()
      )
    );
  }
  ngOnInit() {
    this._userService.getAllUsers().subscribe(res => {
      this.userList = res.map(x => ({
        name: x.userId,
        code: x.userId
      }));
    });
  }

  filtercountry(name: string) {
    let arr = this.userList.filter(
      (country) => country.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
    return arr.length ? arr : [{ name: 'No Item found', code: 'null' }];
  }
}
