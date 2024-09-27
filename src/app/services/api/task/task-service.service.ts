import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Task } from 'src/app/interface/tasks';


@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  private http = inject(HttpClient)

  /**
   * Function to consume api
   * @returns list of tasks
   */
  getTasks(){
    return this.http.get(`${environment.URL_TASKS}`, { observe: 'response'})
  }

  /**
   * Funcion to create tasks in LoalStorage
   * @param tasks
   */
  setTasks(tasks: Task[]){
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  /**
   * Function to get localStoragetasks
   * @returns list of tasks
   */
  getLocalTasks(){
    return localStorage.getItem('tasks');
  }
}
