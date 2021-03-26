import { Component, OnInit, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reminder } from '../classes/reminder';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../classes/appState';
import { AddReminder } from '../actions/reminder.actions';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() reminder: Reminder;
  colors = [ { name: 'Verde', }, { name: 'Amarillo', }, { name: 'Rojo', } ];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) { }

  reminderForm: FormGroup = this.formBuilder.group({
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
    ]]
  });

  ngOnInit(): void {

  }

  addReminder() {
    const action = new AddReminder(this.reminderForm.value);
    this.store.dispatch(action);
  }

}
