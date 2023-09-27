import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LocationDetails } from 'app/models/locations';
import { UserService } from 'app/services/user.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
// import { Country } from 'src/app/models/country';
// import { UserService } from 'src/app/services/userservice';

@Component({
  selector: 'app-search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrls: ['./search-dropdown.component.css']
})
export class SearchDropdownComponent implements OnInit {
  length: number = 0;
  countryCtrl: FormControl;
  //filteredCountry: Observable<any[]>;
location_lis: LocationDetails[] = [];
  //   { name: 'Afghanistan', code: 'AF' },
  //   { name: 'Åland Islands', code: 'AX' },
  //   { name: 'Albania', code: 'AL' },
  //   { name: 'Algeria', code: 'DZ' },
  //   { name: 'American Samoa', code: 'AS' },
  //   { name: 'AndorrA', code: 'AD' },
  //   { name: 'Angola', code: 'AO' },
  //   { name: 'Anguilla', code: 'AI' },
  //   { name: 'Antarctica', code: 'AQ' },
  //   { name: 'Antigua and Barbuda', code: 'AG' },
  //   { name: 'Argentina', code: 'AR' },
  //   { name: 'Armenia', code: 'AM' },
  //   { name: 'Aruba', code: 'AW' },
  // ];
  jsonURL = '/src/app/countries.json';

  constructor(private readonly _userService: UserService) {
    this.countryCtrl = new FormControl();
    // this.filteredCountry = this.countryCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map((country) =>
    //     country ? this.filtercountry(country) : this.location_lis.slice()
    //   )
    // );
  }
  ngOnInit() {
    this._userService.getAllUsers().subscribe(res => {
      // this.location_lis = res.map(x => ({
      //   name: x.userId,
      //   code: x.userId
      // }));
    });
    
  }

  filtercountry(name: string) {
    // let arr = this.country_lis.filter(
    //   (country) => country.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    // );

    //return arr.length ? arr : [{ name: 'No Item found', code: 'null' }];
  }
}
