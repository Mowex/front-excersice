import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component'
import { Reminder } from '../classes/reminder';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../classes/appState';
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
  dateValue: any;
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
      console.log('state:::', state);
      this.reminders = state.reminders;
    })

    // console.log('Object.keys([...Array(numberDays)])', [...Array(numberDays).keys()]);

    const arrayDays = Object.keys([...Array(numberDays)]).map((a: any) => {
      a = parseInt(a) + 1;
      const dayObject = moment(`${year}-${month}-${a}`);
      const reminder = this.reminders.filter((reminder) => {
        return a === parseInt(moment(reminder.date).format('D'))
      })[0]

      return {
        name: dayObject.format("dddd"),
        value: a,
        indexWeek: dayObject.isoWeekday(),
        reminder: reminder || null
      };
    });

    console.log('arrayDays:::', arrayDays);

    console.log('arrayDays', arrayDays);
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

  clickDay(day) {
    const monthYear = this.dateSelect.format('YYYY-MM')
    const parse = `${monthYear}-${day.value}`
    const objectDate = moment(parse)
    this.dateValue = objectDate;
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true });
  }

}
