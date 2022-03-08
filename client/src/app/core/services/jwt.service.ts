import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  get(){
    return window.localStorage['token'];
  }

  save(token: string){
    window.localStorage['token'] = token;
  }

  destroy(){
    window.localStorage.removeItem('token');
  }
}
