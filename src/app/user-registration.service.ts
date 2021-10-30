import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class UserRegistrationService {
  score=0;
  from_api: any;
  register=false;
  thank_you=false;
  path: any = environment.api_url;
  matchA:any;
  matchB=[];
  user_statistics: any;
  user_id:any;
  phone:any;
  user:any;
  user_phone:any;
  
  
  constructor(private http:HttpClient) {  }
  
}
