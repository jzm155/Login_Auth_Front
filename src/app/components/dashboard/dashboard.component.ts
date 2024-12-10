import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  public users: any = []
  constructor(private api: ApiService,private auth: AuthService) { }

  ngOnInit() {
    this.api.getUsers()
      .subscribe(res => {
        this.users = res;
      })
  }

  logout() {
    this.auth.signOut()
  }
}
