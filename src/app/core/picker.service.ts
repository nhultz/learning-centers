import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { Center } from './models';

@Injectable({
  providedIn: 'root'
})
export class PickerService {
  private currentCentersSource = new Subject<Array<Center>>();
  private centers = new Array(6);

  currentCenters = this.currentCentersSource
    .asObservable()
    .pipe(startWith(this.centers));

  chooseCenter(idx: number, center: Center) {
    this.centers[idx] = center;
    this.currentCentersSource.next(this.centers);
  }
}
