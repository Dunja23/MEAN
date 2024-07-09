import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Specijalizacija = new Schema({
    specijalizacija: {
        type: String}
})

export default mongoose.model('Specijalizacija', Specijalizacija, 'specijalizacije');