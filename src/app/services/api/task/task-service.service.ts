import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';


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
}
