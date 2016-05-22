import Rx from 'rx';

export const RequestRx = {};

RequestRx.get = (request, options) =>
  Rx.Observable.create(observer =>
    request.get(options, (error, response) => {
      if (error) {
        observer.onError(error);
        return;
      }

      observer.onNext(response);
      observer.onCompleted();
    }));

RequestRx.post = (request, options) =>
  Rx.Observable.create(observer => {
    request.post(options, (error, response) => {
      if (error) {
        observer.onError(error);
        return;
      }

      observer.onNext(response);
      observer.onCompleted();
    });
  });

RequestRx.put = (request, options) =>
  Rx.Observable.create(observer => {
    request.put(options, (error, response) => {
      if (error) {
        observer.onError(error);
        return;
      }

      observer.onNext(response);
      observer.onCompleted();
    });
  });

RequestRx.delete = (request, options) =>
  Rx.Observable.create(observer => {
    request.delete(options, (error, response) => {
      if (error) {
        observer.onError(error);
        return;
      }

      observer.onNext(response);
      observer.onCompleted();
    });
  });
