import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber'
})
export class PhoneFormatPipe implements PipeTransform {

  transform(value: any): string  {
    if (typeof value !== 'string') {
      return value;
    }

    const cleaned = value.replace(/\D/g, '').substring(0, 10); 
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return cleaned;
  }
}

