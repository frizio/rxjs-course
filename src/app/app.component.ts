import { Store } from './common/store.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private store: Store
  ) { }

  ngOnInit() {
    // Filling the store with data at application start-time.
    this.store.init();
  }


}
