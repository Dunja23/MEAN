import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  firstname: string;
  lastname: string;
  username: string;
  password: string;
  passwordagain: string;
  email: string;
  adress: string;
  kontakt: string;
  slika: string;

  error: string = '';

  selected: File | null = null;


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

  nazad(){
    this.router.navigate(['']);
  }

  register() {
    if (!this.firstname || !this.lastname || !this.password || !this.username || !this.email || !this.adress || !this.kontakt) {
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
        this.userService.requestRegistration(this.firstname, this.lastname, this.username,
          this.password, this.email, this.adress, this.kontakt, this.selected).subscribe((m => {
            this.slika = m['message'];
            this.router.navigate(['login']);
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
}
