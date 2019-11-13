import { Observable } from 'rxjs';

export function createHttpObservable(url: string) {

  return Observable.create(

    observer => {
      // Use abort controller to make the http request 'cancellable'
      const controller = new AbortController();
      const signal = controller.signal;

      fetch(url, {signal}) // return Promise<Response>
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
      return () => controller.abort();
    }
  );

}
