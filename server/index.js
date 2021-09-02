const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//Middleware
app.use(bodyParser.json());
app.use(cors());

const contacts = require('./routes/api/contacts');
const auth = require('./routes/api/auth');

app.use('/api/contacts', contacts);
app.use('/api/auth', auth);

//Handle prod
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/public/'));
  //SPA
  app.get(/.*/, (res, req) => res.sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 4000;

const start = async() => {
  try {
    await mongoose.connect(
      'mongodb+srv://fisker:12345@contacts-fullstack-clus.q6gmo.mongodb.net/contacts-fullstack?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
      },
      () => app.listen(port, () => console.log(`Server started on port ${port}`))
    );
  } catch (e) {
    console.log(e);
  }
};

start();
