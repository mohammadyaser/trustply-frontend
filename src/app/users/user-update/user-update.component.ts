import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css'],
})
export class UserUpdateComponent implements OnInit {
  isLoading = false;
  user: any;
  form: FormGroup;
  imagePreview: String | null | ArrayBuffer;
  private userId: any = '';
  constructor(public userService: UserService, public router: ActivatedRoute) {}
  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)],
      }),
    });
    this.router.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.userId = paramMap.get('userId');
        this.isLoading = true;
        this.user = this.userService
          .getUser(this.userId)
          .subscribe((userData:any) => {
            this.isLoading = false;
            this.user = {
              id: userData.result[0].id,
              name: userData.result[0].name,
            };
            this.form.setValue({
              name: this.user.name,
            });
          });
        console.log('ediiiiiiiit***:', this.user);
      }
    });
  }
  onEdit() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.userService.updateUser(this.userId, this.form.value.name);

    this.form.reset();
  }
}
