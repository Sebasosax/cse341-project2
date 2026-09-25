const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const COLLECTION = 'players';

// GET /players
const getAll = async (req, res) => {
  /*
    #swagger.tags = ['Players']
    #swagger.summary = 'Get all players'
    #swagger.responses[200] = {
      description: 'List of players',
      schema: [{ $ref: '#/definitions/Player' }]
    }
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    const players = await getDb().collection(COLLECTION).find().toArray();
    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving players', error: err.message });
  }
};

// GET /players/:id
const getSingle = async (req, res) => {
  /*
    #swagger.tags = ['Players']
    #swagger.summary = 'Get a player by id'
    #swagger.parameters['id'] = { description: 'MongoDB ObjectId of the player' }
    #swagger.responses[200] = {
      description: 'Player found',
      schema: { $ref: '#/definitions/Player' }
    }
    #swagger.responses[400] = { description: 'Invalid id format' }
    #swagger.responses[404] = { description: 'Player not found' }
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid player id format' });
    }
    const player = await getDb()
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.status(200).json(player);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving player', error: err.message });
  }
};

// POST /players
const createPlayer = async (req, res) => {
  /*
    #swagger.tags = ['Players']
    #swagger.summary = 'Create a new player'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Player data',
      required: true,
      schema: { $ref: '#/definitions/Player' }
    }
    #swagger.responses[201] = { description: 'Player created' }
    #swagger.responses[400] = { description: 'Validation error' }
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    const player = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      position: req.body.position,
      jerseyNumber: req.body.jerseyNumber,
      birthDate: req.body.birthDate,
      birthPlace: req.body.birthPlace,
      currentClub: req.body.currentClub,
      internationalCaps: req.body.internationalCaps,
      internationalGoals: req.body.internationalGoals,
      worldCupWinner: req.body.worldCupWinner
    };

    const result = await getDb().collection(COLLECTION).insertOne(player);
    res.status(201).json({ message: 'Player created', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating player', error: err.message });
  }
};

module.exports = { getAll, getSingle, createPlayer };