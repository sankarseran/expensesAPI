const { JsonDB, Config } = require('node-json-db');
const { uuid } = require('uuidv4');
const express = require('express');
const router = express.Router();

const db = new JsonDB(new Config("expenses", true, true, '/'));

// Get all expenses
router.get('/', async (req, res) => {
  const expenses = await db.getData("/expenses");
  let expensesList = [];
  if (expenses) {
    expensesList = expenses[req?.user?.username] ? expenses[req?.user?.username] : [];
  }
  res.json(expensesList);
});

// Create a new expense
router.post('/', async (req, res) => {
  const { date, category, description, amount } = req.body;
  const newExpense = { id: uuid(), date, description, category, amount };
  const existingExpenses = await db.getData("/expenses");
  const expensesList = existingExpenses[req.user.username] ? existingExpenses[req.user.username] : []
  if (!expensesList.length) {
    await db.push(`/expenses/${req?.user?.username}[${0}]`.toString(), newExpense, true);
  } else {
    await db.push(`/expenses/${req?.user?.username}[]`.toString(), newExpense, true);
  }

  res.status(201).json(newExpense);
}); 

// Update an expense
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { date, description, category, amount } = req.body;
  db.getIndex("/expenses/" + req?.user?.username, id)
  .then((index) => {
    if (index === -1) {
      res.status(404).json({ message: 'Expense not found' });
    } else {
      db.push(`/expenses/${req?.user?.username}[${index}]`, 
        { id, date, description, category, amount }, true);
      res.json({ id, date, description, category, amount });
    }
  }).catch((err) => {
    console.log('err:: ', err)
    res.status(404).json({ message: 'Expense not found' });
  });
});

// Update an expense
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.getIndex("/expenses/" + req?.user?.username, id).then(async (index) => {
  if (index === -1) {
    res.status(404).json({ message: 'Expense not found' });
  } else {
    await db.delete(`/expenses/${req?.user?.username}[${index}]`);
    res.json({ success: true, message: 'deleted successfully.'});
  }
  }).catch((err) => {
    console.log('err:: ', err)
    res.status(404).json({ message: 'Expense not found' });
  });
});

module.exports = router;
