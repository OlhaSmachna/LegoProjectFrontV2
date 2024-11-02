import {Component, OnInit} from '@angular/core';
import {ValidationService} from "../shared/services/tools/validation-service";
import {LoginRequestUserDto} from "../shared/DTOs/User/login-request-user.dto";
import {UserService} from "../shared/services/api/user-service";
import {LoginResponseUserDto} from "../shared/DTOs/User/login-response-user.dto";
import {Router} from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import {UserEventsService} from "../shared/services/events/user-events-service";
import {ResponseHandler} from "../shared/services/tools/response-handler";
import {RouterEventsService} from "../shared/services/events/router-events-service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public email: string = '';
  public password: string = '';
  public emailValid: boolean = true;
  public passwordValid: boolean = true;
  public invalidEmailMessage: string = '';
  public invalidPasswordMessage: string = '';

  constructor(
    private userService: UserService,
    private userEventsService: UserEventsService,
    private routerEventsService: RouterEventsService,
    private router: Router,
    private validationService: ValidationService,
    private responseHandler: ResponseHandler
  ) {}

  ngOnInit(): void {
    if(localStorage.getItem("email-from-registration") != null) {
      this.email = localStorage.getItem("email-from-registration") ?? '';
      localStorage.removeItem("email-from-registration");
    }
  }
  public login(): void {
    if(this.validationService.notEmptyOrSpaces(this.email)) {
      if(this.validationService.matchesEmailTemplate(this.email)) {
        this.emailValid = true;
      }
      else {
        this.emailValid = false;
        this.invalidEmailMessage = 'Incorrect email format';
      }
    }
    else {
      this.emailValid = false;
      this.invalidEmailMessage = 'This field is required';
    }

    if(this.validationService.notEmptyOrSpaces(this.password)) {
      if(this.password.length >= 8) {
        this.passwordValid = true;
      }
      else {
        this.passwordValid = false;
        this.invalidPasswordMessage = 'Must be 8 symbols or longer';
      }
    }
    else {
      this.passwordValid = false;
      this.invalidPasswordMessage = 'This field is required';
    }

    if(this.emailValid && this.passwordValid) {
      const userForAuth: LoginRequestUserDto = {
        email: this.email,
        password: this.password
      }
      this.userService.login(userForAuth)
        .subscribe({
          next: (response) => {
            if(response.isSuccessful && (response.result as LoginResponseUserDto).email != null) {
              this.userEventsService.sendSuccessfulLoginNotification(response.result);
              this.routerEventsService.setRouteParam(true);
              this.router.navigate(['bricks_manager/bricks']);
            }
            else {
              this.responseHandler.errorFromServerResponse(response);
            }
          },
          error: (err: HttpErrorResponse) => {
            this.responseHandler.serverNotRespondingError(err);
          }})
    }
  }

  public guest(): void {
    this.userEventsService.sendLogoutNotification();
    this.router.navigate(['bricks_manager/bricks']);
  }
}
