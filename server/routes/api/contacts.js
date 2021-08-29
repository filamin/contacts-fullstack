const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

//Get contacts
router.get('/',async (req, res) => {
    const contacts = await loadContactsCollection();
    res.send(await  contacts.find({}).toArray());
});

//Add contact
router.post('/', async (req, res) => {
    const contacts = await loadContactsCollection();
    await contacts.insertOne({
        user_name: req.body.user_name,
        first_name: req.body.first_name,
        second_name: req.body.second_name,
        phone: req.body.phone,
        email: req.body.email,
        additional_info: req.body.additional_info,
    })
    res.status(201).send();
})

//Edit contact
router.put('/:id', async (req, res) => {
    const contacts = await loadContactsCollection();
    const params = {};
    for (const field in req.body) {
        params[field] = req.body[field];
    }
    await contacts.updateOne( { _id: new mongodb.ObjectId(req.params.id) }, { $set: params });
    res.status(201).send();
})

//Delete contact
router.delete('/:id', async (req, res) => {
    const contacts = await loadContactsCollection();
    await contacts.deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
    res.status(200).send();
})

async function loadContactsCollection() {
    const client = await mongodb.MongoClient.connect(
        'mongodb+srv://fisker:12345@contacts-fullstack-clus.q6gmo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        {
            useNewUrlParser: true
        }
    );

    return client.db('contacts-fullstack')
        .collection('contacts');
};


module.exports = router;