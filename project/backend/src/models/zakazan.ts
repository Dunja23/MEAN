import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Zakazan = new Schema({
    naziv: {
        type: String
    },
    lekar: {
        type: String
    },
    pacijent: {
        type: String
    },
    datum: {
        type: Date
    },
    idZ: {
        type: Number
    },
    izvestaj: {
        type: Boolean
    }
})

export default mongoose.model('Zakazan', Zakazan, 'zakazani_pregledi');