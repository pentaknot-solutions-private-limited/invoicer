import * as moment from "moment";

export function addDaysToPassedDate(
  passedDate: any,
  noOfDays: number | any = 0
): any {
  return moment(passedDate).add(noOfDays, "days").format();
}
