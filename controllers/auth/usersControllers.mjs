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
  const { username, email, password, role, createdAt, updatedAt, profile_picture, ktp } = request.body

  pool.query(
    'INSERT INTO users (username, email, password, role, created_at, updated_at, profile_picture, ktp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 )',
    [username, email, password, role, createdAt, updatedAt, profile_picture, ktp],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.insertId}`);
    });
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { username, email, password, role, createdAt, updatedAt, profile_picture, ktp } = request.body

  pool.query(
    'UPDATE users SET username = $1, email = $2 , password = $3 , role = $4 , createdAt = $5, updatedAt = $6 , profile_picture = $7 , ktp = $8 WHERE id = $9',
    [username, email, password, role, , createdAt, updatedAt, profile_picture, ktp, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const patchReport = async (request, response) => {
    const id = parseInt(request.params.id);
    const { username, email, password, role, createdAt, updatedAt, profile_picture, ktp } = request.body;

    const fields = [];
    const values = [];
    let valueIndex = 1;

     if (username) {
      fields.push(`username = $${valueIndex++}`);
      values.push(username);
    }

    if (email) {
      fields.push(`email = $${valueIndex++}`);
      values.push(email);
    }
    if (password) {
      fields.push(`password = $${valueIndex++}`);
      values.push(password);
    }
    if (role) {
      fields.push(`role = $${valueIndex++}`);
      values.push(role);
    }
    if (createdAt) {
      fields.push(`createdAt = $${valueIndex++}`);
      values.push(createdAt);
    }
    if (updatedAt) {
      fields.push(`updatedAt = $${valueIndex++}`);
      values.push(updatedAt);
    }

    if (profile_picture) {
      fields.push(`profile_picture = $${valueIndex++}`);
      values.push(profile_picture);
    }

    if (ktp) {
      fields.push(`ktp = $${valueIndex++}`);
      values.push(ktp);
    }
    

    if (fields.length === 0) {
      return response.status(400).json({ message: "No fields to update." });
    }

    values.push(id);
    const query = `UPDATE community_complaints SET ${fields.join(', ')} WHERE id = $${valueIndex}`;

    pool.query(query, values, (error, results) => {
      if (error) {
        return response.status(500).json({ message: "Update failed.", error });
      }
      response.status(200).send(`PM with ID: ${id} patched.`);
    });
  };


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