import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'day' })
export class DayPipe implements PipeTransform {
  transform(day: number): any {
    const weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    return weekday[day];
  }
}
