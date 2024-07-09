import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import User from '../models/user';
import Pregled from '../models/pregled';
import Zakazan from '../models/zakazan';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  pacijent: User;
  lekar: User;
  error: string = '';
  success: string = '';

  pregledi: Pregled[];
  zakazani: Zakazan[];
  id: number;

  zakazan: string = '';

  ngOnInit(): void {
    let flag = localStorage.getItem("flag");
    if(flag != 'p') {this.router.navigate([''])};
    let ulogovan = localStorage.getItem("ulogovan");
    ulogovan = ulogovan == null ? "" : ulogovan;
    this.userService.getUser(ulogovan, 'pacijent').subscribe((p: User) => {
      this.pacijent = p;
    })
    let lekar = localStorage.getItem("lekar");
    lekar = lekar == null ? "" : lekar;
    this.userService.getUser(lekar, 'lekar').subscribe((l: User) => {
      this.lekar = l;
      this.userService.getPregledi(l.kor_ime).subscribe((p: Pregled[]) => {
        this.pregledi = p;
      });
    })
    this.userService.getSveZakazane().subscribe((zakazani: Zakazan[]) => {
      for (let z of zakazani) {
        this.id = z.idZ + 1;
      }
    })
  }

  nazadNaProfil() {
    this.router.navigate(['pacijent']);
  }

  zakaziPregled() {
    this.success = '';
    if (this.zakazan == '') {
      this.error = 'Niste odabrali pregled!';
      return;
    }
    const datetimeInput = document.getElementById('datum') as HTMLInputElement;
    const datetimeValue = datetimeInput.value;
    if (!datetimeValue) {
      this.error = 'Niste uneli datum i vreme!';
      return;
    }
    this.error = '';
    const tsDate = new Date(datetimeValue);
    this.userService.getZakazaneL(this.lekar.kor_ime).subscribe((zakazani: Zakazan[]) => {
      for (let z of zakazani) {
        const datum = new Date(z.datum);
        const now = new Date();
        if((tsDate.getFullYear()<now.getFullYear())||(tsDate.getMonth()<now.getMonth())
        ||(tsDate.getDate()<now.getDate())||(tsDate.getHours()<now.getUTCHours())||(tsDate.getMinutes()<now.getMinutes())){
          this.error = 'Datum mora biti u budućnosti!';
          return;
        }
        if ((tsDate.getFullYear() == datum.getFullYear()) && (tsDate.getMonth() == datum.getMonth()) &&
          (tsDate.getDate() == datum.getDate())) {
          if (tsDate.getHours() == datum.getUTCHours()) {
            this.error = 'Lekar ima drugi pregled u ovom intervalu';
            return;
          }
          let m1 = 0;
          let m2 = 0;
          for (let p of this.pregledi) {
            if (p.naziv == z.naziv) {
              m1 = p.trajanje;
            }
            if (p.naziv == this.zakazan) {
              m2 = p.trajanje;
            }
          }
          if (tsDate.getHours() > datum.getUTCHours()) {
            let x = datum.getUTCHours() + Math.floor((m1 + datum.getMinutes()) / 60);
            let y = tsDate.getHours();
            if (y < x) {
              this.error = 'Lekar ima drugi pregled u ovom intervalu';
              return;
            }
            if (y == x) {
              let z = datum.getMinutes();
              z = (z + m1) % 60
              let w = tsDate.getMinutes();
              if (w < z) {
                this.error = 'Lekar ima drugi pregled u ovom intervalu';
                return;
              }
            }
          }
          if (tsDate.getHours() < datum.getUTCHours()) {
            let x = datum.getUTCHours();
            let y = tsDate.getHours() + Math.floor((m2 + tsDate.getMinutes()) / 60);
            if (y > x) {
              this.error = 'Lekar ima drugi pregled u ovom intervalu';
              return;
            }
            if (y == x) {
              let z = datum.getMinutes();
              let w = tsDate.getMinutes();
              w = (w + m2) % 60
              if (w > z) {
                this.error = 'Lekar ima drugi pregled u ovom intervalu';
                return;
              }
            }
          }
        }
      }
      this.userService.zakaziPregled(this.id, this.lekar.kor_ime, this.pacijent.kor_ime, this.zakazan, tsDate).subscribe(m => { 
        if(m['message']){
          this.success = 'Uspešno ste zakazali termin'
        }

      })
    });

  }

}
