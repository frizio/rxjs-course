import { Observable } from 'rxjs';

export function createHttpObservable(url: string): Observable<any> {

  return Observable.create(
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

}
