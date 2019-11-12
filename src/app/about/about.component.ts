import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    // Click in the html page: countinuing stream
    document.addEventListener(
      'click',
      (event) => {
        console.log(event);
      }
    );

    // Long polling in the backgroud: continuing stream
    let counter = 0;
    setInterval(
      () => {
        console.log(counter);
        counter++;
      },
      1000
    );

    // Ajax request or Http request analogy: emit one value and complete
    setTimeout(() => {
      console.log('Time is over');
    }, 5000);

  }

}
