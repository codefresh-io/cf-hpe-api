import Rx from 'rx';

export class RequestRx {
  static get(request, options) {
    return Rx.Observable.create(observer => {
      request.get(options, (error, response) => {
        if (error) {
          observer.onError(error);
          return;
        }

        observer.onNext(response);
        observer.onCompleted();
      });
    });
  }

  static post(request, options) {
    return Rx.Observable.create(observer => {
      request.post(options, (error, response) => {
        if (error) {
          observer.onError(error);
          return;
        }

        observer.onNext(response);
        observer.onCompleted();
      });
    });
  }

  static put(request, options) {
    return Rx.Observable.create(observer => {
      request.put(options, (error, response) => {
        if (error) {
          observer.onError(error);
          return;
        }

        observer.onNext(response);
        observer.onCompleted();
      });
    });
  }

  static delete(request, options) {
    return Rx.Observable.create(observer => {
      request.delete(options, (error, response) => {
        if (error) {
          observer.onError(error);
          return;
        }

        observer.onNext(response);
        observer.onCompleted();
      });
    });
  }

}
