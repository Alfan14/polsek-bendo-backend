import pool from "../../db/index.mjs";

const getSlks = (async (request, response) => {
  pool.query('SELECT * FROM lost_report_letter ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
});

const getSlkById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM lost_report_letter WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createSlk = (request, response) => {
  const { user_id, reporter_name, contact_reporter, item_type, date_lost,  chronology, status_handling } = request.body

  pool.query(
    'INSERT INTO lost_report_letter (user_id, reporter_name, contact_reporter, item_type, date_lost,  chronology, status_handling) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [user_id, reporter_name, contact_reporter, item_type, date_lost,  chronology, status_handling],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.insertId}`);
    });
}

const updateSlk = (request, response) => {
  const id = parseInt(request.params.id)
  const {  police_number, status_handling, date_closed } = request.body

  pool.query(
    'UPDATE lost_report_letter SET  police_number = $1,  status_handling = $2, date_closed = $3 WHERE id = $4',
    [ police_number,  status_handling, date_closed, id ],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}


const patchSik = async (request, response) => {
    const id = parseInt(request.params.id);
    const { user_id, reporter_name, contact_reporter, item_type, date_lost,  chronology, status_handling } = request.body;

    const fields = [];
    const values = [];
    let valueIndex = 1;

     if (user_id) {
      fields.push(`user_id = $${valueIndex++}`);
      values.push(user_id);
    }
    if (reporter_name) {
      fields.push(`reporter_name = $${valueIndex++}`);
      values.push(reporter_name);
    }
    if (contact_reporter) {
      fields.push(`contact_reporter = $${valueIndex++}`);
      values.push(contact_reporter);
    }
    if (item_type) {
      fields.push(`item_type = $${valueIndex++}`);
      values.push( item_type);
    }
    if (date_lost) {
      fields.push(`date_lost = $${valueIndex++}`);
      values.push(date_lost);
    }
    if (chronology) {
      fields.push(`chronology = $${valueIndex++}`);
      values.push(chronology);
    }
    if (status_handling) {
      fields.push(`status_handling = $${valueIndex++}`);
      values.push(status_handling);
    }
  
    if (fields.length === 0) {
      return response.status(400).json({ message: "No fields to update." });
    }

    values.push(id);
    const query = `UPDATE lost_report_letter SET ${fields.join(', ')} WHERE id = $${valueIndex}`;

    pool.query(query, values, (error, results) => {
      if (error) {
        return response.status(500).json({ message: "Update failed.", error });
      }
      response.status(200).send(`SIK with ID: ${id} patched.`);
    });
  };


const deleteSlk = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM lost_report_letter WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

export default {
  getSlks,
  getSlkById,
  createSlk,
  updateSlk,
  patchSik,
  deleteSlk,
}