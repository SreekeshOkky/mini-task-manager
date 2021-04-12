import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DATE_FORMAT, PRIORITY, SUCCESS_STATUS } from 'src/app/constants';
import { DataService } from 'src/app/shared/service/data.service';
import { ApiService } from '../../services/api.service';

import { ApiModel, SelectModel, TaskData, UserModel } from './../../../../interfaces/interface';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT }
  ]
})
@UntilDestroy()
export class AddComponent implements OnInit {

  public priorityList: SelectModel[];
  public userList: UserModel[];
  public taskForm: FormGroup;

  constructor(
    private data: DataService,
    private dialogRef: MatDialogRef<AddComponent>,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public taskDetail: TaskData
  ) {
    dialogRef.disableClose = true;
    this.taskForm = this.formBuilder.group({
      message: ['', Validators.required],
      priority: [''],
      due_date: [''],
      assigned_to: ['']
    });
  }

  ngOnInit(): void {

    if (this.taskDetail) {
      this.taskForm.patchValue(this.taskDetail);
    }

    this.priorityList = PRIORITY;
    this.data.users.pipe(untilDestroyed(this)).subscribe(data => this.userList = data);
  }

  saveTask() {

    if (this.taskForm.valid) {
      this.data.showLoader(true);
      const dataToSave = this.taskForm.value;
      dataToSave.due_date = dataToSave.due_date === null ? '' : dataToSave.due_date;
      dataToSave.due_date = (typeof dataToSave.due_date === 'string') ? dataToSave.due_date : dataToSave.due_date.format('Y-MM-DD hh:mm:ss');
      const formData: any = new FormData();
      Object.keys(dataToSave).forEach(key => {
        formData.append(key, dataToSave[key]);
      });

      if (this.taskDetail && this.taskDetail.id) {
        formData.append('taskid', this.taskDetail.id);
        this.apiService.updateTask(formData).pipe(untilDestroyed(this)).subscribe((res: ApiModel) => {
          if (res.status === SUCCESS_STATUS) {
            this.dialogRef.close(SUCCESS_STATUS);
          }
          else {
            this._snackBar.open(res.error);
            this.data.showLoader(false);
          }
        },
          error => {
            this._snackBar.open(error.message);
          });
      }
      else {
        this.apiService.createTask(formData).pipe(untilDestroyed(this)).subscribe((res: ApiModel) => {
          if (res.status === SUCCESS_STATUS) {
            this.dialogRef.close(SUCCESS_STATUS);
          }
          else {
            this._snackBar.open(res.error);
            this.data.showLoader(false);
          }
        },
        error => {
          this._snackBar.open(error.message);
        });
      }
    }
  }
}
