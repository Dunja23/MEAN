import express from 'express';
import { UserController } from '../controllers/user.controller';
const userRouter = express.Router();

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/uploads")
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        let filename = Date.now().toString()+ext
        req.selectedImage = filename
        cb(null, filename)
    }
})

const upload = multer({ storage: storage });

userRouter.route('/login').post(
    (req, res) => new UserController().login(req, res)
)

userRouter.route('/mlogin').post(
    (req, res) => new UserController().mlogin(req, res)
)

userRouter.route('/requestRegistration').post(
    upload.single('selectedImage'), (req, res) => new UserController().requestRegistration(req, res)
)

userRouter.route('/checkUser').post(
    (req, res) => new UserController().checkUser(req, res)
)

userRouter.route('/getUser').post(
    (req, res) => new UserController().getUser(req, res)
)

userRouter.route('/checkPacijentPass').post(
    (req, res) => new UserController().checkPacijentPass(req, res)
)

userRouter.route('/checkLekarPass').post(
    (req, res) => new UserController().checkLekarPass(req, res)
)


userRouter.route('/changePassword').post(
    (req, res) => new UserController().changePassword(req, res)
)

userRouter.route('/updateProfileImage').post(
    upload.single('selectedImage'), (req, res) => new UserController().updateProfileImage(req, res)
)

userRouter.route('/getLekare').post(
    (req, res) => new UserController().getLekare(req, res)
)

userRouter.route('/getPacijente').post(
    (req, res) => new UserController().getPacijente(req, res)
)

userRouter.route('/getRegistracije').post(
    (req, res) => new UserController().getRegistracije(req, res)
)

userRouter.route('/pretraziLekare').post(
    (req, res) => new UserController().pretraziLekare(req, res)
)

userRouter.route('/getPregledi').post(
    (req, res) => new UserController().getPregledi(req, res)
)

userRouter.route('/getZakazan').post(
    (req, res) => new UserController().getZakazan(req, res)
)

userRouter.route('/getSveZakazane').post(
    (req, res) => new UserController().getSveZakazane(req, res)
)

userRouter.route('/getSveIzvestaje').post(
    (req, res) => new UserController().getSveIzvestaje(req, res)
)

userRouter.route('/otkaziPregled').post(
    (req, res) => new UserController().otkaziPregled(req, res)
)

userRouter.route('/zakaziPregled').post(
    (req, res) => new UserController().zakaziPregled(req, res)
)

userRouter.route('/getZakazaneL').post(
    (req, res) => new UserController().getZakazaneL(req, res)
)
userRouter.route('/getIzvestaje').post(
    (req, res) => new UserController().getIzvestaje(req, res)
)

userRouter.route('/getZakazanL').post(
    (req, res) => new UserController().getZakazanL(req, res)
)

userRouter.route('/getSpreglede').post(
    (req, res) => new UserController().getSpreglede(req, res)
)

userRouter.route('/dodajPregled').post(
    (req, res) => new UserController().dodajPregled(req, res)
)

userRouter.route('/getZakazaneBezIzvestaja').post(
    (req, res) => new UserController().getZakazaneBezIzvestaja(req, res)
)

userRouter.route('/setIzvestaj').post(
    (req, res) => new UserController().setIzvestaj(req, res)
)

userRouter.route('/deleteUser').post(
    (req, res) => new UserController().deleteUser(req, res)
)

userRouter.route('/registrationLekar').post(
    upload.single('selectedImage'), (req, res) => new UserController().registrationLekar(req, res)
)

userRouter.route('/odbijRegistraciju').post(
    (req, res) => new UserController().odbijRegistraciju(req, res)
)

userRouter.route('/prihvatiRegistraciju').post(
    (req, res) => new UserController().prihvatiRegistraciju(req, res)
)

userRouter.route('/dodajSpecijalizaciju').post(
    (req, res) => new UserController().dodajSpecijalizaciju(req, res)
)

userRouter.route('/getPreglediM').post(
    (req, res) => new UserController().getPreglediM(req, res)
)

userRouter.route('/deleteSP').post(
    (req, res) => new UserController().deleteSP(req, res)
)

userRouter.route('/getSpec').post(
    (req, res) => new UserController().getSpec(req, res)
)

userRouter.route('/dodajSP').post(
    (req, res) => new UserController().dodajSP(req, res)
)

userRouter.route('/azurirajSP').post(
    (req, res) => new UserController().azurirajSP(req, res)
)

userRouter.route('/azurirajUserP').post(
    (req, res) => new UserController().azurirajUserP(req, res)
)

userRouter.route('/azurirajUserL').post(
    (req, res) => new UserController().azurirajUserL(req, res)
)





export default userRouter;