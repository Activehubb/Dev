const express = require('express')
const connectDB = require('./config/db')
const app = express();


// initialize body parser
app.use(express.json({ extended: false }))
// init stopped


app.get('/', (req, res) => res.send('hello world'))


// DEFINE ROUTES
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/users', require('./routes/api/users'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

connectDB();
const PORT = process.env.PORT || 5001

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))