import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StoreDataService } from '../../services';

const WEEK_DAYS_NUMBER = 7;

@Component({
  selector: 'y-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnChanges {
  @Input() location: any;
  days: Date[] = null;

  constructor(private storeDataService: StoreDataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const initialDate = this.getInitialDate();
    this.days = [];

    for (let i = 0; i < WEEK_DAYS_NUMBER; i++) {
      const date = new Date(initialDate.valueOf());
      date.setDate(date.getDate() + i);
      this.days.push(date);
    }
  }

  /**
   * return initial (first) date to be displayed in the schedule
   */
  protected getInitialDate(): Date {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());

    return currentDate;
  }

  /**
   * Returns the store's opening time for the given date
   * @param date date
   */
  protected getStoreOpeningTime(date: Date): Date {
    return this.storeDataService.getStoreOpeningTime(this.location, date);
  }

  /**
   * Returns the store's closing time for the given date
   * @param date date
   */
  protected getStoreClosingTime(date: Date): Date {
    return this.storeDataService.getStoreClosingTime(this.location, date);
  }
}
