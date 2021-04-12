import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from './../../../constants';
import { TaskData } from 'src/app/interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiURL = API_URL;

  constructor(private httpClient: HttpClient) { }

  public getAllTasks() {
    return this.httpClient.get(`${this.apiURL}/tasks/list`);
  }

  public getAllUsers() {
    return this.httpClient.get(`${this.apiURL}/tasks/listusers`);
  }

  public createTask(taskData: TaskData) {
    return this.httpClient.post(`${this.apiURL}/tasks/create`, taskData);
  }

  public updateTask(taskData: TaskData) {
    return this.httpClient.post(`${this.apiURL}/tasks/update`, taskData);
  }

  public deleteTask(taskData: TaskData) {
    return this.httpClient.post(`${this.apiURL}/tasks/delete`, taskData);
  }
}
