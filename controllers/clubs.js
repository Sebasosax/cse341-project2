const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const COLLECTION = 'clubs';

// Build a club object from the request body
const buildClub = (body) => ({
  name: body.name,
  city: body.city,
  country: body.country,
  league: body.league,
  stadium: body.stadium,
  founded: body.founded
});

// GET /clubs
const getAll = async (req, res) => {
  /*
    #swagger.tags = ['Clubs']
    #swagger.summary = 'Get all clubs'
    #swagger.responses[200] = {
      description: 'List of clubs',
      schema: [{ $ref: '#/definitions/Club' }]
    }
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    const clubs = await getDb().collection(COLLECTION).find().toArray();
    res.status(200).json(clubs);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving clubs', error: err.message });
  }
};

// GET /clubs/:id
const getSingle = async (req, res) => {
  /*
    #swagger.tags = ['Clubs']
    #swagger.summary = 'Get a club by id'
    #swagger.parameters['id'] = { description: 'MongoDB ObjectId of the club' }
    #swagger.responses[200] = {
      description: 'Club found',
      schema: { $ref: '#/definitions/Club' }
    }
    #swagger.responses[400] = { description: 'Invalid id format' }
    #swagger.responses[404] = { description: 'Club not found' }
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid club id format' });
    }
    const club = await getDb()
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.status(200).json(club);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving club', error: err.message });
  }
};

// POST /clubs
const createClub = async (req, res) => {
  /*
    #swagger.tags = ['Clubs']
    #swagger.summary = 'Create a new club'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Club data',
      required: true,
      schema: { $ref: '#/definitions/Club' }
    }
    #swagger.responses[201] = { description: 'Club created' }
    #swagger.responses[400] = { description: 'Validation error' }
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    const result = await getDb().collection(COLLECTION).insertOne(buildClub(req.body));
    res.status(201).json({ message: 'Club created', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating club', error: err.message });
  }
};

// PUT /clubs/:id
const updateClub = async (req, res) => {
  /*
    #swagger.tags = ['Clubs']
    #swagger.summary = 'Update an existing club'
    #swagger.parameters['id'] = { description: 'MongoDB ObjectId of the club' }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated club data (all fields)',
      required: true,
      schema: { $ref: '#/definitions/Club' }
    }
    #swagger.responses[200] = { description: 'Club updated' }
    #swagger.responses[400] = { description: 'Invalid id format or validation error' }
    #swagger.responses[404] = { description: 'Club not found' }
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid club id format' });
    }
    const result = await getDb()
      .collection(COLLECTION)
      .replaceOne({ _id: new ObjectId(req.params.id) }, buildClub(req.body));

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.status(200).json({ message: 'Club updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating club', error: err.message });
  }
};

// DELETE /clubs/:id
const deleteClub = async (req, res) => {
  /*
    #swagger.tags = ['Clubs']
    #swagger.summary = 'Delete a club'
    #swagger.parameters['id'] = { description: 'MongoDB ObjectId of the club' }
    #swagger.responses[200] = { description: 'Club deleted' }
    #swagger.responses[400] = { description: 'Invalid id format' }
    #swagger.responses[404] = { description: 'Club not found' }
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid club id format' });
    }
    const result = await getDb()
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.status(200).json({ message: 'Club deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting club', error: err.message });
  }
};

module.exports = { getAll, getSingle, createClub, updateClub, deleteClub };