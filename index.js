const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const keys = require('./config/keys')
const app = express()
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
)
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())
require('./models/User')
require('./services/passport')
require('./routes/authRoutes')(app)
require('./routes/billingRoutes')(app)
require('./routes/surveyRoutes')(app)
mongoose.connect(keys.mongoURI)

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'))

  const path = require('path')
  app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname,'client', 'build','index.html'))
  })
}

const PORT = process.env.PORT || 5000

app.listen(PORT);