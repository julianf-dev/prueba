import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
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
  private taskServeice = inject(TaskServiceService)

  loadingTasks: boolean = false
  loadingUsers!: boolean
  addMoreUsers:boolean = false
  userAdded: boolean[] = [];
  tasks: Task[] = []
  formTask!: FormGroup

  ngOnInit() {
    this.loadingUsers = true
    this.buiildForm();
    setTimeout( () =>{
      this.addUser()
      this.addSkill(0)
      this.loadingUsers =false
    },1000)
  }

  /**
   * Function to create form
   */
  buiildForm() {
    this.formTask = this.formBuilder.group({
      id: [this.generateRandomId()],
      title: ['', Validators.required],
      date: ['',Validators.required],
      arrayUsers: this.formBuilder.array([],Validators.required),
      completed: [false,Validators.required],
    })
  }

  /**
   * Get list tasks
   */
  get getListUsers() {
    return this.formTask.get('arrayUsers') as FormArray;
  }

  /**
   * Function to get skills
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
 * Function to validate if user is in the list
 * use the boolean array to valide if the user exist.
 */
  createUser(userIndex: number) {
    if (this.formTask.get('arrayUsers')?.invalid && this.getListUsers.length > 0) {
      this.getListUsers.controls.forEach((user: any) => {
        Object.entries(user.controls).forEach(([controlName, control]) => {
          (control as AbstractControl).markAsTouched();
        });
      })
      Swal.fire({
      title: "Faltan campos por diligenciar",
      text: "Hay campos sin completar, por favor revise el formulario.",
      icon: 'warning',
      cancelButtonText: 'OK'
      });
    }
    else{
      const userName = this.getListUsers?.controls[userIndex]?.get('name')?.value;
      const nameExists = this.getListUsers.controls.some((user: any, index: number) => {
      return index !== userIndex && user.get('name').value.toLowerCase() === userName.toLowerCase();
      });
      if (nameExists) {
        Swal.fire({
          title: "Error",
          text: "El nombre de usuario ya existe",
          icon: 'error',
          cancelButtonText: 'OK'
          });
        return;
      }
      this.userAdded[userIndex] = true;
      this.addMoreUsers = true
    }
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
  newUser(user: User | null = null) {
    let id = this.generateRandomId()
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
      name: [name, Validators.required],
      age: [age, Validators.min(18)],
      skills: this.formBuilder.array([],Validators.required)
    })
    return userFormGroup
  }

  /**
   * Function to create Skill
   * @param skill
   * @returns
   */
  newSkill(skill: Skill | null = null){
    let id = this.generateRandomId()
    let name = null
    if (skill) {
      if (skill.id) id = skill.id
      if (skill.name) name =skill.name
    }

    let skillFormGroup = this.formBuilder.group({
      id: [id],
      name: [name, Validators.required],
    })
    return skillFormGroup
  }

    /**
   * Validate if the field is wrong
   * @param campo
   * @returns
   */
    invalidField(campo: string) {
      return this.formTask.get(campo)?.invalid && this.formTask.get(campo)?.touched;
    }


    /**
     * Validate if user field is required
     * @param campo
     * @returns
     */
    invalidFieldUser(campo: string, userIndex: number) {
      if (this.getListUsers.controls[userIndex]) {
        const control = this.getListUsers.controls[userIndex].get(campo);
        return control?.invalid && control?.touched;
      }
      return false;
    }

    /**
     * Validate if user field is required
     * @param campo
     * @returns
     */
    invalidFieldSkill(userIndex: number, skillIndex: number, campo:string) {
      if(this.getListSkills(userIndex).controls[skillIndex]){
        const control = this.getListSkills(userIndex).controls[skillIndex].get(campo);
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

    createTask(){
      if (this.formTask.invalid) {
        Object.entries(this.formTask.controls).forEach(([controlName, control]) => {
          control.markAsTouched();
        });
        this.getListUsers.controls.forEach((user: any) => {
          Object.entries(user.controls).forEach(([controlName, control]) => {
            (control as AbstractControl).markAsTouched();
          });
          const skills = user.get('skills') as FormArray;
          skills.controls.forEach((skillControl: AbstractControl) => {
            skillControl.markAsTouched();
          });
        });
        Swal.fire({
          title: "Faltan campos por diligenciar",
          text: "Hay campos sin completar, por favor revise el formulario.",
          icon: 'warning',
          cancelButtonText: 'OK'
        });
      }
      else {
        const storedTasks = this.taskServeice.getLocalTasks()

        if (storedTasks) {
          this.tasks = JSON.parse(storedTasks);
        }

        //todo Information
        /**
         * We need to do a map in bot arrays
         * because if we dont do that
         * the object only takes the first
         * reference and not the deep references
         */
        const newTask: Task = {
          id: this.formTask.get('id')?.value,
          date: this.formTask.get('date')?.value,
          title: this.formTask.get('title')?.value,
          users: this.formTask.get('arrayUsers')?.value.map((user: any) => ({
            ...user,
            skills: user.skills.map((skill: any) => ({
              ...skill,
            }))
          })),
          completed: this.formTask.get('completed')?.value
        }

        this.tasks.push(newTask)

        Swal.fire({
          title: "Exito",
          text: 'Tarea creada con exito',
          cancelButtonText: 'OK'
        });
        this.taskServeice.setTasks(this.tasks)
        this.resetForm()
      }
  }

  /**
   * Function to create random id
   */
  generateRandomId() {
    return 'id-'+ Math.floor(Math.random() * 1000);
  }

  /**
   * Function Delete blank spaces
   * and validate the name
   */
  deleteBlankSpaces(userIndex: number) {
    const userControl = this.getListUsers.controls[userIndex];
    const nameControl = userControl.get('name');

    if (nameControl && nameControl.value != null && nameControl.value !== '') {
      const trimmedValue = nameControl.value.trim();

      const nameExists = this.getListUsers.controls.some((control, index) => {
        return index !== userIndex && control.get('name')?.value.trim() === trimmedValue;
      });

      if (nameExists) {
        Swal.fire({
          title: "Error",
          text: "El nombre de usuario ya existe",
          icon: 'error',
          cancelButtonText: 'OK'
          });
        return;
      } else {
        nameControl.setValue(trimmedValue);
      }
    }
  }

  /**
   * Function to select the date
   */
  onDateChange(event: any) {
    const dateValue = event.target.value;
    if(dateValue){
      this.formTask?.get('date')?.setValue(dateValue);
    }
  }

  /**
   * Function to reset form
   */
  resetForm(){
    this.formTask.reset();
    this.userAdded = [];
    this.addMoreUsers = false;
    this.loadingTasks = true;

    setTimeout(() => {
      const arrayUsersControl = this.formTask.get('arrayUsers') as FormArray;
      while (arrayUsersControl.length) {
        arrayUsersControl.removeAt(0);
      }
      this.formTask.get('arraysUsers')?.setValue([])
      this.formTask.get('completed')?.setValue(false);
      this.formTask.get('id')?.setValue(this.generateRandomId());
      this.addUser();
      this.addSkill(0);
      this.loadingUsers = false;
    }, 2000);
  }
}
