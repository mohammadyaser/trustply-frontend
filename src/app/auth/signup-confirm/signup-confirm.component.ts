import { Component, OnDestroy, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms"
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup-confirm',
  templateUrl: './signup-confirm.component.html',
  styleUrls: ['./signup-confirm.component.css']
})
export class SignupConfirmComponent implements OnInit , OnDestroy{

  constructor(public authServoce : AuthService) { }
  isLoading = false;
  vfCode : any;
  private authStatusSub : Subscription;
  ngOnInit(): void {
    this.vfCode = this.authServoce.verifyCode;
    if(!this.vfCode){

    }
    this.authStatusSub = this.authServoce.getAuthStatusListener().subscribe(authStatus=>{
      this.isLoading = false
    })
  }
  onSignupConfirm(form : NgForm){
    if(form.invalid){
      return
    }
    this.isLoading = true;
    this.authServoce.confirmUser(form.value.verifyCode)
  }
  ngOnDestroy(){
this.authStatusSub.unsubscribe()
  }

}
