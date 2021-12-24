const router = require("express").Router();
const sql = require("mysql");
const connection = require("../connectDB");
const { body, validationResult } = require("express-validator");
require("dotenv").config();
const auth = require("../auth_middleware");
/*
movie_id is interger
imdb_id is diffrerent
adult is boolean
*/

router.get("/add", auth, (request, response) => {});
router.get("/remove", auth, (request, response) => {});
