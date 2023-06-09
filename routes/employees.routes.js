const express = require('express');
const router = express.Router();
const Employee = require('../models/employees.model');

router.get('/employees', async (req, res) => {
  try {
    res.json(await Employee.find());
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/employees/random', async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const empl = await Employee.findOne().skip(rand);
    if (!empl) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(empl);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/employees/:id', async (req, res) => {
  try {
    const empl = await Employee.findById(req.params.id);
    if (!empl) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(empl);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post('/employees', async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const newEmployee = new Employee({ firstName, lastName });
    await newEmployee.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put('/employees/:id', async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const empl = await Employee.findById(req.params.id);
    if (empl) {
      await Employee.updateOne(
        { _id: req.params.id },
        { $set: { firstName: firstName, lastName: lastName } }
      );
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.delete('/employees/:id', async (req, res) => {
  try {
    const empl = await Employee.findById(req.params.id);
    if (empl) {
      await Employee.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
