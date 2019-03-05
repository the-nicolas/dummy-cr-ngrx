import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'createArray'
})
export class CreateArrayPipe implements PipeTransform {

  transform(length: number, start: number): any {
    let res = [];
    let i = 0
    let _length;
    if (start) {
      i = start;
      _length = length + start;
    } else {
      _length = length;
    }
    for (i; i < _length; i++) {
      res.push(i);
    }
    console.log(res);
    return res;
  }

}
