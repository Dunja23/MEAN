import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Lekar = new Schema({
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
    },
    adresa: {
        type: String
    },
    kontakt: {
        type: String
    },
    slika: {
        type: String
    },
    licenca: {
        type: Number
    },
    specijalizacija: {
        type: String
    },
    ogranak: {
        type: String
    }
})

export default mongoose.model('Lekar', Lekar, 'lekari');
