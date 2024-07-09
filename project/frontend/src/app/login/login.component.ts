import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import User from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }
  username: string = "";
  password: string = "";
  lekar: boolean;
  error: string;

  ngOnInit(): void {
  }

  nazad(){
    this.router.navigate(['']);
  }

  login(){
    if (this.username == "" || this.password == "") {
      this.error = "Niste uneli sve podatke!";
      return;
    }
    this.error = "";
    this.userService.login(this.username, this.password, this.lekar ? 'lekar' : 'pacijent').subscribe((k: User) => {
      if (k) {
        localStorage.setItem("ulogovan", k.kor_ime)
        let flag = 'p';
        if(this.lekar) { flag = 'l'}
        localStorage.setItem("flag", flag)
        this.router.navigate([this.lekar ? 'lekar' : 'pacijent'])
      } else {
        this.error = "Losi podaci!";
        return;
      }
    })

  }
}
