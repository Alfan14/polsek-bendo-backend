import pool from "../../db/index.mjs";

const getUsers = (async (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
});

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { username, email, password, role, createdAt, updatedAt, profile_picture } = request.body

  pool.query(
    'INSERT INTO users (username, email, password, role, created_at, updated_at, profile_picture) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [username, email, password, role, createdAt, updatedAt, profile_picture],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.insertId}`);
    });
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { username, email, password, role, createdAt, updatedAt, profile_picture } = request.body

  pool.query(
    'UPDATE users SET username = $1, email = $2 , password = $3 , role = $4 , createdAt = $5, updatedAt = $6 , profile_picture = $7 WHERE id = $8',
    [username, email, password, role, , createdAt, updatedAt, profile_picture, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}