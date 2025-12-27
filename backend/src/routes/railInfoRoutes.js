import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// For __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Load JSON data once
const stations = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/stations.json')));
const trains = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/trains.json')));
const schedules = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/schedules.json')));

// 1. Search Station
router.get('/stations', (req, res) => {
  const query = req.query.query?.toLowerCase() || '';
  const matches = stations.features
    .filter(s =>
      s.properties.name.toLowerCase().includes(query) ||
      s.properties.code.toLowerCase() === query ||
      (s.properties.address && s.properties.address.toLowerCase().includes(query))
    )
    .map(s => s.properties);

  if (matches.length > 0) {
    return res.json(matches);
  }

  res.status(404).json({ error: 'No matching stations found' });
});

// 2. Search Train
router.get('/trains', (req, res) => {
  const query = req.query.query?.toLowerCase() || '';

  const results = trains.filter(train =>
    train['Train Name'].toLowerCase().includes(query) ||
    train['Train No.'].toLowerCase() === query
  );

  if (results.length > 0) {
    return res.json(results);
  }

  res.status(404).json({ error: 'No matching trains found' });
});

// 3. Get Schedule by Train Number
router.get('/schedule/:trainNo', (req, res) => {
  const trainNo = req.params.trainNo;
  const results = schedules.filter(stop => stop.train_number === trainNo);

  if (results.length > 0) {
    const formatted = results.map(stop => ({
      station: stop.station_name,
      arrival: stop.arrival,
      departure: stop.departure,
      day: stop.day
    }));
    return res.json(formatted);
  }

  res.status(404).json({ error: 'Schedule not found for train number' });
});

export default router;
