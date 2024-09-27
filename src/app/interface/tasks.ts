import { User } from "./user";

export interface Task{
    id: number | string;
    date: string;
    title: string;
    users: User[];
    completed: boolean;
}
