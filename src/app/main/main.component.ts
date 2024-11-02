import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../shared/services/user.service";
import {BricksEventService} from "../shared/services/bricks.event.service";
import {Subscription} from "rxjs";
import {BtnUrls} from "./btn.urls";

@Component({
  selector: 'app-bricks',
  templateUrl: './bricks.component.html',
  styleUrls: ['./bricks.component.scss']
})
export class BricksComponent implements OnInit{
  public isUserAuthenticated: boolean=false;
  public isCategoriesOpened: boolean=true;
  public isCategorySelected: boolean=false;
  selectCategoryEventSub:Subscription;
  constructor(
    private router: Router,
    private userService: UserService,
    private bricksEventService: BricksEventService,
    public btnUrls: BtnUrls,
  ){
    this.selectCategoryEventSub = this.bricksEventService.getSelectCategoryEvent().subscribe(id=>{
      console.log(id);
      if(id!=0) this.isCategorySelected=true;
      else this.isCategorySelected=false;
    })
  }
  ngOnInit(): void {
    this.userService.authChanged
      .subscribe(res => {
        //this.isUserAuthenticated = res;
      })
  }
  logoutBtnClick():void{
    this.userService.logout();
  }
  goToLoginBtnClick():void{
    this.router.navigate(["bricks_manager/login"]);
  }

  categoriesMenuOpen(){
    if(this.isCategoriesOpened){
      this.isCategoriesOpened=false;
      this.isCategorySelected=false;
    }
    else this.isCategoriesOpened = true;
  }

  selectCategory(){
    this.isCategorySelected=true;
  }

}
