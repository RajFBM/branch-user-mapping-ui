// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserDataService {

//   constructor() { }
// }
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  selectedLogonName: string | undefined;

  setSelectedLogonName(logonName: string) {
    this.selectedLogonName = logonName;
  }

  getSelectedLogonName() {
    return this.selectedLogonName;
  }
}
