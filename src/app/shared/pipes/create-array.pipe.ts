import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'createArray'
})
export class CreateArrayPipe implements PipeTransform {
  transform(length: number, start: number): any {
    let res = [];
    let index = 0
    let _length;
    if (start) {
      index = start;
      _length = length + start;
    } else {
      _length = length;
    }
    for (index; index < _length; index++) {
      res.push(index);
    }
    return res;
  }

}
