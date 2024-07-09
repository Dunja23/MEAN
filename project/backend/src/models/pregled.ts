import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Pregled = new Schema({
    naziv: {
        type: String
    },
    lekar: {
        type: String
    },
    trajanje: {
        type: Number
    },
    cena: {
        type: Number
    },
    odobren: {
        type: Boolean
    }
})

export default mongoose.model('Pregled', Pregled, 'pregledi');