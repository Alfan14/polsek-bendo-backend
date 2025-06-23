import {Sequelize, DataTypes} from 'sequelize';
import userModel from '../models/userModel.mjs'; 
import dotenv from 'dotenv';
import pg from 'pg';


const Pool = pg.Pool

dotenv.config(); 

const sequelize = new Sequelize( {
  connectionString: process.env.POSTGRES_URL,
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
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