const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING},
    img: {type: DataTypes.STRING, defaultValue: "user_default_image.jpg"}
})

const Task = sequelize.define('task', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    info: {type: DataTypes.STRING},
    status: {type: DataTypes.BOOLEAN, defaultValue: false},
})

const Goal = sequelize.define('goal', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    info: {type: DataTypes.STRING},
})

const Goal_item = sequelize.define('goal_item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    info: {type: DataTypes.STRING},
    status: {type: DataTypes.BOOLEAN, defaultValue: false},
})

const Feedback = sequelize.define('feedback', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    info: {type: DataTypes.STRING},
    date: {type: DataTypes.DATEONLY, defaultValue: sequelize.literal('CURRENT_DATE')},
    status: {type: DataTypes.BOOLEAN, defaultValue: false},
})

User.hasMany(Goal)
Goal.belongsTo(User)

User.hasMany(Task)
Task.belongsTo(User)

User.hasMany(Feedback)
Feedback.belongsTo(User)

Goal.hasMany(Goal_item)
Goal_item.belongsTo(Goal)

module.exports = {
    User,
    Task,
    Goal,
    Goal_item,
    Feedback
}