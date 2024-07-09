import * as express from 'express';
import Pacijent from '../models/pacijent'
import Registracija from '../models/registracija';
import Lekar from '../models/lekar';
import Pregled from '../models/pregled';
import Zakazan from '../models/zakazan';
import Izvestaj from '..//models/izvestaj'
import Spregled from '../models/spregled';
import Menadzer from '../models/menadzer';
import Specijalizacija from '../models/specijalizacija';

export class UserController {
    login = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;
        let type = req.body.type;

        if (type == 'pacijent') {
            Pacijent.findOne({ 'kor_ime': username, 'lozinka': password }, (err, user) => {
                if (err) console.log(err);
                else res.json(user)
            })
        } else {
            if (type == 'lekar') {
                Lekar.findOne({ 'kor_ime': username, 'lozinka': password }, (err, user) => {
                    if (err) console.log(err);
                    else res.json(user)
                })
            }
        }
    }

    mlogin = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;


        Menadzer.findOne({ 'kor_ime': username, 'lozinka': password }, (err, user) => {
            if (err) console.log(err);
            else res.json(user)
        })

    }

    checkUser = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let mejl = req.body.mejl;
        Pacijent.findOne({ 'kor_ime': username }, (err, user) => {
            if (!user) {
                Pacijent.findOne({ 'mejl': mejl }, (err, user) => {
                    if (!user) {
                        Lekar.findOne({ 'kor_ime': username }, (err, user) => {
                            if (!user) {
                                Lekar.findOne({ 'mejl': mejl }, (err, user) => {
                                    if (!user) {
                                        Registracija.findOne({
                                            $and: [{ $or: [{ 'kor_ime': username }, { 'mejl': mejl }] }, { 'odbijena': true }]
                                        }, (err, user) => {
                                            if (!user) {
                                                res.json({ 'message': 'ok' })
                                            }
                                            else res.json({ 'message': 'mejlilikor_ime' })
                                        })
                                    }
                                    else res.json({ 'message': 'mejl' })
                                })
                            }
                            else res.json({ 'message': 'kor_ime' })
                        })
                    }
                    else res.json({ 'message': 'mejl' })
                })
            }
            else res.json({ 'message': 'kor_ime' })
        })
    }


    requestRegistration = (req: express.Request, res: express.Response) => {
        if (!req['selectedImage']) req['selectedImage'] = "";
        Registracija.collection.insertOne({
            'kor_ime': req.body.username, 'slika': req['selectedImage'], 'ime': req.body.firstname, 'prezime': req.body.lastname,
            'lozinka': req.body.password, 'mejl': req.body.mejl, 'adresa': req.body.adress, 'kontakt': req.body.kontakt, 'odbijena': false
        })
        if (req['selectedImage'] == "") {
            res.json({ 'message': "profile_icon.jpg" })
        }
        else res.json({ 'message': req['selectedImage'] })
    }

    registrationLekar = (req: express.Request, res: express.Response) => {
        let licenca = parseInt(req.body.licenca);
        if (!req['selectedImage']) req['selectedImage'] = "";
        Lekar.collection.insertOne({
            'kor_ime': req.body.username, 'slika': req['selectedImage'], 'ime': req.body.firstname, 'prezime': req.body.lastname,
            'lozinka': req.body.password, 'mejl': req.body.mejl, 'adresa': req.body.adress, 'kontakt': req.body.kontakt,
            'specijalizacija': req.body.specijalizacija, 'ogranak': req.body.ogranak, 'licenca': licenca
        })
        if (req['selectedImage'] == "") {
            res.json({ 'message': "profile_icon.jpg" })
        }
        else res.json({ 'message': req['selectedImage'] })
    }

    getUser = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let type = req.body.type;
        if (type == 'pacijent') {
            Pacijent.findOne({ 'kor_ime': username }, (err, user) => {
                if (err) console.log(err);
                else res.json(user)
            })
        }
        else {
            if (type == 'lekar') {
                Lekar.findOne({ 'kor_ime': username }, (err, user) => {
                    if (err) console.log(err);
                    else res.json(user)
                })
            }
            else {
                Menadzer.findOne({ 'kor_ime': username }, (err, user) => {
                    if (err) console.log(err);
                    else res.json(user)
                })

            }
        }
    }

    checkPacijentPass = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;
        Pacijent.findOne({ $and: [{ 'kor_ime': username }, { 'lozinka': password }] }, (err, user) => {
            if (user) res.json({ 'message': 'ok' });
            else res.json({ 'message': '' });
        })
    }

    checkLekarPass = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;
        Lekar.findOne({ $and: [{ 'kor_ime': username }, { 'lozinka': password }] }, (err, user) => {
            if (user) res.json({ 'message': 'ok' });
            else res.json({ 'message': '' });
        })
    }

    changePassword = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;
        Pacijent.collection.updateOne({ 'kor_ime': username }, { $set: { 'lozinka': password } });
        Lekar.collection.updateOne({ 'kor_ime': username }, { $set: { 'lozinka': password } });
        res.json({ 'message': 'ok' });

    }

    updateProfileImage = (req: express.Request, res: express.Response) => {
        Pacijent.collection.updateOne({ 'kor_ime': req.body.username }, { $set: { 'slika': req['selectedImage'] } });
        Lekar.collection.updateOne({ 'kor_ime': req.body.username }, { $set: { 'slika': req['selectedImage'] } });
        res.json({ 'message': 'ok' });
    }

    getLekare = (req: express.Request, res: express.Response) => {
        Lekar.find({}, (err, users) => {
            if (err) console.log(err);
            else res.json(users);
        })
    }

    getPacijente = (req: express.Request, res: express.Response) => {
        Pacijent.find({}, (err, users) => {
            if (err) console.log(err);
            else res.json(users);
        })
    }

    getRegistracije = (req: express.Request, res: express.Response) => {
        Registracija.find({ 'odbijena': false }, (err, users) => {
            if (err) console.log(err);
            else res.json(users);
        })
    }

    pretraziLekare = (req: express.Request, res: express.Response) => {
        let regexPatternI = req.body.regexPatternI;
        let regexPatternP = req.body.regexPatternP;
        let regexPatternS = req.body.regexPatternS;
        Lekar.find({
            $and: [{ 'ime': { $regex: regexPatternI } }, { 'prezime': { $regex: regexPatternP } }, { 'specijalizacija': { $regex: regexPatternS } }]
        }, (err, users) => {
            if (err) console.log(err);
            else res.json(users);
        })
    }

    getPregledi = (req: express.Request, res: express.Response) => {
        Pregled.find({ $and: [{ 'lekar': req.body.username }, { 'odobren': true }] }, (err, users) => {
            if (err) console.log(err);
            else res.json(users);
        })
    }


    getZakazan = (req: express.Request, res: express.Response) => {
        Zakazan.find({ 'pacijent': req.body.username }, (err, users) => {
            if (err) console.log(err);
            else res.json(users);
        })

    }

    getSveZakazane = (req: express.Request, res: express.Response) => {
        Zakazan.find({}, (err, users) => {
            if (err) console.log(err);
            else res.json(users);
        })

    }

    getSveIzvestaje = (req: express.Request, res: express.Response) => {
        Izvestaj.find({}, (err, users) => {
            if (err) console.log(err);
            else res.json(users);
        })

    }

    otkaziPregled = (req: express.Request, res: express.Response) => {
        Zakazan.collection.deleteOne({ 'idZ': req.body.id });
        res.json({ 'message': 'ok' });
    }

    zakaziPregled = (req: express.Request, res: express.Response) => {
        let datum = new Date(req.body.datum);
        const hours = datum.getHours();
        const minutes = datum.getMinutes();
        datum.setUTCHours(hours);
        datum.setUTCMinutes(minutes);

        Zakazan.collection.insertOne({
            'idZ': req.body.idZ, 'lekar': req.body.lekar,
            'pacijent': req.body.pacijent, 'naziv': req.body.naziv, 'datum': datum
        });
        res.json({ 'message': 'ok' });
    }

    getZakazaneL = (req: express.Request, res: express.Response) => {
        Zakazan.find({ 'lekar': req.body.lekar }, (err, users) => {
            if (err) console.log(err);
            else res.json(users);
        })

    }

    getIzvestaje = (req: express.Request, res: express.Response) => {
        Izvestaj.find({ 'pacijent': req.body.username }, (err, users) => {
            if (err) console.log(err);
            else res.json(users);
        })
    }

    getZakazanL = (req: express.Request, res: express.Response) => {
        Zakazan.find({ 'lekar': req.body.username }, (err, users) => {
            if (err) console.log(err);
            else res.json(users);
        })

    }

    getSpreglede = (req: express.Request, res: express.Response) => {
        if (req.body.specijalizacija == 'svi') {
            Spregled.find({}, (err, users) => {
                if (err) console.log(err);
                else res.json(users);
            })
        } else {
            Spregled.find({ 'specijalizacija': req.body.specijalizacija }, (err, users) => {
                if (err) console.log(err);
                else res.json(users);
            })
        }
    }

    dodajPregled = (req: express.Request, res: express.Response) => {
        Spregled.collection.deleteOne({ 'naziv': req.body.naziv });
        Pregled.collection.insertOne({ 'lekar': req.body.username, 'naziv': req.body.naziv, 'trajanje': req.body.trajanje, 'cena': req.body.cena });
        res.json({ 'message': 'ok' });
    }

    getZakazaneBezIzvestaja = (req: express.Request, res: express.Response) => {
        let now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        now.setUTCHours(hours);
        now.setUTCMinutes(minutes);
        Zakazan.find({ $and: [{ 'lekar': req.body.lekar }, { 'pacijent': req.body.pacijent }, { 'datum': { $lte: now } }, { 'izvestaj': { $eq: false } }] }, (err, users) => {
            if (err) console.log(err);
            else res.json(users);
        })
    }

    setIzvestaj = (req: express.Request, res: express.Response) => {
        Zakazan.collection.updateOne({ 'idZ': req.body.idZ }, { $set: { 'izvestaj': true } });
        Izvestaj.collection.insertOne({
            'pacijent': req.body.pacijent, 'lekar': req.body.lekar, 'specijalizacija': req.body.specijalizacija,
            'datum': req.body.datum, 'vreme': req.body.vreme, 'razlog': req.body.razlog, 'dijagnoza': req.body.dijagnoza, 'terapija': req.body.terapija,
            'prep_datum': req.body.prep_datum, 'idI': req.body.idI, 'idZ': req.body.idZ
        });
        res.json({ 'message': 'ok' });
    }

    deleteUser = (req: express.Request, res: express.Response) => {
        let type = req.body.type;
        if (type == 'pacijent') {
            Pacijent.collection.deleteOne({ 'kor_ime': req.body.username });
            res.json({ 'message': 'ok' });
        } else {
            if (type == 'lekar') {
                Lekar.collection.deleteOne({ 'kor_ime': req.body.username });
                res.json({ 'message': 'ok' });
            }
        }
    }

    odbijRegistraciju = (req: express.Request, res: express.Response) => {
        Registracija.collection.updateOne({ 'kor_ime': req.body.username }, { $set: { 'odbijena': true } });
        res.json({ 'message': 'ok' });
    }

    prihvatiRegistraciju = (req: express.Request, res: express.Response) => {
        Pacijent.collection.insertOne({
            'kor_ime': req.body.kor_ime, 'ime': req.body.ime, 'prezime': req.body.prezime,
            'lozinka': req.body.lozinka, 'kontakt': req.body.kontakt, 'adresa': req.body.adresa, 'mejl': req.body.mejl, 'slika': req.body.slika
        });
        Registracija.collection.deleteOne({ 'kor_ime': req.body.kor_ime });
        res.json({ 'message': 'ok' });
    }

    dodajSpecijalizaciju = (req: express.Request, res: express.Response) => {
        Specijalizacija.collection.insertOne({ 'specijalizacija': req.body.spec });
        res.json({ 'message': 'ok' });
    }

    getPreglediM = (req: express.Request, res: express.Response) => {
        Pregled.find({}, (err, users) => {
            if (err) console.log(err);
            else res.json(users);
        })
    }

    deleteSP = (req: express.Request, res: express.Response) => {
        Spregled.collection.deleteOne({ 'naziv': req.body.naziv });
        res.json({ 'message': 'ok' });
    }

    getSpec = (req: express.Request, res: express.Response) => {
        Specijalizacija.find({}, (err, users) => {
            if (err) console.log(err);
            else res.json(users);
        })
    }

    dodajSP = (req: express.Request, res: express.Response) => {
        Spregled.collection.insertOne({
            'naziv': req.body.naziv, 'specijalizacija': req.body.specijalizacija,
            'trajanje': req.body.trajanje, 'cena': req.body.cena
        });
        res.json({ 'message': 'ok' });
    }

    azurirajSP = (req: express.Request, res: express.Response) => {
        Spregled.collection.updateOne({ 'naziv': req.body.naziv }, { $set: { 'trajanje': req.body.trajanje, 'cena': req.body.cena } });
        res.json({ 'message': 'ok' });
    }

    azurirajUserP = (req: express.Request, res: express.Response) => {
        Pacijent.collection.updateOne({ 'kor_ime': req.body.username }, { $set: { 'adresa': req.body.adresa, 'kontakt': req.body.kontakt } });
        res.json({ 'message': 'ok' });
    }

    azurirajUserL = (req: express.Request, res: express.Response) => {
        Lekar.collection.updateOne({ 'kor_ime': req.body.username }, {
            $set: {
                'adresa': req.body.adresa, 'kontakt': req.body.kontakt,
                'specijalizacija': req.body.specijalizacija, 'ogranak': req.body.ogranak, 'licenca': req.body.licenca
            }
        });
        res.json({ 'message': 'ok' });
    }


}