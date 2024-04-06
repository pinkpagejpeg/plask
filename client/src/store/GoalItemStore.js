import { makeAutoObservable } from 'mobx'

export default class GoalItemStore {
    constructor() {
        this._goalItem = []
        makeAutoObservable(this)
    }

    setGoalItem(goalItem) {
        this._goalItem = goalItem
    }

    addGoalItemList(goalItem) {
        this._goalItem.unshift(goalItem)
    }

    editGoalItem(goalItemId, updatedGoalItem) {
        this._goalItem = this._goalItem.map(goalItem => {
            if (goalItem.id === goalItemId) {
                return updatedGoalItem;
            }
            return goalItem;
        });
    }

    removeGoalItem(goalItemId) {
        this._goalItem = this._goalItem.filter(goalItem => goalItem.id !== goalItemId);
    }

    getGoalItemByGoalId(goalId) {
        return this._goalItem.filter(goalItem => goalItem.goalId === goalId);
    }

    get goalItem() {
        return this._goalItem
    }
}