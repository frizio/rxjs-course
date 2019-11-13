import { Observable } from 'rxjs';

// Our custum debug operator is an High order function

export const debug =
  (level: number, message: string) =>
    (source: Observable<any>) =>
      source.pipe(
        tap(
          val => {
            console.log( message + ': ' + val );
          }
        )
      );
