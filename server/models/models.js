const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    password: { type: DataTypes.STRING(120), allowNull: false },
    role: { type: DataTypes.STRING(20), allowNull: false },
    img: { type: DataTypes.STRING(120), defaultValue: "user_default_image.jpg", allowNull: false }
})

const Task = sequelize.define('task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    info: { type: DataTypes.STRING(255) },
    status: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
})

const Goal = sequelize.define('goal', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    info: { type: DataTypes.STRING(255) },
})

const Goal_item = sequelize.define('goal_item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    info: { type: DataTypes.STRING(255) },
    status: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
})

const Feedback = sequelize.define('feedback', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    info: { type: DataTypes.STRING(255), allowNull: false },
    date: { type: DataTypes.DATEONLY, defaultValue: sequelize.literal('CURRENT_DATE'), allowNull: false },
    status: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
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