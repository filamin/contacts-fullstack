const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

//Middleware
app.use(bodyParser.json());
app.use(cors());

const contacts = require('./routes/api/contacts');

app.use('/api/contacts', contacts);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server started on port ${port}`));


