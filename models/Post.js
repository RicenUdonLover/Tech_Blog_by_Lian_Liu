const { Model, DataTypes, literal } = require('sequelize');
const sequelize = require('../config/connection');
const moment = require('moment');

class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    post_title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5],
        is: /^[\w\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/i, // Restrict to alphanumeric characters, underscores, and certain special characters
      },
    },
    post_text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: literal('CURRENT_TIMESTAMP'),
      get() {
        return moment(this.getDataValue('post_date')).format('MM-DD-YYYY HH:mm:ss');
      }
    },
    // comments: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'post',
  }
);

module.exports = Post;
