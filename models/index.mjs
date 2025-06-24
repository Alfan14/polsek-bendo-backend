import {Sequelize, DataTypes} from 'sequelize';
import userModel from '../models/userModel.mjs'; 
import dotenv from 'dotenv';
import pg from 'pg';


const Pool = pg.Pool

dotenv.config(); 

// For production Database
const DATABASE_URL = process.env.POSTGRES_URL

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  define: {
    schema: 'public',
  },
});

// For local database
// const sequelize = new Sequelize(
//   process.env.POSTGRES_DATABASE,
//   process.env.POSTGRES_USER,
//   process.env.POSTGRES_PASSWORD,
//   {
//     host: process.env.POSTGRES_HOST,
//     port: 43425,
//     dialect: "postgres",
//     dialectOptions: {},
//     define: {
//       schema: 'public',
//     },
//   }
// );


    sequelize.authenticate().then(() => {
        console.log(`Database connected`)
    }).catch((err) => {
        console.log(err)
    })

    const db = {}
    db.Sequelize = Sequelize
    db.sequelize = sequelize

db.users = userModel(sequelize, DataTypes)

export default db