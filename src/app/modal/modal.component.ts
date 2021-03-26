import { Component, OnInit, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reminder } from '../classes/reminder';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../classes/appState';
import { AddReminder, EditReminder } from '../actions/reminder.actions';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() reminder: Reminder;
  title: string;
  colors = [
    { name: 'Verde', value: 'green' },
    { name: 'Amarillo', value: 'yellow' },
    { name: 'Rojo',  value: 'red' }
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  reminderForm: FormGroup = this.formBuilder.group({
    'id': ['', [ ]],
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
      Validators.minLength(3),
      Validators.maxLength(30)
    ]]
  });

  ngOnInit(): void {
    this.title = 'Agregar Recordatorio';
    if (!!this.reminder) {
      const dataControls = this.reminderForm.controls;
      dataControls.id.setValue(this.reminder.id);
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

    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);

    this.activeModal.close();
  }
}
