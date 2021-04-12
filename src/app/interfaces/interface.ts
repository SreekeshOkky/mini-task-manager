export interface SelectModel {
    value: string;
    text: string;
}

export interface UserModel {
    id: string;
    name: string;
    picture: string;
}

export interface ApiModel {
    status: string;
    users?: UserModel[];
    tasks?: any[];
    taskid?: string;
    error?: string;
}

export interface TaskData {
    id?: string;
    message: string;
    due_date?: string;
    priority?: string;
    assigned_to?: string;
}
