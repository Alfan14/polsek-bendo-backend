import dotenv from 'dotenv';
import pg from 'pg';

const Pool = pg.Pool

dotenv.config(); 


// For production database
const DATABASE_URL = process.env.POSTGRES_URL ;

const pool = new Pool({
  
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});


// For local database
// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL ,
//   user: process.env.POSTGRES_USER,
//   host: process.env.POSTGRES_HOST,
//   database: process.env.POSTGRES_DATABASE,
//   password: process.env.POSTGRES_PASSWORD,
//   port: 5432,
//   ssl: false  
// });

export default pool;