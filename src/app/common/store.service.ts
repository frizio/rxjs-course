import { Course } from './../model/course';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

// CENTRALIZED OBSERVABLE STORE
// Design a centralized service that is going to contain our data and that service is going to expose a couple of observables.
// This service is going to be responsible for fetching the data from the backend at the appropriate moment.
// - it's going to be responsible for storing that data in memory
// - it providing the to the rest of the application in the form of an observable.

@Injectable({
  providedIn: 'root'
})
export class Store {

  private subject = new BehaviorSubject<Course[]>([]);
  // Late subscriber get the latest emitted value

  // Public API of the store
  course$: Observable<Course[]> = this.subject.asObservable();


  init() {

  }


}
