import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup,  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Task } from 'src/app/interface/tasks';
import { TaskServiceService } from 'src/app/services/api/task/task-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule]

})
export class ListComponent {
  private taskService = inject(TaskServiceService)
  private router = inject(Router)


  withOutFilter:boolean = true
  completedFilter:boolean = false
  unfinishFilter:boolean = false

  loadingTasks:boolean = true
  isEditing:boolean[] = []
  tasks:Task[] = []
  filteredTasks:Task[] = []
  users:any[] = [
    {
      id:1,
      name:'Julian'
    },
    {
      id:2,
      name:'Julian'
    }
  ]
  formTasks!:FormGroup

  ngOnInit(){
    this.loadTasks()
  }

  /**
   * function to load the tasks.
   * Additionally the list is split to show
   * the first 5 results
   */
  loadTasks(){
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
      this.filteredTasks = this.tasks
      this.loadingTasks = false
    } else {
      this.taskService.getTasks().subscribe({
        next: (response: any) => {
          if (response.status == 200) {
            const tasks = response.body.splice(0, 5);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            this.tasks = tasks;
            this.filteredTasks = tasks
            this.loadingTasks = false
          } else {
            Swal.fire({
              title: "Error al cargar informacion",
              text: 'No se pudo cargar la informacion',
              icon: 'error',
              cancelButtonText: 'OK'
            });
          }
        },
        error: (error: Error) => {
          console.log(error);
          Swal.fire({
            title: "Error al cargar informacion",
            text: 'No se pudo cargar la informacion',
            icon: 'error',
            cancelButtonText: 'OK'
          });
        }
      });
    }
  }

  /**
   * Function to load
   * the localStorage list
   */
  loadTaskStorage(){
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      const tasks = JSON.parse(storedTasks);
      this.tasks = tasks
      this.filteredTasks = tasks
    }
  }

  /**
   * Funciton to filter and delete
   * one task
   */
  deleteTask(index:number){
    let tasks = this.tasks.filter((_, i) => i !== index);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.loadTaskStorage()
  }

  /**
   * Function that recived the filter
   * and show the list
   * @param filterType
   */
  filter(filterType?: string) {
    this.filteredTasks = this.tasks
    if (filterType === 'completed') {
      this.completedFilter = true;
      this.unfinishFilter = false;
      this.withOutFilter = false;
      this.filteredTasks = this.tasks.filter(task => task.completed);
    } else if (filterType === 'unfinished') {
      this.unfinishFilter = true;
      this.completedFilter = false;
      this.withOutFilter = false;
      this.filteredTasks = this.tasks.filter(task => !task.completed);
    } else {
      this.withOutFilter = true;
      this.unfinishFilter = false;
      this.completedFilter = false;
      this.filteredTasks = this.tasks;
    }
  }

  /**
   * Function to navigate
   * to edit component
   */
  editTask(index:number | string){
    this.router.navigate([`/home/tasks/edit/${index}`])
  }

}
