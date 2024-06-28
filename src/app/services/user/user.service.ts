import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { environment } from "../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class UserService {
  private urlBack = environment.urlBack;

  constructor(private http: HttpClient, private auth: AuthService) {}

  accessQueryDate() {
    const access_token = this.auth.getToken();
    var headers: any = {
      "Content-Type": "application/json",
    };
    if (this.auth.getToken() != null) {
      headers.Authorization = `Token ${access_token}`;
    }
    const dir = this.urlBack + "users/accessQueryDate/";
    return this.http.get<boolean>(dir, { headers });
  }

  numDaysQuery() {
    const access_token = this.auth.getToken();
    var headers: any = {
      "Content-Type": "application/json",
    };
    if (this.auth.getToken() != null) {
      headers.Authorization = `Token ${access_token}`;
    }
    const dir = this.urlBack + "users/numDaysQuery/";
    return this.http.get<number>(dir, { headers });
  }
}
