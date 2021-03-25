import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component'
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
  reminders: any[] = [
    { city: 'Xalapa', color: 'verde', date: '2021-03-25', time: '22:00 PM', text: 'Hola', day: 25}
  ];

  constructor(public modalService: NgbModal) {
  }

  ngOnInit(): void {
    console.log('reminder 0', moment(this.reminders[0].date).format('D'));

    this.getDaysFromDate((moment().month()+1), moment().year())
  }

  getDaysFromDate(month, year) {
    const startDate = moment.utc(`${year}/${month}/01`)
    const endDate = startDate.clone().endOf('month')
    this.dateSelect = startDate;

    const diffDays = endDate.diff(startDate, 'days', true)
    const numberDays = Math.round(diffDays);

    console.log('Object.keys([...Array(numberDays)])', [...Array(numberDays).keys()]);

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

    console.log('arrayDays', arrayDays);

    /* var sentences = arrayDays.map(function (emp) {
      var company = companies.filter(function (comp) {
        return comp.id === emp.compId;
      })[0];
      return "Employee '" + emp.name + "' of Age " + emp.age + " is working in " + company.name;
    }); */

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
