import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('css'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

async function railConnection() {
	let { MONGO_BASE: base, MONGOUSER: user, MONGOPASSWORD: password, MONGOHOST: host, MONGOPORT: port, MONGO_DATABASE: database } = process.env;

	if (!base) {
		base = "mongodb"
	}

	let portConnection = "";
	if (port) {
		portConnection = ':' + port;
	}

	let databaseName = '';
	if (database) {
		databaseName = '/' + database;
	}

	let endpoint = `${base}://${user}:${password}@${host}${portConnection}${databaseName}`;

	await mongoose.connect(endpoint);
}
railConnection().catch(err => console.log(err));

const dataSchema = new mongoose.Schema({
	heading: String,
	subheading: String,
	tags: [String],
	entry: String,
});

const Entry = mongoose.model('Entry', dataSchema);

app.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}`);
});

app.get('/', (req, res) => {
	res.render('pages/index');
});

app.post('/api/add-data', (req, res) => {
	const entryData = new Entry(req.body);
	entryData.save((error) => {
		if (error) {
			res.send(error);
		} else {
			console.log('Data added successfully');
			res.redirect('/');
		}
	});
});



