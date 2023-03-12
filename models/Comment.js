const { Model, DataTypes, literal } = require('sequelize');
const sequelize = require('../config/connection');
const moment = require('moment');

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    comment_text: {
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
    // user_id: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: 'user',
    //     key: 'id',
    //   },
    // },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment',
  }
);

module.exports = Comment;
