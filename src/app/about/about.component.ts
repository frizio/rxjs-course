import { map } from 'rxjs/operators';
import { interval, timer, fromEvent, of, concat, merge } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { createHttpObservable } from '../common/util';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    // this.playWithStreamAndObservable();

    // this.concatenationExample();

   //  this.mergeExample();

   this.unsubscriptionExample();

  }

  unsubscriptionExample() {
    const interval1$ = interval(1000);
    const subscription = interval1$.subscribe(console.log);
    setTimeout(() => {
      console.log('Time is over');
      subscription.unsubscribe();
    }, 5000);

    const http$ = createHttpObservable('/api/courses');
    const sub = http$.subscribe(console.log);
    setTimeout(() => {
      sub.unsubscribe();
    }, 0);

  }

  mergeExample() {
    const interval1$ = interval(1000);
    const interval2$ = interval1$.pipe( map( value => 10 * value ) );
    const result2$ = merge(interval1$, interval2$);
    result2$.subscribe(console.log);
  }

  concatenationExample() {

    // Observable concatenation example
    const source1$ = of(1, 2, 3);
    const source2$ = of(3, 4, 5);
    const source3$ = of(7, 8, 9);

    // Sequentatial concatenation
    const result$ = concat(source1$, source2$, source3$);
    result$.subscribe(console.log);

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
