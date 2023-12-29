import * as moment from "moment";

export const dateFormatter = (value: any, format?: string) => {
  const date = moment(value).format(format || "DD/MM/YYYY");
  return value ? (date === "Invalid date" ? "-" : date) : "-";
};
export const dateTimeFormatter = (value: any, format?: string) => {
  const date = moment(value).format(format || "DD/MM/YYYY HH:mm");
  return value ? (date === "Invalid date" ? "-" : date) : "-";
};
