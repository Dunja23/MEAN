import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Izvestaj = new Schema({
    pacijent:{
        type: String
    },
    specijalizacija: {
        type: String
    },
    lekar: {
        type: String
    },
    vreme: {
        type: String
    },
    datum: {
        type: Date
    },
    idI: {
        type: Number
    },
    idZ: {
        type: Number
    },
    prep_datum: {
        type: Date
    },
    razlog: {
        type: String
    },
    terapija: {
        type: String
    },
    dijagnoza: {
        type: String
    }
})

export default mongoose.model('Izvestaj', Izvestaj, 'izvestaji');