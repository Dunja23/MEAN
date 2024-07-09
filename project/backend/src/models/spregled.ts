import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Spregled = new Schema({
    naziv: {
        type: String
    },
    specijalizacija:{
        type: String
    },
    trajanje: {
        type: Number
    },
    cena: {
        type: Number
    }
})

export default mongoose.model('Spregled', Spregled, 'spec_pregledi');