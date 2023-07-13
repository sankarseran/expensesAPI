const express = require("express");
const cors = require('cors');

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { authenticateToken } = require('./middleware/auth');
const authController = require('./controllers/auth');
const expensesRouter = require('./controllers/expenses');


app.post('/login', authController.login);

app.get("/people", authenticateToken, async (request, response) => { return response.send({'res': [1, 2, 3, 4, 5]})});// Expenses controller
app.use('/expenses', authenticateToken, expensesRouter);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
