import pool from "../../db/index.mjs";

const getNotes = (async (request, response) => {
  pool.query('SELECT * FROM notes ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
});

const getNotesById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM notes WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createNotes = (request, response) => {
  const { user_id, officer_id, officer_name, officer_note, date, time, related_field, correction_link } = request.body

  pool.query(
    'INSERT INTO notes (user_id, officer_id, officer_name, officer_note, date, time, related_field, correction_link) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [user_id, officer_id, officer_name, officer_note, date, time, related_field, correction_link],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Notes added with ID: ${results.insertId}`);
    });
}

const updateNotes = (request, response) => {
  const id = parseInt(request.params.id)
  const { user_id, officer_id, officer_name, officer_note, date, time, related_field, correction_link } = request.body

  pool.query(
    'UPDATE notes SET officer_id = $1, officer_name = $2, officer_note = $3, date = $4, time = $5, related_field = $6, correction_link = $7, user_id = $8  WHERE id = $8',
    [officer_id, officer_name, officer_note, date, time, related_field, correction_link, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Notes modified with ID: ${id}`)
    }
  )
}

const patchNotes = async (request, response) => {
    const id = parseInt(request.params.id);
    const { user_id, officer_id, officer_name, officer_note, date, time, related_field, correction_link } = request.body;

    const fields = [];
    const values = [];
    let valueIndex = 1;

    if (user_id) {
      fields.push(`user_id = $${valueIndex++}`);
      values.push(user_id);
    }
     if (officer_id) {
      fields.push(`officer_id = $${valueIndex++}`);
      values.push(officer_id);
    }
    if (officer_name) {
      fields.push(`officer_name = $${valueIndex++}`);
      values.push(officer_name);
    }
    if (officer_note) {
      fields.push(`officer_note = $${valueIndex++}`);
      values.push(officer_note);
    }
    if (date) {
      fields.push(`date = $${valueIndex++}`);
      values.push( date);
    }
    if (time) {
      fields.push(`time = $${valueIndex++}`);
      values.push(time);
    }
    if (related_field) {
      fields.push(`related_field = $${valueIndex++}`);
      values.push(related_field);
    }
    if (correction_link) {
      fields.push(`correction_link = $${valueIndex++}`);
      values.push(correction_link);
    }
  
    if (fields.length === 0) {
      return response.status(400).json({ message: "No fields to update." });
    }

    values.push(id);
    const query = `UPDATE notes SET ${fields.join(', ')} WHERE id = $${valueIndex}`;

    pool.query(query, values, (error, results) => {
      if (error) {
        return response.status(500).json({ message: "Update failed.", error });
      }
      response.status(200).send(`Notes with ID: ${id} patched.`);
    });
  };

const deleteNotes = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM notes WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

export default {
  getNotes,
  getNotesById,
  createNotes,
  updateNotes,
  patchNotes,
  deleteNotes,
}