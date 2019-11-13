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
            if (response.ok) {
              return response.json();
            } else {
              observer.error('Request failed with status code: ' + response.status);
            }
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
            console.log(err);
            observer.error(err);
          }
        );
      return () => controller.abort();
    }
  );

}
