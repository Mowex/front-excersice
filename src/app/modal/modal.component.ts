import { Component, OnInit, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() reminder;
  @Output() reminderData;
  colors = [ { name: 'Verde', }, { name: 'Amarillo', }, { name: 'Rojo', } ];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
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
    'text': ['', [
    ]]
  });

  ngOnInit(): void {
  }

  saveReminder() {
    console.log('formData::', this.reminderForm.value);

  }

}
