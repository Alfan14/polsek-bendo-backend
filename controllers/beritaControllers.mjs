import pool from "../db/index.mjs";

const getNews = (async (request, response) => {
  pool.query('SELECT * FROM news ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
});

const getNewsById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM news WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createNews = (request, response) => {
  const { title, slug, excerpt, content, author_id, category, url_gambar_unggulan, status, published_at , created_at, updated_at} = request.body

  pool.query(
    'INSERT INTO news (title, slug, excerpt, content, author_id, category, url_gambar_unggulan, status, published_at, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
    [title, slug, excerpt, content, author_id, category, url_gambar_unggulan, status, published_at, created_at, updated_at],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`News added with ID: ${results.insertId}`);
    });
}

const updateNews = (request, response) => {
  const id = parseInt(request.params.id)
  const { title, slug, excerpt, content, author_id, category, url_gambar_unggulan, status, published_at, created_at, updated_at } = request.body

  pool.query(
    'UPDATE news SET title = $1, slug = $2, excerpt = $3, content = $4, author_id = $5, category = $6, url_gambar_unggulan = $7, status = $8, published_at = $9, created_at = $10, updated_at = $11, published_at = $12 WHERE id = $13',
    [title, slug, excerpt, content, author_id, category, url_gambar_unggulan, ,status, published_at , created_at, updated_at, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`News modified with ID: ${id}`)
    }
  )
}

const patchNews = async (request, response) => {
    const id = parseInt(request.params.id);
    const { title, slug, excerpt, content, author_id, category, url_gambar_unggulan, status, published_at, created_at, updated_at } = request.body;

    const fields = [];
    const values = [];
    let valueIndex = 1;

     if (title) {
      fields.push(`title = $${valueIndex++}`);
      values.push(title);
    }
    if (slug) {
      fields.push(`slug = $${valueIndex++}`);
      values.push(slug);
    }
    if (excerpt) {
      fields.push(`excerpt = $${valueIndex++}`);
      values.push(excerpt);
    }
    if (content) {
      fields.push(`content = $${valueIndex++}`);
      values.push( content);
    }
    if (author_id) {
      fields.push(`author_id = $${valueIndex++}`);
      values.push(author_id);
    }
    if (category) {
      fields.push(`category = $${valueIndex++}`);
      values.push(category);
    }
    if (url_gambar_unggulan) {
      fields.push(`url_gambar_unggulan = $${valueIndex++}`);
      values.push(url_gambar_unggulan);
    }
    if (status) {
      fields.push(`status = $${valueIndex++}`);
      values.push(status);
    }
    if (published_at) {
      fields.push(`published_at = $${valueIndex++}`);
      values.push(published_at);
    }
    if (created_at) {
      fields.push(`created_at = $${valueIndex++}`);
      values.push( created_at);
    }
    if (updated_at) {
      fields.push(`updated_at = $${valueIndex++}`);
      values.push(updated_at);
    }
  
    if (fields.length === 0) {
      return response.status(400).json({ message: "No fields to update." });
    }

    values.push(id);
    const query = `UPDATE news SET ${fields.join(', ')} WHERE id = $${valueIndex}`;

    pool.query(query, values, (error, results) => {
      if (error) {
        return response.status(500).json({ message: "Update failed.", error });
      }
      response.status(200).send(`NEWS with ID: ${id} patched.`);
    });
  };

const deleteNews = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM news WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

export default {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  patchNews,
  deleteNews,
}