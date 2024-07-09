import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Registracija from './models/registracija';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  uri = "http://localhost:4000/user";

  login(username: string, password: string, tip: string) {
    let data = {
      username: username, password: password, type: tip
    }
    return this.http.post(`${this.uri}/login`, data)
  }

  mlogin(username: string, password: string) {
    let data = {
      username: username, password: password
    }
    return this.http.post(`${this.uri}/mlogin`, data)
  }

  requestRegistration(firstnameForm: string, lastnameForm: string, usernameForm: string,
    passwordForm: string, mejlForm: string, adressForm: string, kontaktForm: string, selectedImage: File) {
    const formData = new FormData();
    formData.append("selectedImage", selectedImage);
    formData.append("firstname", firstnameForm);
    formData.append("lastname", lastnameForm);
    formData.append("username", usernameForm);
    formData.append("password", passwordForm);
    formData.append("mejl", mejlForm);
    formData.append("adress", adressForm);
    formData.append("kontakt", kontaktForm);
    return this.http.post(`${this.uri}/requestRegistration`, formData)

  }

  registrationLekar(firstnameForm: string, lastnameForm: string, usernameForm: string,
    passwordForm: string, mejlForm: string, adressForm: string, kontaktForm: string, specijalizacijaForm: string, ogranakForm: string,
    licencaForm: number, selectedImage: File) {
    const formData = new FormData();
    const licenca = `${licencaForm}`;
    formData.append("selectedImage", selectedImage);
    formData.append("firstname", firstnameForm);
    formData.append("lastname", lastnameForm);
    formData.append("username", usernameForm);
    formData.append("password", passwordForm);
    formData.append("mejl", mejlForm);
    formData.append("adress", adressForm);
    formData.append("kontakt", kontaktForm);
    formData.append("specijalizacija", specijalizacijaForm);
    formData.append("ogranak", ogranakForm);
    formData.append("licenca", licenca);
    return this.http.post(`${this.uri}/registrationLekar`, formData)

  }

  checkUser(username: string, mejl: string) {
    let data = {
      username: username, mejl: mejl
    }
    return this.http.post(`${this.uri}/checkUser`, data)

  }

  getUser(username: string, type: string) {
    let data = {
      username: username, type: type
    }
    return this.http.post(`${this.uri}/getUser`, data)

  }

  checkPacijentPass(username: string, password: string) {
    let data = {
      username: username,
      password: password
    }
    return this.http.post(`${this.uri}/checkPacijentPass`, data)

  }

  checkLekarPass(username: string, password: string) {
    let data = {
      username: username,
      password: password
    }
    return this.http.post(`${this.uri}/checkLekarPass`, data)

  }

  changePassword(username: string, password: string) {
    let data = {
      username: username,
      password: password
    }
    return this.http.post(`${this.uri}/changePassword`, data)
  }

  updateProfileImage(username: string, Image: File) {
    const formData = new FormData();
    formData.append("selectedImage", Image);
    formData.append("username", username)
    return this.http.post<any>(`${this.uri}/updateProfileImage`, formData);

  }

  getLekare() {
    return this.http.post(`${this.uri}/getLekare`, '')
  }

  getPacijente() {
    return this.http.post(`${this.uri}/getPacijente`, '')
  }

  getRegistracije() {
    return this.http.post(`${this.uri}/getRegistracije`, '')
  }

  pretraziLekare(regexPatternI: string, regexPatternP: string, regexPatternS: string) {
    let data = {
      regexPatternI: regexPatternI,
      regexPatternP: regexPatternP,
      regexPatternS: regexPatternS,

    }
    return this.http.post(`${this.uri}/pretraziLekare`, data)
  }

  getPregledi(username: string) {
    let data = {
      username: username
    }
    return this.http.post(`${this.uri}/getPregledi`, data)
  }

  getZakazan(username: string) {
    let data = {
      username: username
    }
    return this.http.post(`${this.uri}/getZakazan`, data)
  }

  getSveZakazane() {
    return this.http.post(`${this.uri}/getSveZakazane`, '')
  }

  getSveIzvestaje() {
    return this.http.post(`${this.uri}/getSveIzvestaje`, '')
  }

  otkaziPregled(id: number) {
    let data = {
      id: id
    }
    return this.http.post(`${this.uri}/otkaziPregled`, data)
  }

  zakaziPregled(idZ: number, lekar: string, pacijent: string, naziv: string, datum: Date) {
    let data = {
      idZ: idZ,
      lekar: lekar,
      pacijent: pacijent,
      naziv: naziv,
      datum: datum
    }
    return this.http.post(`${this.uri}/zakaziPregled`, data)
  }

  getZakazaneL(lekar: string) {
    let data = {
      lekar: lekar
    }
    return this.http.post(`${this.uri}/getZakazaneL`, data)

  }

  getIzvestaje(username: string) {
    let data = {
      username: username
    }
    return this.http.post(`${this.uri}/getIzvestaje`, data)
  }

  getZakazanL(username: string) {
    let data = {
      username: username
    }
    return this.http.post(`${this.uri}/getZakazanL`, data)
  }

  getSpreglede(specijalizacija: string) {
    let data = {
      specijalizacija: specijalizacija
    }
    return this.http.post(`${this.uri}/getSpreglede`, data)
  }

  dodajPregled(naziv: string, username: string, trajanje: number, cena: number) {
    let data = {
      naziv: naziv,
      username: username,
      trajanje: trajanje,
      cena: cena

    }
    return this.http.post(`${this.uri}/dodajPregled`, data)
  }

  getZakazaneBezIzvestaja(pacijent: string, lekar: string) {
    let data = {
      pacijent: pacijent,
      lekar: lekar
    }
    return this.http.post(`${this.uri}/getZakazaneBezIzvestaja`, data)
  }

  setIzvestaj(pacijent: string, lekar: string, specijalizacija: string, datum: string, vreme: string, razlog: string,
    dijagnoza: string, terapija: string, prep_datum: string, idI: number, idZ: number) {
    let data = {
      pacijent, lekar, specijalizacija, datum, vreme, razlog, dijagnoza, terapija, prep_datum, idI, idZ
    }
    return this.http.post(`${this.uri}/setIzvestaj`, data)

  }

  deleteUser(username: string, type: string) {
    let data = { username, type }
    return this.http.post(`${this.uri}/deleteUser`, data)
  }

  odbijRegistraciju(username: string) {
    let data = { username }
    return this.http.post(`${this.uri}/odbijRegistraciju`, data)
  }

  prihvatiRegistraciju(r: Registracija) {
    let data = {
      kor_ime: r.kor_ime,
      ime: r.ime,
      prezime: r.prezime,
      mejl: r.mejl,
      kontakt: r.kontakt,
      adresa: r.adresa,
      lozinka: r.lozinka,
      slika: r.slika
    }
    return this.http.post(`${this.uri}/prihvatiRegistraciju`, data)

  }

  dodajSpecijalizaciju(spec: string) {
    let data = {
      spec: spec
    }
    return this.http.post(`${this.uri}/dodajSpecijalizaciju`, data)

  }

  getPreglediM() {
    return this.http.post(`${this.uri}/getPreglediM`, '')
  }

  deleteSP(naziv: string) {
    let data = {
      naziv: naziv
    }
    return this.http.post(`${this.uri}/deleteSP`, data)

  }

  getSpec() {
    return this.http.post(`${this.uri}/getSpec`, '')

  }

  dodajSP(specijalizacija: string,naziv: string,trajanje: number, cena: number) {
    let data={specijalizacija, naziv, trajanje, cena}
    return this.http.post(`${this.uri}/dodajSP`, data)

  }

  azurirajSP(naziv: string, trajanje: number, cena: number){
    let data ={ naziv, trajanje, cena}
    return this.http.post(`${this.uri}/azurirajSP`, data)
  }

  azurirajUserP(username: string, adresa: string, kontakt: number){
    let data ={ username, adresa, kontakt}
    return this.http.post(`${this.uri}/azurirajUserP`, data)
  }

  azurirajUserL(username: string, adresa: string, kontakt: number, specijalizacija: string, ogranak: string, licenca: number ){
    let data = { username, adresa, kontakt, specijalizacija, ogranak, licenca}
    return this.http.post(`${this.uri}/azurirajUserL`, data)
  }


}