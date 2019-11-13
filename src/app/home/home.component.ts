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
            return of ( [] );
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
