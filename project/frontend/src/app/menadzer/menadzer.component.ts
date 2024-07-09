import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import User from '../models/user';
import Registracija from '../models/registracija';
import Pregled from '../models/pregled';
import Spregled from '../models/spregled';
import Specijalizacija from '../models/specijalizacija';

@Component({
  selector: 'app-menadzer',
  templateUrl: './menadzer.component.html',
  styleUrls: ['./menadzer.component.css']
})
export class MenadzerComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  menadzer: User;

  lekari: User[];
  pacijenti: User[];

  registracije: Registracija[];
  pregledi: Pregled[];
  spregledi: Spregled[];
  specijalizacije: Specijalizacija[];

  error: string = '';


  ngOnInit(): void {
    let flag = localStorage.getItem("flag");
    if(flag != 'm') {this.router.navigate([''])};
    let ulogovan = localStorage.getItem("ulogovan");
    ulogovan = ulogovan == null ? "" : ulogovan;
    this.userService.getUser(ulogovan, 'menadzer').subscribe((m: User) => {
      this.menadzer = m
        ;
    })
    this.userService.getLekare().subscribe((l: User[]) => {
      this.lekari = l;
      this.lekari.sort((a, b) => {
        let fa = a.ime.toLowerCase(),
          fb = b.ime.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
    })
    this.userService.getPacijente().subscribe((p: User[]) => {
      this.pacijenti = p;
      this.pacijenti.sort((a, b) => {
        let fa = a.ime.toLowerCase(),
          fb = b.ime.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
    })
    this.userService.getRegistracije().subscribe((r: Registracija[]) => {
      this.registracije = r;
      this.registracije.sort((a, b) => {
        let fa = a.ime.toLowerCase(),
          fb = b.ime.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
      this.userService.getPreglediM().subscribe((p: Pregled[]) => {
        this.pregledi = p;
      })
      let s = 'svi';
      this.userService.getSpreglede(s).subscribe((sp: Spregled[]) => {
        this.spregledi = sp;
      })
      this.userService.getSpec().subscribe((s: Specijalizacija[]) => {
        this.specijalizacije = s;
      })
    })

  }


  logout() {
    localStorage.clear()
    this.router.navigate(['mlogin'])
  }

  obrisi(username: string, type: string) {

    this.userService.deleteUser(username, type).subscribe((m) => {
      this.ngOnInit();
    })
  }

  firstname: string = '';
  lastname: string = '';
  username: string = '';
  email: string = '';
  adress: string = '';
  kontakt: string = '';
  password: string = '';
  passwordagain: string = '';
  specijalizacija: string = '';
  ogranak: string = '';
  licenca: number;
  slika: string;
  selected: File | null = null;
  user: User;

  selectImage(event: any) {
    const file = <File>event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        if (img.width >= 100 && img.height >= 100 && img.width <= 300 && img.height <= 300) {
          if (file.type == 'image/jpeg' || file.type == 'image/png') {
            this.selected = file;
          } else {
            alert('Podržani su samo JPG i PNG formati slike.');
            this.selected = null;
          }
        } else {
          alert('Slika mora da bude veličine između 100px x 100px i 300px x 300px.');
          this.selected = null;
        }
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);

  }

  register() {
    if (!this.firstname || !this.lastname || !this.password || !this.username || !this.email || !this.adress || !this.kontakt || !this.ogranak || !this.licenca || !this.specijalizacija) {
      this.error = 'Niste uneli sve podatke!!!'
      return;
    }
    if (this.password != this.passwordagain) {
      this.error = 'Niste dobro ponovili lozinku!!!'
      return;
    }
    const pattern = /^(?=[A-Za-z])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,13}$/;
    if (!pattern.test(this.password)) {
      this.error =
        "Lozinka mora da sadrzi:\n - minimum 8 i maksimum 14 karaktera\n - minimum po jedno veliko i malo slovo\n - najmanje jedan broj\n - najmanje jedan specijalan karakter\n - lozinka mora da počinje slovom"
      return;
    }
    this.userService.checkUser(this.username, this.email).subscribe((m => {
      if ((m['message'] != 'kor_ime') && (m['message'] != 'mejl') && (m['message'] != 'mejlilikor_ime')) {
        this.error = '';
        this.userService.registrationLekar(this.firstname, this.lastname, this.username,
          this.password, this.email, this.adress, this.kontakt, this.specijalizacija, this.ogranak, this.licenca, this.selected).subscribe((m => {
            this.slika = m['message'];
            this.ngOnInit();
          }))
      }
      else {
        if (m['message'] == 'kor_ime') {
          this.error = "Korisničko ime već postoji"
          return;
        }
        if (m['message'] == 'mejl') {
          this.error = "Uneti mejl je već iskorišćen za neki nalog"
          return;
        }
        this.error = "Uneti mejl ili korisničko ime je odbijeno"
      }
    }))
  }

  odbij(username: string) {
    this.userService.odbijRegistraciju(username).subscribe((m) => {
      this.ngOnInit();
    });

  }

  prihvati(username: string) {
    for (let r of this.registracije) {
      if (r.kor_ime == username) {
        this.userService.prihvatiRegistraciju(r).subscribe((m) => { })

      }
    }
  }

  spec: string = '';
  success: string = '';

  dodajSpecijalizaciju() {
    this.success = '';
    if (this.spec == '') {
      return;
    }
    this.userService.dodajSpecijalizaciju(this.spec).subscribe((m) => {
      this.ngOnInit();
      this.success = 'Uspešno ste dodali specijalizaciju'
    })

  }

  obrisiSP(naziv: string) {
    this.userService.deleteSP(naziv).subscribe((m) => {
      this.ngOnInit();
    })
  }

  sp: string;
  n: string;
  t: number;
  c: number;
  error1: string = '';


  dodajSP() {
    if (!this.t) {
      this.t = 30
    }
    if (!this.sp || !this.n || !this.c) {
      this.error1 = 'Niste uneli sve podatke!!!'
      return;
    }
    this.error1 = '';
    this.userService.dodajSP(this.sp, this.n, this.t, this.c).subscribe((m) => {
      this.ngOnInit();
    })
  }

  azuriraj(naziv: string) {
    for (let s of this.spregledi) {
      if (s.naziv == naziv) {
        if (!s.trajanje) {
          s.trajanje = 30;
        }
        this.userService.azurirajSP(naziv, s.trajanje, s.cena).subscribe((m) => {
          s.azuriraj = false;
          this.ngOnInit();
        })
      }
    }
  }

  azurirajUser(username: string, type: string) {
    if (type == 'pacijent') {
      for (let s of this.pacijenti) {
        if (s.kor_ime == username) {
          this.userService.azurirajUserP(username, s.adresa, s.kontakt).subscribe((m) => {
            s.azuriraj = false;
            this.ngOnInit();
          })
        }
      }
    }
    else{
      for (let s of this.lekari) {
        if (s.kor_ime == username) {
          this.userService.azurirajUserL(username, s.adresa, s.kontakt, s.specijalizacija, s.ogranak, s.licenca).subscribe((m) => {
            s.azuriraj = false;
            this.ngOnInit();
          })
        }
      }

    }

  }
}
