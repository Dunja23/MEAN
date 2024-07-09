import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import User from '../models/user';

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrls: ['./pocetna.component.css']
})
export class PocetnaComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  imeRastuce: boolean = true;
  prezimeRastuce: boolean = true;
  specRastuce: boolean = true;
  regexI: string = '';
  regexP: string = '';
  regexS: string = '';

  lekari: User[];



  ngOnInit(): void {
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

  signin() {
    this.router.navigate(['login'])
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

  opste() {

  }

}
