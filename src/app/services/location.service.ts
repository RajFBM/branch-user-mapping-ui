import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CommonHttpService } from './utils/http.service';
import { GlobalConstant } from '../shared/constant';
import { LocationDetails } from 'app/models/locations';

@Injectable({
  providedIn: "root"
})
export class LocationService extends CommonHttpService {
  getAllLocations(): Observable<LocationDetails[]> {
    return this.sendGetRequest<LocationDetails[]>(GlobalConstant.apiBaseUrl +'Location/GetAllLocation');
  }
}

