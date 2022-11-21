import * as moment from "moment";

export const dateFormatter = (value) => {
    const date = moment(value).format('YYYY/MM/DD')
    return value ? (date === 'Invalid date' ? '-' : date) : "-";
}
export const dateTimeFormatter = (value) => {
    const date = moment(value).format('YYYY/MM/DD HH:mm')
    return value ? (date === 'Invalid date' ? '-' : date) : "-";

}