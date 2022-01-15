import express from "express"
const app = express()
const cors = require('cors')
require('dotenv').config()
const validator = require('validator')
const bodyParser = require('body-parser')
//const { format, parseISO } = require('date-fns')
const { connector } = require('./src/database.ts')


//a class with mongoose functionality to create, to query, and to remove
//need to pass a mongoose model
const { Query } = require('./src/model/generic')
const { Counter } = require('./src/model/counter')
const { objOrNull, cirteriaDate, toFromDate, queryOptions, regex } = require('./src/model/mongtools')

//log all request
//request object, response object, next function
const posthandler = (req: any, res: any, next: any) => {
  //log the request
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  // you need to declare, coz your server will get stuck
  next();
}
//status 404
const index = (req: any, res: any) => {
  res.json({ counter: 0 })
}

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(posthandler);


//will get the count from the db
const checkData = async (req: any, res: any, next: any) => {
  
  req.count = 0;
  //attach functions of generic to our MongoDB Model
  const modelcounter = new Query(Counter);
  //get the counter document from db
  try {
    const counter = await modelcounter.findByOptions({ value: regex('\\d') }, queryOptions("descending", 1, 0))
    //for debug
    /*console.log(counter)*/
    //default count to zero

    //check if we got something from our query
    if (counter?.length > 0) {
      //check what we got
      //is this a Number
      const count = counter[0].count

      if (!isNaN(count)) {
        req.count = count
        req.id = counter[0].id
      }
    } else {
      await modelcounter.createsave({ count: 0 })
    }
  } catch (error) { console.log(error) }


  next()
}

//will return the count
const sendData = (req: any, res: any) => {
  res.json({ count: req.count });
}

const addCount = async (req: any, res: any, next: any) => {
  const modelcounter = new Query(Counter);

  //get 'add' 'sub' or 'reset'
  const addsub = req.params.add
  // will validate if our param is 'add' 'sub' or 'reset'
  const isValidOperator = validator.matches(addsub, new RegExp('(add|sub|reset)', 'i'))
  if (isValidOperator) {
    let value = req.count
    //logic whether we will add subtract or reset
    if (addsub === 'add') value += 1
    else if (addsub === 'sub') value -= 1
    else value = 0

    const condition = { id: req.id }
    const update = { count: value }
    //update our db
    try {
      const changes = await modelcounter.findOneAndUpdate(condition, update)
      if (objOrNull(changes)) {
        req.count = value

      }
    } catch (error) { console.log(error) }
    //check whether we actually updated
    next() //move on
  } else res.json({ counter: 0 }) //zero will be given to non valid request
}


app.route('/api/counter/latest').get(checkData).get(sendData);
app.route('/api/counter/:add').get(checkData).get(addCount).get(sendData);
app.route('*').get(index).post(index);

const port = process.env.SERVERPORT || 5000
const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + port)
})
