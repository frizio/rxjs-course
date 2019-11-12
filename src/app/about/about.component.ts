import { interval, timer, fromEvent } from 'rxjs';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    // Stream DEFINITION (not instance) with RxJS: A stream is of type Observable<>
    const interval$ = interval(1000);

    // An observable become a stream only if there is a subscription to them.
    // interval$.subscribe( (value) => console.log('Stream 1: ' + value) );
    // Another stream
    // interval$.subscribe( (value) => console.log('Stream 2: ' + value) );

    const timer$ = timer(3000, 1000);
    timer$.subscribe( (value) => console.log('Stream 3: ' + value) );

    const click$ = fromEvent(document, 'click');
    click$.subscribe( (event) => console.log(event) );

  }

}
