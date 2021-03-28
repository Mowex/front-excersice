import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reminder } from '../classes/reminder';
import { Store } from '@ngrx/store';
import { AppState } from '../classes/appState';
import { AddReminder, EditReminder, DeleteReminder } from '../actions/reminder.actions';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import * as moment from 'moment'
import 'moment/locale/es'

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() reminder: Reminder;
  title: string;
  reminderForm: FormGroup;
  colors = [
    { name: 'Verde', value: 'green' },
    { name: 'Amarillo', value: 'yellow' },
    { name: 'Rojo',  value: 'red' }
  ];
  myDatePickerOptions: IAngularMyDpOptions = {
    disableUntil: { year: moment().year(), month: moment().month() + 1, day: moment().date() -1 },
  };

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.title = 'Agregar Recordatorio';
    this.reminderForm = this.formBuilder.group({
      'id': ['', []],
      'title': ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
      'city': ['', [
        Validators.required,
      ]],
      'date': ['', [
        Validators.required,
      ]],
      'time': ['', [
        Validators.required,
      ]],
      'color': ['', [
        Validators.required
      ]],
      'description': ['', [
        Validators.minLength(3)
      ]]
    });

    if (!!this.reminder) {
      const dataControls = this.reminderForm.controls;
      dataControls.id.setValue(this.reminder.id);
      dataControls.title.setValue(this.reminder.title);
      dataControls.city.setValue(this.reminder.city);
      dataControls.date.setValue(this.reminder.date);
      dataControls.time.setValue(this.reminder.time);
      dataControls.color.setValue(this.reminder.color);
      dataControls.description.setValue(this.reminder.description);
      this.title = 'Editar Recordatorio';
    }
  }

  addReminder() {
    if (!!this.reminder) {
      const action = new EditReminder(this.reminderForm.value);
      this.store.dispatch(action);
    } else {
      this.reminderForm.controls.id.setValue(Date.now());
      const action = new AddReminder(this.reminderForm.value);
      this.store.dispatch(action);
    }
    this.reloadCalendar();
    this.activeModal.close();
  }

  confirmDeleteReminder() {
    Swal.fire({
      title: 'Eliminar recordatorio',
      text: "¿Desea borrar este recordatorio? Esta acción es irreversible",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteReminder();
      }
    })
  }

  deleteReminder() {
    const action = new DeleteReminder(this.reminder);
    this.store.dispatch(action);
    this.reloadCalendar();
    this.activeModal.close();
  }

  reloadCalendar() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}
