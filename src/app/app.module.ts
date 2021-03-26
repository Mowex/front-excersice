import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { NavbarComponent } from './navbar/navbar.component';

import { AngularMyDatePickerModule } from 'angular-mydatepicker';


import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reminderReducer } from './reducers/reminder.reducer';
import { environment } from 'src/environments/environment';
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    NavbarComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMyDatePickerModule,
    StoreModule.forRoot({ reminders: reminderReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  providers: [{provide: LOCALE_ID, useValue: 'es'}],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalComponent,
  ]
})
export class AppModule { }
