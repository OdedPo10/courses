const express = require('express');
const db = require('../model/db');
const router = express.Router();

///////SIGN UP TO A COURSE//////
router.post('/addCourse', async (req, res) => {
  const subject = req.body.subject;
  const user_id = req.body.user_id;

  try {
    //Finding the subject id by the given subject name//
    let subject_id = await db.query(
      `SELECT subject_id FROM subjects WHERE subject = $1`,
      [subject]
    );
    subject_id = subject_id.rows[0].subject_id;

    //Checking if user alredy signed to a specific subject//
    let isExist = await db.query(
      `SELECT COUNT (*) FROM courses WHERE user_id = $1 AND subject_id = $2`,
      [user_id, subject_id]
    );

    if (isExist.rows[0].count > 0) {
      res.status(400).send(`you are alredy signed up to ${subject}`);
      return;
    }

    //Checking how many students are in the requierd course//
    let count = await db.query(
      `SELECT COUNT(*) FROM courses WHERE subject_id = $1`,
      [subject_id]
    );
    count = count.rows[0].count;

    let courseNum = Math.floor(count / 22) + 1;
    courseNum = courseNum == 0 ? 1 : courseNum;

    //Check if there is free space in one of the courses
    let result = '';
    for (i = 1; i <= courseNum; i++) {
      let count2 = await db.query(
        `SELECT COUNT(*) FROM courses WHERE subject_id = $1 AND name =$2`,
        [subject_id, subject + i]
      );
      count2 = count2.rows[0].count;
      if (count2 < 22) {
        courseNum = i;
        result = await db.query(
          `INSERT INTO courses (name,user_id,subject_id) VALUES ($1,$2,$3) returning *`,
          [subject + courseNum, user_id, subject_id]
        );
        break;
      } else if (i == courseNum) {
        result = await db.query(
          `INSERT INTO courses (name,user_id,subject_id) VALUES ($1,$2,$3) returning *`,
          [subject + courseNum, user_id, subject_id]
        );
      }
    }

    res.send(result.rows[0]);
  } catch (error) {
    res.send(error.message);
  }
});

////////DELETE USER COURSE//////
router.post('/deleteCourse', async (req, res) => {
  const subject = req.body.subject;
  const user_id = req.body.user_id;

  try {
    //Finding the subject id by the given subject name//
    let subject_id = await db.query(
      `SELECT subject_id FROM subjects WHERE subject = $1`,
      [subject]
    );
    subject_id = subject_id.rows[0].subject_id;

    //Checking if user alredy signed to a specific subject//
    let isExist = await db.query(
      `SELECT COUNT (*) FROM courses WHERE user_id = $1 AND subject_id = $2`,
      [user_id, subject_id]
    );

    if (isExist.rows[0].count > 0) {
      await db.query(
        `DELETE FROM courses WHERE user_id = $1 AND subject_id = $2`,
        [user_id, subject_id]
      );
      return res.send(`you are no longer participate in ${subject} course`);
    }
    res.status(400).send(`you have not signed to ${subject}`);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
