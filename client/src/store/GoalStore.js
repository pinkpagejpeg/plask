import { makeAutoObservable } from 'mobx'

export default class GoalStore {
    constructor() {
        this._goal = []
        makeAutoObservable(this)
    }

    setGoal(goal) {
        this._goal = goal
    }

    addGoalList(goal) {
        this._goal.unshift(goal)
    }

    editGoal(goalId, updatedGoal) {
        this._goal = this._goal.map(goal => {
            if (goal.id === goalId) {
                return updatedGoal;
            }
            return goal;
        });
    }

    removeGoal(goalId) {
        this._goal = this._goal.filter(goal => goal.id !== goalId);
    }

    getGoalByUserId(userId) {
        return this._goal.filter(goal => goal.userId === userId);
    }

    get goal() {
        return this._goal
    }
}