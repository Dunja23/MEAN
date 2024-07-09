import { Component, OnInit } from '@angular/core';
import User from '../models/user';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import Izvestaj from '../models/izvestaj';
import Zakazan from '../models/zakazan';

@Component({
  selector: 'app-karton',
  templateUrl: './karton.component.html',
  styleUrls: ['./karton.component.css']
})
export class KartonComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  pacijent: User;
  lekar: User;
  error: string = '';
  success: string = '';

  zakazani: Zakazan[];
  izvestaji: Izvestaj[];
  id: number;
  idZ: number;

  izvestaj: boolean = false;
  now: Date = new Date();


  ngOnInit(): void {
    let flag = localStorage.getItem("flag");
    if(flag != 'l') {this.router.navigate([''])};
    let ulogovan = localStorage.getItem("ulogovan");
    ulogovan = ulogovan == null ? "" : ulogovan;
    this.userService.getUser(ulogovan, 'lekar').subscribe((l: User) => {
      this.lekar = l;

      let pacijent = localStorage.getItem("pacijent");
      pacijent = pacijent == null ? "" : pacijent;
      this.userService.getUser(pacijent, 'pacijent').subscribe((p: User) => {
        this.pacijent = p;
        this.userService.getIzvestaje(p.kor_ime).subscribe((i: Izvestaj[]) => {
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
            const [hoursa, minutesa] = a.vreme.split(":").map(Number);
            const [hoursb, minutesb] = b.vreme.split(":").map(Number);

            if (hoursa < hoursb || (hoursa == hoursb && minutesa < minutesb)) {
              return -1;
            }

            if (hoursa > hoursb || (hoursa == hoursb && minutesa > minutesb)) {
              return 1;
            }

            return 0;
          });
          for (let i of this.izvestaji) {
            this.userService.getUser(i.lekar, 'lekar').subscribe((l: User) => {
              i.imeIprezimeL = l.ime + ' ' + l.prezime;
            })
          }
        });
        this.userService.getZakazaneBezIzvestaja(p.kor_ime, l.kor_ime).subscribe((z: Zakazan[]) => {
          this.zakazani = z;
          for (let z of this.zakazani) {
            const datum = new Date(z.datum);
            const hours = String(datum.getUTCHours());
            const minutes = String(datum.getUTCMinutes()).padStart(2, '0')
            z.vreme = `${hours}:${minutes}`;
          }
        })
      })
      this.userService.getSveIzvestaje().subscribe((izvestaji: Izvestaj[]) => {
        for (let i of izvestaji) {
          this.id = i.idI + 1;
        }
      })
    })
  }

  nazadNaProfil() {
    this.router.navigate(['lekar']);
  }

  izvestajI(idZ: number, naziv: string) {
    this.izvestaj = true;
    this.idZ = idZ;
    this.naziv = naziv;
  }

  naziv: string = '';
  specijalizacija: string = '';
  razlog: string = '';
  terapija: string = '';
  dijagnoza: string = '';

  napisiIzvestaj() {
    const datetimeInput = document.getElementById('datum') as HTMLInputElement;
    const datetimeValue = datetimeInput.value;
    if (!datetimeValue) {
      this.error = 'Niste uneli datum i vreme!';
      return;
    }
    this.error = '';
    const tsDate = new Date(datetimeValue);
    let mesec = tsDate.getMonth();
    mesec = mesec + 1;
    let datum = `${tsDate.getFullYear()}-${mesec}-${tsDate.getDate()}`;
    let minutes = String(tsDate.getMinutes()).padStart(2, '0');
    let vreme = `${tsDate.getHours()}:${minutes}`;

    const datetimeInput1 = document.getElementById('datum1') as HTMLInputElement;
    const datetimeValue1 = datetimeInput1.value;
    if (!datetimeValue1) {
      this.error = 'Niste uneli datum!';
      return;
    }
    this.error = '';
    const tsDate1 = new Date(datetimeValue1);
    let mesec1 = tsDate1.getMonth();
    mesec1 = mesec1 + 1;
    let datum1 = `${tsDate1.getFullYear()}-${mesec1}-${tsDate1.getDate()}`;
    this.userService.setIzvestaj(this.pacijent.kor_ime,this.lekar.kor_ime, this.lekar.specijalizacija,
      datum, vreme, this.razlog, this.dijagnoza, this.terapija, datum1, this.id, this.idZ).subscribe(m=>{
        this.izvestaj = false;
        this.ngOnInit();
      })
  }

}
