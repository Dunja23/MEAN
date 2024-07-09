import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import User from '../models/user';
import { HttpClient } from '@angular/common/http';
import Zakazan from '../models/zakazan';
import Izvestaj from '../models/izvestaj';

@Component({
  selector: 'app-pacijent',
  templateUrl: './pacijent.component.html',
  styleUrls: ['./pacijent.component.css']
})
export class PacijentComponent implements OnInit {

  constructor(private router: Router, private userService: UserService, private http: HttpClient) { }

  pacijent: User;
  error: string = '';
  changePass: boolean = false;
  password: string;
  newpassword: string;
  passwordagain: string;
  selected: File | null = null;

  profil: boolean = true;
  lekar: boolean = false;
  pregled: boolean = false;
  obavestenja: boolean = false;

  lekari: User[];
  zakazani: Zakazan[];
  izvestaji: Izvestaj[];

  imeRastuce: boolean = true;
  prezimeRastuce: boolean = true;
  specRastuce: boolean = true;
  regexI: string = '';
  regexP: string = '';
  regexS: string = '';

  obavestenjaf() {
    this.obavestenja = true;
    this.profil = false;
    this.lekar = false;
    this.pregled = false;
  }

  profilf() {
    this.obavestenja = false;
    this.profil = true;
    this.lekar = false;
    this.pregled = false;
  }

  lekarf() {
    this.obavestenja = false;
    this.profil = false;
    this.lekar = true;
    this.pregled = false;
  }

  pregledf() {
    this.obavestenja = false;
    this.profil = false;
    this.lekar = false;
    this.pregled = true;
  }

  ngOnInit(): void {
    let flag = localStorage.getItem("flag");
    if(flag != 'p') {this.router.navigate([''])};
    let ulogovan = localStorage.getItem("ulogovan");
    ulogovan = ulogovan == null ? "" : ulogovan;
    this.userService.getUser(ulogovan, 'pacijent').subscribe((p: User) => {
      this.pacijent = p;
      this.userService.getZakazan(this.pacijent.kor_ime).subscribe((zak: Zakazan[]) => {
        this.zakazani = zak;
        this.zakazani.sort((a, b) => {
          let fa = new Date(a.datum),
            fb = new Date(b.datum);
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });
        for (let z of this.zakazani) {
          const datum = new Date(z.datum);
          const hours = String(datum.getUTCHours());
          const minutes = String(datum.getUTCMinutes()).padStart(2, '0')
          z.vreme = `${hours}:${minutes}`;
          const lekar = new User();
          this.userService.getUser(z.lekar, 'lekar').subscribe((l: User)=>{
            z.ogranak = l.ogranak;
            z.imeIprezimeL = l.ime + ' ' + l.prezime;
          })
        }
      })

      this.userService.getIzvestaje(this.pacijent.kor_ime).subscribe((i: Izvestaj[])=>{
        this.izvestaji = i;
        this.izvestaji.sort((a, b) => {
          let fa = new Date(a.datum),
            fb = new Date(b.datum);
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          const [hoursa , minutesa] = a.vreme.split(":").map(Number);
          const [hoursb , minutesb] = b.vreme.split(":").map(Number);

          if(hoursa < hoursb || (hoursa==hoursb && minutesa < minutesb )){
            return -1;
          }

          if(hoursa > hoursb || (hoursa==hoursb && minutesa > minutesb )){
            return 1;
          }

          return 0;
        });
        for (let i of this.izvestaji) {
          this.userService.getUser(i.lekar, 'lekar').subscribe((l: User)=>{
            i.imeIprezimeL = l.ime + ' ' + l.prezime;
          })
        }
      })
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

  }

  logout() {
    localStorage.clear()
    this.router.navigate(['login'])
  }

  idiNaProfil(username: string) {
    localStorage.setItem("lekar", username);
    this.router.navigate(['profil'])
  }

  changePassword() {
    this.userService.checkPacijentPass(this.pacijent.kor_ime, this.password).subscribe(m => {
      if (m['message'] == 'ok') {
        if (this.newpassword == this.passwordagain) {
          const pattern = /^(?=[A-Za-z])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,13}$/;
          if (!pattern.test(this.newpassword)) {
            this.error =
              "Lozinka mora da sadrzi:\n - minimum 8 i maksimum 14 karaktera\n - minimum po jedno veliko i malo slovo\n - najmanje jedan broj\n - najmanje jedan specijalan karakter\n - lozinka mora da počinje slovom"
            return;
          }
          this.error = '';
          this.userService.changePassword(this.pacijent.kor_ime, this.newpassword).subscribe(m => {
            if (m['message'] == 'ok') {
              this.password = this.passwordagain = this.newpassword = '';
              this.logout();
            }
          })
        }
        else {
          this.error = 'Niste dobro ponovili lozinku'
          return;
        }
      }
      else {
        this.error = 'Neispravna lozinka'
      }
    })
  }

  selectImage(event: any) {
    const file = <File>event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        if (img.width >= 100 && img.height >= 100 && img.width <= 300 && img.height <= 300) {
          if (file.type == 'image/jpeg' || file.type == 'image/png') {
            this.selected = file;
            this.userService.updateProfileImage(this.pacijent.kor_ime, this.selected).subscribe(m => {
              this.http.delete(`http://localhost:4000/delete/${this.pacijent.slika}`).subscribe(
                m => { this.ngOnInit(); })
            })
          } else {
            alert('Samo JPG i PNG formati su podržani. Ukoliko ne promenite ovu sliku, biće postavljena podrazumevana.');
            this.selected = null;
          }
        } else {
          alert('Slika mora biti između 100x100px i 300x300px. Ukoliko ne promenite ovu sliku, biće postavljena podrazumevana.');
          this.selected = null;
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);

  }

  sortiraj(s: string) {
    if (s == 'Ime' && this.imeRastuce) {
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
      this.imeRastuce = false;
      return;
    }
    if (s == 'Ime' && !this.imeRastuce) {
      this.lekari.sort((b, a) => {
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
      this.imeRastuce = true;
      return;
    }
    if (s == 'Prezime' && this.prezimeRastuce) {
      this.lekari.sort((a, b) => {
        let fa = a.prezime.toLowerCase(),
          fb = b.prezime.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
      this.prezimeRastuce = false;
      return;
    }
    if (s == 'Prezime' && !this.prezimeRastuce) {
      this.lekari.sort((b, a) => {
        let fa = a.prezime.toLowerCase(),
          fb = b.prezime.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
      this.prezimeRastuce = true;
      return;
    }
    if (s == 'Specijalizacija' && this.specRastuce) {
      this.lekari.sort((a, b) => {
        let fa = a.specijalizacija.toLowerCase(),
          fb = b.specijalizacija.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
      this.specRastuce = false;
      return;
    }
    else {
      this.lekari.sort((b, a) => {
        let fa = a.specijalizacija.toLowerCase(),
          fb = b.specijalizacija.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
      this.specRastuce = true;
      return;
    }

  }

  pretrazi() {
    this.userService.pretraziLekare(this.regexI, this.regexP, this.regexS).subscribe((l: User[]) => {
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
  }

  otkazi(id: number) {
    this.userService.otkaziPregled(id).subscribe(m => {
      this.userService.getZakazan(this.pacijent.kor_ime).subscribe((zak: Zakazan[]) => {
        this.zakazani = zak;
        for (let z of this.zakazani) {
          const datum = new Date(z.datum);
          const hours = String(datum.getUTCHours());
          const minutes = String(datum.getUTCMinutes()).padStart(2, '0')
          z.vreme = `${hours}:${minutes}`;
          const lekar = new User();
          this.userService.getUser(z.lekar, 'lekar').subscribe((l: User)=>{
            z.ogranak = l.ogranak;
          })
        }
      })
    })
  }
}
