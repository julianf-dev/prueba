export interface Skill {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  age: number;
  skills: Skill[];
}
