var mongoose = require('mongoose')

const connectionString = "mongodb://student:student123@cluster0-shard-00-00-hlah1.mongodb.net:27017,cluster0-shard-00-01-hlah1.mongodb.net:27017,cluster0-shard-00-02-hlah1.mongodb.net:27017/pet-tracker?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority" //input database link

let connection = mongoose.connection

mongoose.connect(connectionString, { useNewUrlParser: true })


connection.on('error', err => {
  console.error('[DATABASE ERROR]:', err)
})
//TODO why is this commentted out?
//confirm connection
// connection.once('open', () => {
//   console.log('connected to the database')
// })

module.exports = connection