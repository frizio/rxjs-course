import { Store } from './../common/store.service';
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

        private store: Store,

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

    ngOnInit() { }

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

     }

    close() {
        this.dialogRef.close();
    }

    save() {
      // Trigger store modification method
      this.store.saveCourse(this.course.id, this.form.value)
        .subscribe(
          () => this.close(),
          (err) => alert(err)
        );
    }

}
