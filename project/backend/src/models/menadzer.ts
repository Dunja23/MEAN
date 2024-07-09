import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Menadzer = new Schema({
    ime: {
        type: String
    },
    prezime: {
        type: String
    },
    kor_ime: {
        type: String
    },
    lozinka: {
        type: String
    },
    mejl: {
        type: String
    }
})

export default mongoose.model('Menadzer', Menadzer, 'menadzeri');