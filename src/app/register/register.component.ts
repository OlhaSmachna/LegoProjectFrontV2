import {Component} from '@angular/core';
import {ValidationService} from "../shared/services/tools/validation-service";
import {UserService} from "../shared/services/api/user-service";
import { HttpErrorResponse } from "@angular/common/http";
import {AddRequestUserDto} from "../shared/DTOs/User/add-request-user.dto";
import {AddResponseUserDto} from "../shared/DTOs/User/add-response-user.dto";
import {Router} from "@angular/router";
import {ResponseHandler} from "../shared/services/tools/response-handler";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class RegisterComponent {
  public email:string='';
  public password:string='';
  public confirmPassword:string='';

  public emailValid:boolean=true;
  public passwordValid:boolean=true;
  public confirmPasswordValid:boolean=true;

  public invalidEmailMessage:string='';
  public invalidPasswordMessage:string='';
  public invalidConfirmPasswordMessage:string='';

  constructor(
    private userService:UserService,
    private router: Router,
    private validationService:ValidationService,
    private responseHandler: ResponseHandler
  ) {}

  public register(): void {
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

    if(this.validationService.notEmptyOrSpaces(this.confirmPassword)) {
      if(this.confirmPassword == this.password) {
        this.confirmPasswordValid = true;
      }
      else {
        this.confirmPasswordValid = false;
        this.invalidConfirmPasswordMessage = 'Must match password field';
      }
    }
    else {
      this.confirmPasswordValid=false;
      this.invalidConfirmPasswordMessage='This field is required';
    }

    if (this.emailValid && this.passwordValid && this.confirmPasswordValid) {
      const userForReg: AddRequestUserDto = {
        email: this.email,
        password: this.password
      }
      this.userService.register(userForReg)
        .subscribe({
          next: (response) => {
            if(response.isSuccessful && (response.result as AddResponseUserDto).email!=''){
              localStorage.setItem("email-from-registration", (response.result as AddResponseUserDto).email);
              this.router.navigate(['bricks_manager/login']);
            }
            else this.responseHandler.errorFromServerResponse(response);
          },
          error: (err: HttpErrorResponse) => {
            this.responseHandler.serverNotRespondingError(err);
          }})
    }
  }
}
