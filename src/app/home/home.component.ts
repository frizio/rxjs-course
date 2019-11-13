import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import { createHttpObservable } from '../common/util';
import { map, tap, shareReplay, catchError } from 'rxjs/operators';
import { noop, Observable, of } from 'rxjs';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor() { }

  ngOnInit() {

    const http$ = createHttpObservable('/api/courses');

    const courses$: Observable<Course[]> = http$
      .pipe(
        // tap is on operator used to produre side effect in the observable chain
        tap( () => console.log('HTTP request executed') ),
        map( res => res['payload'] ),
        // Share response between multiple subscription
        shareReplay(),
        catchError(
          err =>  {
            console.log('Catch error');
            // Provide alternative observable (example, values from offline database)
            of (
              [
                {
                  id: 0,
                  description: 'RxJs In Practice Course',
                  iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
                  courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
                  longDescription: 'Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples',
                  category: 'BEGINNER',
                  lessonsCount: 10
                },
                {
                  id: 8,
                  description: 'Angular Material Course',
                  iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/material_design.png',
                  longDescription: 'Build Applications with the official Angular Widget Library',
                  category: 'ADVANCED'
                }
              ]
          );
        }
        )
      );

    this.beginnerCourses$ = courses$
    .pipe(
      map( courses => courses.filter( course => course.category === 'BEGINNER' ) )
    );

    this.advancedCourses$ = courses$
    .pipe(
      map( courses => courses.filter( course => course.category === 'ADVANCED' ) )
    );

    // The subscription is now handled at the level of the template with observable var + async pipe

  }

}
