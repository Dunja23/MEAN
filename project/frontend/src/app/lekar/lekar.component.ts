import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import User from '../models/user';
import Zakazan from '../models/zakazan';
import Spregled from '../models/spregled';

@Component({
  selector: 'app-lekar',
  templateUrl: './lekar.component.html',
  styleUrls: ['./lekar.component.css']
})
export class LekarComponent implements OnInit {

  constructor(private router: Router, private userService: UserService, private http: HttpClient) { }

  lekar: User;
  error: string = '';
  errorP: string = '';
  changePass: boolean = false;
  password: string;
  newpassword: string;
  passwordagain: string;
  selected: File | null = null;

  profil: boolean = true;
  pregled: boolean = false;

  zakazani: Zakazan[];
  prvihTri: Zakazan[];
  spregledi: Spregled[];

  profilf() {
    this.profil = true;
    this.pregled = false;
  }

  pregledf() {
    this.profil = false;
    this.pregled = true;
  }

  ngOnInit(): void {
    let flag = localStorage.getItem("flag");
    if(flag != 'l') {this.router.navigate([''])};
    let ulogovan = localStorage.getItem("ulogovan"); 
    ulogovan = ulogovan == null ? "" : ulogovan;
    this.userService.getUser(ulogovan, 'lekar').subscribe((p: User) => {
      this.lekar = p;
      this.userService.getZakazanL(this.lekar.kor_ime).subscribe((zak: Zakazan[]) => {
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
          this.userService.getUser(z.pacijent, 'pacijent').subscribe((p: User) => {
            z.obrazlozenje = '';
            z.imeIprezimeP = p.ime + ' ' + p.prezime;
          })
        }
        if(this.zakazani.length >= 3)
        {this.prvihTri = [ this.zakazani[0], this.zakazani[1], this.zakazani[2]];}
        else {this.prvihTri = this.zakazani;}
      });
      this.userService.getSpreglede(this.lekar.specijalizacija).subscribe((sp: Spregled[]) => {
        this.spregledi = sp;
      })
    });
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['login'])
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
            this.userService.updateProfileImage(this.lekar.kor_ime, this.selected).subscribe(m => {
              this.http.delete(`http://localhost:4000/delete/${this.lekar.slika}`).subscribe(
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

  changePassword() {
    this.userService.checkLekarPass(this.lekar.kor_ime, this.password).subscribe(m => {
      if (m['message'] == 'ok') {
        if (this.newpassword == this.passwordagain) {
          const pattern = /^(?=[A-Za-z])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,13}$/;
          if (!pattern.test(this.newpassword)) {
            this.error =
              "Lozinka mora da sadrzi:\n - minimum 8 i maksimum 14 karaktera\n - minimum po jedno veliko i malo slovo\n - najmanje jedan broj\n - najmanje jedan specijalan karakter\n - lozinka mora da počinje slovom"
            return;
          }
          this.error = '';
          this.userService.changePassword(this.lekar.kor_ime, this.newpassword).subscribe(m => {
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

  dodajPregled(naziv: string, trajanje: number, cena: number) {
    this.userService.dodajPregled(naziv, this.lekar.kor_ime, trajanje, cena).subscribe((m) => {
      this.ngOnInit();
      return;
    })
  }

  otkazi(id: number, obrazlozenje: string) {
    if (obrazlozenje == '') {
      this.errorP = 'Niste uneli obrazlozenje'
      return;
    }
    this.errorP = '';

  }

  idiNaKarton(username: string){
    localStorage.setItem("pacijent", username);
    this.router.navigate(['karton']);

  }
}
