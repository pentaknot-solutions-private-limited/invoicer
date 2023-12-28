import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "indianCurrency" })
export class IndianCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    // Check if the value is a valid number
    if (!isNaN(value) && value !== null && value !== undefined) {
      // Format the number as Indian currency (assuming value is in rupees)
      const formattedAmount = value.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
      return formattedAmount;
    }
    return value.toString(); // Return the original value if it's not a valid number
  }
}
