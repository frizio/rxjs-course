import { tap, map } from 'rxjs/operators';
import { Course } from './../model/course';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { createHttpObservable } from './util';

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
  courses$: Observable<Course[]> = this.subject.asObservable();


  init() {

    const http$ = createHttpObservable('/api/courses');

    const courses$: Observable<Course[]> = http$
      .pipe(
        tap( () => console.log('HTTP request executed') ),
        map( res => res['payload'] )
        /*
        retryWhen(
          errors => {
            console.log(errors);
            return errors.pipe(
              delayWhen( () => timer(2000) )
            );
          }
        )
        */
      );

      courses$.subscribe( courses => this.subject.next(courses) );

  }

  // SELECTOR METHODS
  selectBeginnerCourses() {
    return this.filterByCategory('BEGINNER');
  }

  selectAdvancedCourses() {
    return this.filterByCategory('ADVANCED');
  }

  filterByCategory(category: string) {

    return this.courses$
      .pipe(
        map( courses => courses.filter( course => course.category === category ) )
      );

  }


}
