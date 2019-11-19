import { tap, map, filter } from 'rxjs/operators';
import { Course } from './../model/course';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { createHttpObservable } from './util';
import { fromPromise } from 'rxjs/internal-compatibility';

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

  // SELECTOR METHODS: Data consuming operations
  selectBeginnerCourses() {
    return this.filterByCategory('BEGINNER');
  }

  selectAdvancedCourses() {
    return this.filterByCategory('ADVANCED');
  }

  selectCourseById(courseId: number) {
    return this.courses$
      .pipe(
        map( courses => courses.find( course => course.id === courseId ) ),
        filter( course => !!course )
      );
  }

  filterByCategory(category: string) {
    return this.courses$
      .pipe(
        map( courses => courses.filter( course => course.category === category ) )
      );
  }

  saveCourse(courseId: number, changes): Observable<any> {
    // Save the course in the in memory store
    // broadcast the new value over the course to all subscribers.

    // So the store is going to be modified optimistically in memory.
    const courses = this.subject.getValue();
    const courseIdx = courses.findIndex( course => course.id === courseId );
    const newCourses = courses.slice(0);
    newCourses[courseIdx] = {
      ...courses[courseIdx],
      ...changes
    };
    this.subject.next(newCourses);

    // Then a request is going to be made to the backend,
    // and the course is also going to be saved in our database.
    return fromPromise(
      fetch(
        `/api/courses/${courseId}`,
        {
          method: 'PUT',
          body: JSON.stringify(changes),
          headers: { 'content-type': 'application/json' }
        }
      )
    );

  }


}
