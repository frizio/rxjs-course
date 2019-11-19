import { Store } from './../common/store.service';
import { debug, RxJsLoggingLevel } from './../common/debug';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
  throttleTime,
  first,
  take
} from 'rxjs/operators';
import { merge, fromEvent, Observable, concat, forkJoin } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

  courseId: number;

  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild('searchInput', { static: true })
  input: ElementRef;


  constructor(
    private route: ActivatedRoute,
    private store: Store) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];
    this.course$ = this.store.selectCourseById(this.courseId);
    // course$ observable never complete. So:
    // first() force the completion of long running observable, take(3) generalize them.
    // .pipe
      // first()
      // take(2)
    // );

    /*
    forkJoin(this.course$, this.loadLessons())
      .subscribe(console.log);
    */

    this.loadLessons()
    .pipe(
      withLatestFrom( this.course$ )
    )
    .subscribe(
      ( [lessons, course] ) => {
        console.log(lessons);
        console.log(course);
      }

    )

  }

  ngAfterViewInit() {

    this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
                      .pipe(
                        map( event => event.target.value ),
                        startWith(''),
                        debug( RxJsLoggingLevel.TRACE, 'Search' ),
                        debounceTime(500),
                        distinctUntilChanged(),
                        switchMap(search => this.loadLessons(search)),
                        debug( RxJsLoggingLevel.DEBUG, 'Lessons value' ),
                      );

    fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map( event => event.target.value ),
        // debounceTime(500),
        throttleTime(1500),
      ).subscribe(console.log);

  }

  loadLessons(search: string = ''): Observable<Lesson[]> {
    return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
              .pipe(
                map( res => res['payload'] )
              );
  }

}
