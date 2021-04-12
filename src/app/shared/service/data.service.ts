import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from 'src/app/interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private loadingDetail = new BehaviorSubject(false);
  loaderFlag = this.loadingDetail.asObservable();

  private userList = new BehaviorSubject([]);
  users = this.userList.asObservable();

  constructor() { }

  showLoader(flag: boolean) {
    this.loadingDetail.next(flag);
  }

  changeUserList(data: UserModel[]) {
    this.userList.next(data);
  }
}
