const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JsonDB, Config } = require('node-json-db');
const { uuid } = require('uuidv4');
const constant = require('../constant').constant;

const db = new JsonDB(new Config("users", true, true, '/'));

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await db.getData("/users");
  if (user) {
    if (!user[username]) {
      register(req, res)
    } else if (user && user[username] && !bcrypt.compareSync(password, user[username].password)) {
      res.status(401).json({ message: 'Invalid credentials' });
    } else {
      const token = jwt.sign({ id: user[username].id, username: user[username].username }, constant.secretKey);
      res.json({ token });
    }
  }
};

const register = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { id: uuid(), username, password: hashedPassword };
  await db.push('/users/' + username, newUser, false);
  const token = jwt.sign({ id: newUser.id, username }, constant.secretKey);
  res.json({ token });
};
