import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserDetails } from '../models/UserDetails';
import { CommonHttpService } from './utils/http.service';
import { GlobalConstant } from '../shared/constant';

@Injectable({
  providedIn: "root"
})
export class UserService extends CommonHttpService {

  // mainURL : string = environment.mainUrl;
  //constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserDetails[]> {

    return this.sendGetRequest<UserDetails[]>(GlobalConstant.apiBaseUrl +'User/GetAllUsersDetailList');
    //return this.http.get<UserService[]>(this.mainURL + 'api/admin/GetAllUsers');
  }
  updateUser(user: UserDetails, userId: string): Observable<Number> {
    console.log(GlobalConstant.apiBaseUrl +`User/UpdateUser?userId=${userId}`);
    return this.sendPutRequest<Number>(GlobalConstant.apiBaseUrl+`User/UpdateUser?userId=${userId}`, user);
  }
  addUser(userDetail: UserDetails): Observable<number> {
    return this.sendPostRequest<number>(GlobalConstant.apiBaseUrl+'User/CreateUser', userDetail);
  }

  deleteUser(userId: any): Observable<boolean> {
    
    return this.sendDeleteRequest<boolean>("urlpath");
  }

  // Treeview(): Observable<UserDetails[]> {

  //   return this.sendTreeGetRequest<UserDetails[]>(GlobalConstant.apiBaseUrl +'User/GetAllLocation');
  //   //return this.http.get<UserService[]>(this.mainURL + 'api/admin/GetAllUsers');
  // }


}

