import { Store } from './../common/store.service';
import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import { createHttpObservable } from '../common/util';
import { map, tap, shareReplay, catchError, finalize, retryWhen, delayWhen } from 'rxjs/operators';
import { noop, Observable, of, throwError, timer } from 'rxjs';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(
    private store: Store
  ) { }

  ngOnInit() {

    const http$ = createHttpObservable('/api/courses');

    const courses$: Observable<Course[]> = http$
      .pipe(
        // tap is on operator used to produre side effect in the observable chain
        tap( () => console.log('HTTP request executed') ),
        map( res => res['payload'] ),
        // Share response between multiple subscription
        shareReplay(),
        retryWhen(
          errors => {
            console.log(errors);
            return errors.pipe(
              delayWhen( () => timer(2000) )
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
