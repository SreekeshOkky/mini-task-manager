import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PRIORITY, SUCCESS_STATUS, TASK_COLUMNS } from 'src/app/constants';
import { ApiModel, SelectModel, TaskData, UserModel } from 'src/app/interfaces/interface';
import { DataService } from 'src/app/shared/service/data.service';
import { AddComponent } from '../add/add.component';
import { ApiService } from './../../services/api.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
@UntilDestroy()
export class ListComponent implements OnInit {

  public userList: UserModel[] = [];
  public priorityList: SelectModel[];
  private taskListOrg: any[];
  public taskDetailList: any = {};
  public filterMessage = '';

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private data: DataService
  ) { }

  ngOnInit(): void {
    this.priorityList = PRIORITY;

    this.data.showLoader(true);
    this.getAllUsers();
  }

  getAllUsers() {
    this.apiService.getAllUsers().pipe(untilDestroyed(this)).subscribe((res: ApiModel) => {
      if (res && res.status === SUCCESS_STATUS) {
        this.userList = res.users;
        this.data.changeUserList(this.userList);
        this.getAllTasks();
      }
      else {
        this.data.showLoader(false);
      }
    },
    error => {
      this._snackBar.open(error.message);
    });
  }

  getAllTasks() {
    this.data.showLoader(true);
    this.taskDetailList = {};
    this.apiService.getAllTasks().pipe(untilDestroyed(this)).subscribe((res: ApiModel) => {
      if (res.status = SUCCESS_STATUS) {
        res.tasks.map(task => {
          const assignedUser = this.userList.filter(user => user.id === task.assigned_to);
          const taskPriority = this.priorityList.filter(level => task.priority === level.value);
          task.priority_level = (taskPriority && taskPriority.length > 0) ? taskPriority[0].text : '';
          task.assignee = (assignedUser && assignedUser.length > 0) ? assignedUser[0].name : '';
          const sameLevelTasks = this.taskDetailList[task.priority] ? this.taskDetailList[task.priority] : [];
          sameLevelTasks.push(task);
          this.taskDetailList[task.priority] = sameLevelTasks;
        });
        this.taskListOrg = JSON.parse(JSON.stringify(res.tasks));
        this.clearFilter();
        this.data.showLoader(false);
      }
      else {
        this.data.showLoader(false);
      }
    },
    error => {
      this._snackBar.open(error.message);
    });
  }

  drop(event, level) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    const selectedTask = event.container.data[event.currentIndex];
    const dataToSave = selectedTask;
    dataToSave.due_date = dataToSave.due_date === null ? '' : dataToSave.due_date;
    dataToSave.due_date = (typeof dataToSave.due_date === 'string') ? dataToSave.due_date : dataToSave.due_date.format('Y-MM-DD hh:mm:ss');
    dataToSave.priority = level;
    dataToSave.taskid = dataToSave.id;
    this.data.showLoader(true);
    const formData: any = new FormData();
    Object.keys(dataToSave).forEach(key => {
      formData.append(key, dataToSave[key]);
    });
    this.apiService.updateTask(formData).pipe(untilDestroyed(this)).subscribe((res: ApiModel) => {
      if (res.status === SUCCESS_STATUS) {
        this._snackBar.open('Task priority successfully updated');
        this.getAllTasks();
      }
      else {
        this.data.showLoader(false);
      }
    },
    error => {
      this._snackBar.open(error.message);
    });
  }

  openAddTask() {
    const dialogRef = this.dialog.open(AddComponent);

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result === SUCCESS_STATUS) {
        this._snackBar.open('Task successfully created');
        this.getAllTasks();
      }
      else {
        this.data.showLoader(false);
      }
    },
    error => {
      this._snackBar.open(error.message);
    });
  }

  editTask(data) {
    const dialogRef = this.dialog.open(AddComponent, { data });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result === SUCCESS_STATUS) {
        this._snackBar.open('Task successfully updated');
        this.getAllTasks();
      }
    });
  }

  openDeleteDialog(data) {
    const dialogRef = this.dialog.open(DeleteDialog, { data });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result === SUCCESS_STATUS) {
        this._snackBar.open('Task deleted');
        this.getAllTasks();
      }
    });
  }

  filterData() {
    this.taskDetailList = {};
    const text = this.filterMessage.trim();
    this.taskListOrg.forEach(task => {
      const validText = text !== '' ? task.message.toLowerCase().includes(text) : true;
      if (validText) {
      const sameLevelTasks = this.taskDetailList[task.priority] ? this.taskDetailList[task.priority] : [];
      sameLevelTasks.push(task);
      this.taskDetailList[task.priority] = sameLevelTasks;
      }
    });
  }

  clearFilter() {
    this.filterMessage = '';
    this.taskDetailList = {};
    this.taskListOrg.forEach(task => {
      const sameLevelTasks = this.taskDetailList[task.priority] ? this.taskDetailList[task.priority] : [];
      sameLevelTasks.push(task);
      this.taskDetailList[task.priority] = sameLevelTasks;
    });
  }

}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'delete-dialog.html',
})
@UntilDestroy()
export class DeleteDialog {

  constructor(
    private data: DataService,
    private dialogRef: MatDialogRef<DeleteDialog>,
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public taskDetail: TaskData) {
    dialogRef.disableClose = true;
  }

  deleteTask(): void {
    this.data.showLoader(true);
    const formData: any = new FormData();
    formData.append('taskid', this.taskDetail.id);
    this.apiService.deleteTask(formData).pipe(untilDestroyed(this)).subscribe((res: ApiModel) => {
      if (res.status === SUCCESS_STATUS) {
        this.dialogRef.close(SUCCESS_STATUS);
      }
      else {
        this.data.showLoader(false);
      }
    },
    error => {
      this._snackBar.open(error.message);
    });
  }

  dismissDialog(): void {
    this.dialogRef.close();
  }

}

