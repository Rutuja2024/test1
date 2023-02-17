import express from 'express';
import pool from '../db.js';
const router = express.Router();


router.get('/:game_id/:question_id', async (req, res) => {
    try {
      const { game_id, question_id } = req.params;
  
      // Query the database for the correct answer for the question with the specified ID
      const correctAnswerResult = await pool.query('SELECT correct_option FROM quiz_answers WHERE question_id = $1 AND game_id = $2', [question_id, game_id]);
  
      // Query the database for the user's answer for the question with the specified ID and game ID
      const userAnswerResult = await pool.query('SELECT user_answer FROM quiz_results WHERE question_id = $1 AND game_id = $2', [question_id, game_id]);
  
      // If both the correct and user's answers were found, compare them
      if (correctAnswerResult.rows.length > 0 && userAnswerResult.rows.length > 0) {
        const correctAnswer = correctAnswerResult.rows[0].correct_option;
        const userAnswer = userAnswerResult.rows[0].user_answer;
  
        // If the user's answer is correct, add 1 to their score
        let score = 0;
        if (userAnswer === correctAnswer) {
          score = 1;
        }
  
        // Update the user's score in the database
        const  get_user_id = await pool.query('SELECT user_id FROM quiz_results WHERE question_id = $1', [question_id]);
        const user_id = get_user_id.rows[0].user_id;
        await pool.query('UPDATE quiz_results SET score = score + $1 WHERE user_id = $2 AND game_id = $3', [score, user_id, game_id]);
  
        // Return a response indicating whether the user's answer was correct or incorrect
        if (userAnswer === correctAnswer) {
          res.send('Correct!');
        } else {
          res.send('Incorrect.');
        }
      } else {
        res.status(404).send('Answer not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  
  router.delete('/:game_id/results/:question_id', async (req, res) => {
    try {
      const { game_id, question_id } = req.params;
      await pool.query('DELETE FROM quiz_results WHERE game_id = $1 AND question_id = $2', [game_id, question_id]);
      res.json({ message: 'Results deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  export default router;