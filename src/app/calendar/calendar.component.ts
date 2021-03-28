import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component'
import { Reminder } from '../classes/reminder';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../classes/appState';
import Swal from 'sweetalert2'
import * as moment from 'moment'
import 'moment/locale/es'
import { DeleteAllReminders, DeleteReminder } from '../actions/reminder.actions';

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

  constructor(
    public modalService: NgbModal,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.getDaysFromDate((moment().month()+1), moment().year());
  }

  getDaysFromDate(month, year) {
    const startDate = moment.utc(`${year}/${month}/01`)
    const endDate = startDate.clone().endOf('month')
    this.dateSelect = startDate;

    const diffDays = endDate.diff(startDate, 'days', true)
    const numberDays = Math.round(diffDays);

    this.store.subscribe(state => {
      this.reminders = state.reminders;
    })

    console.log('this.reminders.state:::', this.reminders);


    const arrayDays = Object.keys([...Array(numberDays)]).map((a: any) => {
      a = parseInt(a) + 1;
      const dayObject = moment(`${year}-${month}-${a}`);
      const reminders = [];
      if (!!this.reminders){
        this.reminders.map((rem) => {
          const { date: { singleDate: { formatted } } } = rem;
          if (a === parseInt(moment(formatted).format('D')) &&
              month === parseInt(moment(formatted).format('M')) &&
              year === parseInt(moment(formatted).format('YYYY'))) {
            reminders.push(rem);
          }
        })[0]
      }
      const sortReminder = reminders.sort((a, b) => a.time.localeCompare(b.time));

      return {
        name: dayObject.format("dddd"),
        value: a,
        indexWeek: dayObject.isoWeekday(),
        reminders: !!sortReminder.length ? reminders : null
      };
    });

    this.monthSelect = arrayDays;
  }

  changeMonth(flag) {
    if (flag < 0) {
      const prevDate = this.dateSelect.clone().subtract(1, "month");
      this.getDaysFromDate(prevDate.format("MM"), prevDate.format("YYYY"));
    } else {
      const nextDate = this.dateSelect.clone().add(1, "month");
      this.getDaysFromDate(nextDate.format("MM"), nextDate.format("YYYY"));
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
    this.getDaysFromDate(this.dateSelect.format('M'), this.dateSelect.format('Y'));
  }

}
