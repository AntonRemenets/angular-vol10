/*
*
*  TEMPLATE DRIVEN FORM APPROACH
* 
*/

import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  viewChild
} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    FormsModule
  ]
})
export class LoginComponent {
  private form = viewChild.required<NgForm>('form')
  private destroyRef = inject(DestroyRef)

  // Здесь реализовано сохранение введенного логина.
  // Используется в случае повторного ввода логина в форму.
  // Причем сохранение в localStorage происходит каждые 500мс после того как юзер закончил вводить данные в поле логина.
  constructor() {
    afterNextRender(() => {
      const savedForm = window.localStorage.getItem('saved-login')

      if (savedForm) {
        const savedLogin = JSON.parse(savedForm).email

        setTimeout(() => {
          this.form().setValue({
            email: savedLogin,
            password: ''
          })
        }, 1)
      }

      const subscription = this.form().valueChanges?.pipe(debounceTime(500)).subscribe({
        next: value => window.localStorage.setItem(
          'saved-login',
          JSON.stringify({email: value.email})
        ),
      })

      this.destroyRef.onDestroy(() => subscription?.unsubscribe())
    })
  }

  public onSubmit(formData: NgForm) {
    if (formData.form.invalid) {
      return
    }

    const enteredEmail = formData.form.value.email
    const enteredPassword = formData.form.value.password

    console.log(formData.form)
    console.log(enteredEmail, enteredPassword)

    // Очистка формы
    formData.form.reset()
  }
}
