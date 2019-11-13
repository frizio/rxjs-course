import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Course} from '../model/course';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {fromEvent} from 'rxjs';
import {concatMap, distinctUntilChanged, exhaustMap, filter, mergeMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

    form: FormGroup;
    course: Course;
    @ViewChild('saveButton', { static: true })
    saveButton: ElementRef;
    @ViewChild('searchInput', { static: true })
    searchInput: ElementRef;


    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course: Course ) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription, Validators.required]
        });

    }

    ngOnInit() {
      const formChanges$ = this.form.valueChanges
      .pipe(
          filter( () => this.form.valid ),
          // CONCAT strategy for combining observable in SEQUENTIAL manner:
          // waiting for an observer completation before subscribe and use the next observable
          concatMap(changes => this.saveCourse(changes))
          // MERGE strategy for combining observable in PARALLEL manner, for example: http requests or long running operations
          // mergeMap(changes => this.saveCourse(changes))
        );
      formChanges$.subscribe();
    }

    saveCourse(changes: any): Promise<any> {
      const theUrl = '/api/courses/' + this.course.id;
      return fetch(
        theUrl,
        {
          method: 'PUT',
          body: JSON.stringify(changes),
          headers: { 'content-type': 'application/json' }
        }
      );
    }

    ngAfterViewInit() {

      // Observable that models streams of clicks in the save button
      const buttonClick$ = fromEvent(this.saveButton.nativeElement, 'click');
      buttonClick$
        .pipe(
          exhaustMap( () => this.saveCourse(this.form.value) )
        )
        .subscribe();

     }

    close() {
        this.dialogRef.close();
    }

}
