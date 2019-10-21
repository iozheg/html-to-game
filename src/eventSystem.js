import { Subject } from "rxjs";
import { filter } from "rxjs/operators";

const subject = new Subject();

export default {
  send: (type, data) => subject.next({ type, data }),
  on: type =>
    subject
      .asObservable()
      .pipe(filter(message => (type ? message.type === type : true)))
};
