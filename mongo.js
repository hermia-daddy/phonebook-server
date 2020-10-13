const mongoose = require('mongoose')



const personSchema = new mongoose.Schema({
    name:String,
    number:String
})

const password = process.argv[2]

const url = 
`mongodb+srv://fullstack:${password}@fullstack.cwdqz.azure.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true
})

const Person = mongoose.model('Person',personSchema)

if(process.argv.length === 3){
    Person.find({}).then(persons => {

        console.log('phonebooks')
        persons.map(person => console.log(person.name,' ',person.number))

        mongoose.connection.close()
    })
}

if(process.argv.length  === 5){
    const person = new Person(
        {
            name:process.argv[3],
            number:process.argv[4]
        }
    )
    
    person.save().then(result => {
        console.log('add ',result.name,' number',result.number,' to phonebook')
        mongoose.connection.close()
    })
}
