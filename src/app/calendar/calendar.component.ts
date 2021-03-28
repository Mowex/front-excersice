import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component'
import { Reminder } from '../classes/reminder';
import { Store } from '@ngrx/store';
import { AppState } from '../classes/appState';
import { DeleteAllReminders } from '../actions/reminder.actions';
import { RestApiService } from '../services/rest-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2'
import * as moment from 'moment'
import 'moment/locale/es'

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  week = moment.weekdays(true)
  monthSelect: any[];
  dateSelect: any;
  reminders: Reminder[];
  baseUrlIcon: string;
  WeatherForecast: any[];
  weatherByDay: any;
  localState: Reminder[];

  constructor(
    public modalService: NgbModal,
    private store: Store<AppState>,
    private restApi: RestApiService
  ) { }

  ngOnInit(): void {
    this.baseUrlIcon = 'http://openweathermap.org/img/wn/';
    this.getWeather();
  }

  getDaysFromDate(month: number, year: number) {
    const startDate = moment.utc(`${year}/${month}/01`)
    const endDate = startDate.clone().endOf('month')
    this.dateSelect = startDate;

    const diffDays = endDate.diff(startDate, 'days', true)
    const numberDays = Math.round(diffDays);

    this.store.subscribe(state => {
      this.reminders = !!state.reminders ? state.reminders : JSON.parse(localStorage.getItem('reminders'));
    })

    const arrayDays = Object.keys([...Array(numberDays)]).map((a: any) => {
      a = parseInt(a) + 1;
      const dayObject = moment(`${year}-${month}-${a}`);

      // para agregar los recordatorios al día
      const reminders = [];
      if (!!this.reminders) {
        this.reminders.map((rem) => {
          const { date: { singleDate: { formatted } } } = rem;
          if (a === parseInt(moment(formatted).format('D')) &&
            month === parseInt(moment(formatted).format('M')) &&
            year === parseInt(moment(formatted).format('YYYY'))) {
            reminders.push(rem);
          }
        })[0]
      }

      if (!!this.WeatherForecast) {
        this.weatherByDay = this.WeatherForecast.find( weatherByday => {
          const date = moment.unix(weatherByday.dt);
          if ( a === parseInt(date.format('D')) &&
            month === parseInt(date.format('M')) &&
            year === parseInt(date.format('YYYY')) ){
            return weatherByday;
          }
        })
      }

      const sortReminder = reminders.sort((a, b) => a.time.localeCompare(b.time));

      return {
        name: dayObject.format("D"),
        value: a,
        indexWeek: dayObject.isoWeekday(),
        reminders: !!sortReminder.length ? reminders : null,
        weatherByDay: !!this.weatherByDay ? this.weatherByDay : null,
      };
    });

    this.monthSelect = arrayDays;
  }

  changeMonth(flag: number) {
    if (flag < 0) {
      const prevDate = this.dateSelect.clone().subtract(1, "month");
      this.getDaysFromDate(parseInt(prevDate.format("MM")), parseInt(prevDate.format("YYYY")));
      localStorage.setItem('month', prevDate.format("MM"));
      localStorage.setItem('year', prevDate.format("YYYY"));
    } else {
      const nextDate = this.dateSelect.clone().add(1, "month");
      this.getDaysFromDate(parseInt(nextDate.format("MM")), parseInt(nextDate.format("YYYY")));
      localStorage.setItem('month', nextDate.format("MM"));
      localStorage.setItem('year', nextDate.format("YYYY"));
    }
  }

  openModal(reminder = null) {
    const modalRef = this.modalService.open(ModalComponent, { centered: true });
    if (!!reminder) {
      modalRef.componentInstance.reminder = reminder;
    }
  }

  confirmDeleteReminders() {
    Swal.fire({
      title: 'Eliminar recordatorios',
      text: "¿Desea borrar todos los recordatorios registrados? Esta acción es irreversible",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deletereminders();
      }
    })
  }

  deletereminders() {
    const action = new DeleteAllReminders();
    this.store.dispatch(action);
    this.getWeather();
  }

  getWeather() {
    this.restApi.getWeather().subscribe((data: any) => {
      const { daily } = data;
      const storageMonth = !!localStorage.getItem('month') ? localStorage.getItem('month') : (moment().month() + 1);
      const storageYear = !!localStorage.getItem('year') ? localStorage.getItem('year') : moment().year();
      const month = !!this.dateSelect ? this.dateSelect.format('MM') : storageMonth;
      const year = !!this.dateSelect ? this.dateSelect.format('YYYY') : storageYear;
      localStorage.setItem('month', month);
      localStorage.setItem('year', year);
      this.WeatherForecast = daily
      this.getDaysFromDate(parseInt(month), parseInt(year));
    }, (error: HttpErrorResponse) => {
      Swal.fire({
        title: `Error al obtener el pronostico del tiempo. Error: ${error.status}`,
        text: error.message,
        icon: 'error',
      })
    });
  }

  getImageIcon(day: any) {
    return `${this.baseUrlIcon}${day.weatherByDay.weather[0].icon}@2x.png`;
  }

  showWeatherDetail(day: any) {
    Swal.fire({
      title: `<strong>Detalle del clima</strong>`,
      icon: 'info',
      html: `
      <div>
      <img src="${this.getImageIcon(day)}" width="15%" />
        <div><strong>Descripción: </strong> ${day.weatherByDay.weather[0].description}  </div>
        <div><strong>Humedad: </strong> ${day.weatherByDay.humidity}%  </div>
        <div><strong>Max: </strong> ${day.weatherByDay.temp.max}°  </div>
        <div><strong>Mix: </strong> ${day.weatherByDay.temp.min}°  </div>
      </div>`,
      focusConfirm: false,
      confirmButtonText: '<i class="bi bi-hand-thumbs-up"></i> Genial!'
    })
  }

  showRemindersDay(day: any): void {
    let htmlReminders = '';
    day.reminders.map((reminder: Reminder) => {
      htmlReminders += `
        <div>
          <strong>Recordatorio:</strong> ${reminder.title}
          <i class="bi bi-calendar-event-fill" style="color: ${reminder.color}"></i>
        </div>
      `
    })

    Swal.fire({
      title: `<strong>Recordatorios del día: ${day.value}</strong>`,
      icon: 'info',
      html: ` <div> ${htmlReminders} </div>`,
      focusConfirm: false,
      confirmButtonText: 'Aceptar'
    })
  }
}
