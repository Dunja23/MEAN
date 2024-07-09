import express, { Router } from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import userRouter from './routes/user.routes';

const fs = require('fs');
const app = express();

var bodyParser = require('body-parser')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.connect("mongodb://127.0.0.1:27017/lekarskaordinacija2023")
mongoose.connection.once('open', () => {
    console.log("db connection ok")
})
const router = Router()

router.use('/user', userRouter)
app.use('/', router)

const path = require("path");
router.use('/uploads', express.static(path.join('./src/uploads')))
router.use('/galerija', express.static(path.join('./src/galerija')))


app.delete('/delete/:oldImage', (req, res) => {
    const fileToDelete = req.params.oldImage;
    const filePath = `src/uploads/${fileToDelete}`;

    fs.stat(filePath, (err, stats) => {
        if (err) {
            return res.json({ 'error': 'File not found' });
        }

        fs.unlink(filePath, (err)=>{
            if(err){
                return res.json({ 'error': 'Failed to delete file'});  
            }
            res.json({ 'data' : 'File Deleted Succesfully'})
        })
    })

})

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(4000, () => console.log(`Express server running on port 4000`));
