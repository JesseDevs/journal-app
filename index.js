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
	let { MONGOUSER, MONGOPASSWORD, MONGOHOST, MONGOPORT } = process.env;

	let endpoint = `mongodb://${MONGOUSER}:${MONGOPASSWORD}@${MONGOHOST}:${MONGOPORT}`;

	console.log(endpoint)

	await mongoose.connect(endpoint);
}
railConnection().catch(err => console.log(err));

const dataSchema = new mongoose.Schema({
	heading: String,
	subheading: String,
	tags: [String],
	content: String,
});

const Entry = mongoose.model('Entry', dataSchema);

app.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}`);
});

app.get('/', async (req, res) => {
	const entries = await Entry.find();
	res.render('pages/index', { entries });
});

app.get('/edit', async (req, res) => {
	const entries = await Entry.find();
	res.render('pages/index', { entries });
});

app.post('/edit', async (req, res) => {
	const { username, password } = req.body;
	const entries = await Entry.find();
	let { USERNAME, PASSWORD } = process.env;

	if (username === `${USERNAME}` && password === `${PASSWORD}`) {
		res.render('pages/edit', {
			loggedIn: true,
			entries: entries
		});
	} else {
		res.render('pages/index', {
			loggedIn: false,
			message: "Wrong Information"
		});
	}
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



