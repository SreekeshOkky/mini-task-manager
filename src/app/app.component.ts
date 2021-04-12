import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { DataService } from './shared/service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
@UntilDestroy()
export class AppComponent implements AfterContentChecked, OnInit {

  title = 'mini-task-manager';
  loader = false;

  constructor(
    private ref: ChangeDetectorRef,
    private data: DataService) { }

  ngOnInit() {
    this.data.loaderFlag.pipe(untilDestroyed(this)).subscribe(flag => this.loader = flag);
  }

  ngAfterContentChecked(): void {
    this.ref.detectChanges();
  }
}
