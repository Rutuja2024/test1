import express from 'express';
import pool from '../db.js';
const router = express.Router();

//GET A answer for a particular question id
// Working http://localhost:5000/quiz/answers/1
router.get('/:question_id', async (req, res) => {
  try {
    const { question_id } = req.params;

    // Query the database for the question with the specified ID
    const result = await pool.query('SELECT correct_option FROM quiz_answers WHERE question_id = $1', [question_id]);

    // If a question was found, return it
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Answer not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});



// Get all answers for a quiz_answers
router.get('/:game_id', async (req, res) => {
  const { game_id } = req.params;

  const query = `
    SELECT question_id , correct_option   FROM quiz_answers
    WHERE game_id = $1
  `;

  const values = [game_id];

  try {
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});



// Create a new answer for a answer
router.post('/', async (req, res) => {
  try {
    const {  game_id ,question_id , correct_option } = req.body;

    // Query the database for the answer  with the specified ID
    const result = await pool.query('INSERT INTO quiz_answers (game_id ,question_id ,correct_option) VALUES ($1, $2, $3)  RETURNING *', [game_id ,question_id ,correct_option]);
   
    if (result.rows.length > 0) {
      res.status(201).json(result.rows[0]);
    } else {
      res.status(500).send('Failed to insert quiz_answers');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});



// Update an existing answer by question id
//Working  http://localhost:5000/quiz/answers/1/1
router.put('/:game_id/:question_id', async (req, res) => {
  try {
    const { game_id, question_id } = req.params;
    const {correct_option } = req.body;
    const { rows } = await pool.query('UPDATE quiz_answers SET correct_option = $1 WHERE game_id = $2 AND question_id = $3 RETURNING *', [correct_option ,game_id, question_id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



// Delete a question by ID
//http://localhost:5000/quiz/answers/1/answers/1
router.delete('/:game_id/answers/:question_id', async (req, res) => {
  try {
    const { game_id, question_id } = req.params;
    await pool.query('DELETE FROM quiz_answers WHERE game_id = $1 AND question_id = $2', [game_id, question_id]);
    res.json({ message: 'Answer deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


export default router;