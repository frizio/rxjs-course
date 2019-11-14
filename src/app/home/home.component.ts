import { Observable } from 'rxjs';
import { Course } from './../model/course';
import { Store } from './../common/store.service';
import {Component, OnInit} from '@angular/core';

// Tge component is now a pure projection of the state.

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

    const courses$ = this.store.courses$;

    this.beginnerCourses$ = this.store.selectBeginnerCourses();

    this.advancedCourses$ = this.store.selectAdvancedCourses();

    // The subscription is now handled at the level of the template with observable var + async pipe

  }

}
