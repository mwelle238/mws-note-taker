const notes = require('express').Router();
const uuid = require('../helpers/uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// GET Route for a specific note -- not used in html/js, tested with insomnia
notes.get('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});

// DELETE Route for a specific note
notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);

      // Save array
      writeToFile('./db/db.json', result);

      // Response shows note deleted
      res.json(`Item ${noteId} has been DELETED 🗑️`);
    });
});

// POST Route for a new UX/UI note
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body.title && req.body.text) {
    const newnote = {
      title,
      text,
      id: uuid()
    };

    readAndAppend(newnote, './db/db.json');
    res.json(`note added successfully 🚀`);
  } else {
    res.error('ERROR: Missing title and/or text');
  }
});

module.exports = notes;
