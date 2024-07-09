import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import User from '../models/user';

@Component({
  selector: 'app-mlogin',
  templateUrl: './mlogin.component.html',
  styleUrls: ['./mlogin.component.css']
})
export class MloginComponent implements OnInit {

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
    this.userService.mlogin(this.username, this.password).subscribe((k: User) => {
      if (k) {
        localStorage.setItem("ulogovan", k.kor_ime)
        let flag = 'm';
        localStorage.setItem("flag", flag)
        this.router.navigate(['menadzer'])
      } else {
        this.error = "Losi podaci!";
        return;
      }
    })

  }
}
