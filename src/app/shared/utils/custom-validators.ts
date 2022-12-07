import { AbstractControl } from "@angular/forms";

// Use it for FormArray Validation
export const minLengthArray = (min: number) => {
    return (c: AbstractControl): {[key: string]: any} => {
      if (c.value.length >= min)
        return null;
  
      return { MinLengthArray: true};
    }
}

export const requiredSelectedData = () => {
  return (c: AbstractControl): {[key: string]: any} => {
    if (c.value.reduce((count, data) => { return count + data.isActive },0) > 0)
      return null;

    return { RequiredSelectedData: true};
  }
}