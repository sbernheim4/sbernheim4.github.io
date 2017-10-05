require('dotenv').config();

const express = require('express');
const router = express.Router();
const path = require('path');
const MongoClient = require('mongodb').MongoClient

var bodyParser = require('body-parser');

const url = process.env.DB_URI;

MongoClient.connect(url, (err, database) => {
	if (err) throw err;
	db = database;
	router.get('/', (req, res) => {
		db.collection('blog').find({}).toArray( (err, result) => {
			if (err) throw err;
			const html = generateHTML(result)
			res.send(html);
		});
	});
});


function generateHTML(records) {
	records = records.reverse();
	let html = `
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="UTF-8" />
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
				<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
				<meta name="theme-color" content="#3c3c3c">
				<title>Samuel Bernheim</title>

				<!-- My Icon -->
				<link rel="icon" href="icon144x144.png">

				<!-- My Manifest.json -->
				<link rel="manifest" href="manifest.json">

				<!-- Google Analytics tracking code -->
				<meta name="google-site-verification" content="zHcVBbY7cgsbEuhwVpBJXUmxIoOJVjyx7OFqxmUequM" />
				<title>Welcome to my Blog</title>
				<link rel="stylesheet" href="index.css">
			</head>

			<body class='blog'>
				<div class='blog__landing-page'>
					<h1>Welcome to my Blog</h1>
				</div>
				<div class='articles'>
					${records.map( r =>
					`<div class='article'>
						<h2 class='article__title'>${r.title}</h2>
						${r.image !== undefined ? `<img src=${r.image}` : ``}
						<p class='article__text'>${r.text}</p>
					</div>`).join(``)}
				</div>
			</body>
		</html>
		`;

	return html;
}

module.exports = router;