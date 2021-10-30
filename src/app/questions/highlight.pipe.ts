import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  constructor() { }

  transform(value: any, args?: string): any {
  console.log(args)
    return value.toLowerCase();
  }

}