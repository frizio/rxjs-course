import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import { createHttpObservable } from '../common/util';
import { map } from 'rxjs/operators';
import { noop, Observable } from 'rxjs';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses: Course[];

  advancedCourses: Course[];

  constructor() { }

  ngOnInit() {

    const http$ = createHttpObservable('/api/courses');
    const courses$: Observable<Course[]> = http$
      .pipe(
        map( res => Object.values(res['payload']) )
      );


    // The subscription is now handled at the level of the template with async pipe
    courses$.subscribe(
      courses => {
        console.log(courses);
        this.beginnerCourses =
          courses.filter( course => course.category === 'BEGINNER' );
        this.advancedCourses =
          courses.filter( course => course.category === 'ADVANCED' );
      },
      noop,
      () => console.log('Completed')
    );


    }

}
