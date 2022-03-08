import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'status' })
export class StatusPipe implements PipeTransform {
  transform(status: number): any {
    if (status === 2) {
      return 'Blocked';
    } else if (status === 1) {
      return 'UnBlocked';
    }
  }
}
