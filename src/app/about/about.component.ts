import { interval, timer, fromEvent, Observable, noop } from 'rxjs';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    // this.playWithStreamAndObservable();

    const http$ = Observable.create(
      observer => {
        fetch('/api/courses') // return Promise<Response>
          .then(
            response => {
              return response.json();
            }
          )
          .then(
            body => {
              observer.next(body),
              observer.complete();
            }
          )
          .catch(
            err => {
              observer.error(err);
              console.log(err);
            }
          );
      }
    );

     http$.subscribe(
       courses => console.log(courses),
       noop,
       () => console.log('Completed')
     );

  }

  playWithStreamAndObservable() {
    // Stream DEFINITION (not instance) with RxJS: A stream is of type Observable<>
    const interval$ = interval(1000);

    // An observable is a blue print for a stream.
    // An observable become a stream only if there is a subscription to them.
    interval$.subscribe( (value) => console.log('Stream 1: ' + value) );
    // Another stream
    interval$.subscribe( (value) => console.log('Stream 2: ' + value) );

    const timer$ = timer(3000, 1000);
    timer$.subscribe( (value) => console.log('Stream 3: ' + value) );

    const click$ = fromEvent(document, 'click');
    click$.subscribe( (event) => console.log(event) );

    const theSubscription = interval$.subscribe(
      (value) => console.log('Stream 5: ' + value),
      (error) => console.log(error),
      () => console.log('Stream 5 completed')
    );

    setTimeout(() => {
      console.log('Unsubscription stream 5');
      theSubscription.unsubscribe();
    }, 5000);
  }

}
