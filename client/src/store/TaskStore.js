import { makeAutoObservable } from 'mobx'

export default class TaskStore {
    constructor() {
        this._task = []
        makeAutoObservable(this)
    }

    setTask(task) {
        // console.log("Setting task to:", task);
        this._task = task
    }

    addTaskList(task) {
        this._task.push(task)
    }

    get task() {
        return this._task
    }

    getTaskByUserId(userId) {
        return this._task.filter(task => task.userId === userId);
    }
    
}