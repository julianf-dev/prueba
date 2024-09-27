import { CommonModule } from '@angular/common';
import { Component, inject, NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Task } from 'src/app/interface/tasks';
import { Skill, User } from 'src/app/interface/user';
import { TaskServiceService } from 'src/app/services/api/task/task-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create',
  standalone: true,
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, FormsModule, ]
})
export class CreateComponent {

  private formBuilder = inject(FormBuilder)
  idTask!: number


  loadingTasks: boolean = false
  isEditing: boolean[] = []
  tasks: Task[] = []
  formTask!: FormGroup

  ngOnInit() {
    this.buiildForm();
    setTimeout( () =>{
      this.addUser()
    },2000)
  }

  /**
   * Function to create form
   */
  buiildForm() {
    this.formTask = this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      date: [null],
      arrayUsers: this.formBuilder.array([]),
      completed: [false],
    })
    console.log(this.formTask);
  }

  /**
   * Get list tasks
   */
  get getListUsers() {
    return this.formTask.get('arrayUsers') as FormArray;
  }

  /**
   * Functio to get skills
   * @param skillIndex
   * @returns
   */
  getListSkills(userIndex: number) {
    return this.getListUsers.at(userIndex).get('skills') as FormArray;
  }

  /**
 * Function to add a new user
 * @param user
 */
  addUser(user: any = null) {
    this.getListUsers.push(this.newUser(user));
  }

  /**
   * Function to ad a new skill
   */
  addSkill(userIndex: any, skill: any = null){
    this.getListSkills(userIndex).push(this.newSkill(skill))
  }
  /**
   * Create a new empty task or
   * fill with task's values
   * @param task
   */
  newUser(user: any = null) {
    let id = null
    let name = null
    let age = null
    let skills = null
    if (user) {
      if (user.id) id = user.id
      if (user.name) name = user.name
      if (user.age) age = user.age
      if (user.skills) skills = user.skills
    }
    let userFormGroup = this.formBuilder.group({
      id: [id],
      name: [name],
      age: [age, Validators.min(18)],
      skills: this.formBuilder.array([],Validators.required)
    })
    console.log(userFormGroup);
    return userFormGroup
  }

  /**
   * Function to create Skill
   * @param skill
   * @returns
   */
  newSkill(skill: Skill){
    let id = null
    let name = null
    if (skill) {
      if (skill.id) id = skill.id
      if (skill.name) name =skill.name
    }

    let skillFormGroup = this.formBuilder.group({
      id: [id],
      name: [name],
    })
    return skillFormGroup
  }

    /**
   * Validate if the field is wrong
   * @param campo
   * @returns
   */
    campoNoValido(campo: string) {
      return this.formTask.get(campo)?.invalid && this.formTask.get(campo)?.touched;
    }


    /**
     * Validate if user fiel is required
     * @param campo
     * @returns
     */
    campoNoValidoUser(campo: string, userIndex: number) {
      if (this.getListUsers.controls[userIndex]) {
        const control = this.getListUsers.controls[userIndex].get(campo);
        return control?.invalid && control?.touched;
      }
      return false;
    }

    /**
     * Delete user
     */
    deleteUser(userIndex: any) {
      this.getListUsers.removeAt(userIndex)
    }

    /**
     * Delete skill
     */
    deleteSkill(userIndex:any, skillIndex:any){
      const userFormGroup = this.getListUsers.at(userIndex) as FormGroup;
      const skillsFormArray = userFormGroup.get('skills') as FormArray;

      if (skillsFormArray) {
        skillsFormArray.removeAt(skillIndex);
      }
    }


    /**
     * Function to validate name
     */
    validateName(event: Event){

    }


    addTask(){
      if (this.formTask.invalid) {
        Object.entries(this.formTask.controls).forEach(([controlName, control]) => {
  /*         console.log(controlName, control.invalid); */
          control.markAsTouched();
        });
        this.getListUsers.controls.forEach((copropietario: any) => {
          Object.entries(copropietario.controls).forEach(([controlName, control]) => {
            (control as AbstractControl).markAsTouched();
          });
        });
        Swal.fire({
          title: "Faltan campos por diligenciar",
          text: "Hay campos sin completar, por favor revise el formulario.",
          icon: 'warning',
          cancelButtonText: 'OK'
        });
      } else {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        this.tasks = JSON.parse(storedTasks);
      }
      const newTask = {
        id: Date(),
        title: this.formTask.get('title')?.value,
        date: this.formTask.get('date')?.value,
        users: this.formTask.get('users')?.value,
        completed: this.formTask.get('completed')?.value,
      }

      this.tasks.push(newTask)
      localStorage.setItem('tasks', JSON.stringify(this.tasks));

      Swal.fire({
        title: "Exito",
        text: 'Tarea creada con exito',
        cancelButtonText: 'OK'
      });
    }
  }
}
