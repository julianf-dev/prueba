export interface Skill {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  age: number;
  skills: Skill[];
}
