import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserDetails } from '../models/UserDetails';
import { CommonHttpService } from './utils/http.service';
import { GlobalConstant } from '../shared/constant';
import { AdUser } from 'app/models/ad-user';

@Injectable({
  providedIn: "root"
})
export class UserService extends CommonHttpService {



  getAllUsers(): Observable<UserDetails[]> {

    return this.sendGetRequest<UserDetails[]>(GlobalConstant.apiBaseUrl + 'User/GetAllUsersDetailList');

  }
  getAdUsersId(userId: string): Observable<AdUser[]> {


    return this.sendGetRequest<AdUser[]>(GlobalConstant.apiBaseUrl + 'GetADusers?searchTerm=' + userId);

  }


  updateUser(user: UserDetails, userId: string): Observable<Number> {
    console.log(GlobalConstant.apiBaseUrl + `User/UpdateUser?userId=${userId}`);
    return this.sendPutRequest<Number>(GlobalConstant.apiBaseUrl + `User/UpdateUser?userId=${userId}`, user);
  }
  addUser(userDetail: UserDetails): Observable<number> {
    return this.sendPostRequest<number>(GlobalConstant.apiBaseUrl + 'User/AddUserLocation', userDetail);
  }




  deleteUser(userId: any, locationAccess: any): Observable<boolean> {
    const url = `${GlobalConstant.apiBaseUrl}User/DeleteUserLocation?userId=${userId}&locationAccess=${locationAccess}`;
    return this.sendDeleteRequest<boolean>(url);
  }






}

