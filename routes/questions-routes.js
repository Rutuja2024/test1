import express from 'express';
import pool from '../db.js';
const router = express.Router();


// Get a single question by ID
//http://localhost:5000/quiz/questions/2/onequestion
router.get('/:question_id/onequestion', async (req, res) => {
    try {
      const { question_id } = req.params;
  
      // Query the database for the question with the specified ID
      const result = await pool.query('SELECT question , option1, option2 , option3, option4 FROM quiz_questions WHERE question_id = $1', [question_id]);
  
      // If a question was found, return it
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).send('Question not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });





router.get('/:game_id/questions', async (req, res) => {
  const { game_id } = req.params;
  const { count } = req.query;

  const query = `
    SELECT question , option1, option2 , option3, option4   FROM quiz_questions
    WHERE game_id = $1
    ORDER BY random()
    LIMIT $2
  `;

  const values = [game_id, count];

  try {
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

//Get Random questions from question with specific game id
// Working http://localhost:5000/quiz/questions/1/2
router.get('/:game_id/:count', async (req, res) => {
  const { game_id , count } = req.params;

  const query = `
    SELECT question , option1, option2 , option3, option4   FROM quiz_questions
    WHERE game_id = $1
    ORDER BY random()
    LIMIT $2
  `;

  const values = [game_id, count];

  try {
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});



// Get all questions for a quiz
//Not Working
// router.post('/:game_id/allquestions', async (req, res) => {
//   try {
//     const { game_id } = req.params;

//     // Query the database for the question with the specified ID
//     const result = await pool.query('SELECT question , option1, option2 , option3, option4 FROM quiz_questions WHERE game_id = $1', [  game_id ]);
   
//     if (result.rows.length > 0) {
//       res.status(201).json(result.rows[0]);
//     } else {
//       res.status(500).send('Failed to Fetch question');
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// });




// Working
// Create a new question for a quiz
router.post('/create_question', async (req, res) => {
  try {
    const {  game_id , question, option1, option2, option3, option4 } = req.body;

    // Query the database for the question with the specified ID
    const result = await pool.query('INSERT INTO quiz_questions ( game_id , question, option1, option2, option3, option4) VALUES ($1, $2, $3, $4, $5 , $6 )  RETURNING *', [  game_id , question, option1, option2, option3, option4]);
   
    if (result.rows.length > 0) {
      res.status(201).json(result.rows[0]);
    } else {
      res.status(500).send('Failed to insert question');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});



// Update an existing question by ID
//Working  http://localhost:5000/quiz/question/1/1
router.put('/:game_id/:question_id', async (req, res) => {
  try {
    const { game_id, question_id } = req.params;
    const { question , option1 , option2 , option3 , option4 } = req.body;
    const { rows } = await pool.query('UPDATE quiz_questions SET question = $1, option1 = $2 , option2  = $3 ,option3 = $4 ,option4 = $5 WHERE game_id = $6 AND question_id = $7 RETURNING *', [question ,option1 , option2 , option3 , option4, game_id, question_id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



// Delete a question by ID
//Working  Wont Work since question_id is refrenced in answer and result table
router.delete('/:game_id/questions/:question_id', async (req, res) => {
  try {
    const { game_id, question_id } = req.params;
    await pool.query('DELETE FROM quiz_questions WHERE game_id = $1 AND question_id = $2', [game_id, question_id]);
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


export default router;