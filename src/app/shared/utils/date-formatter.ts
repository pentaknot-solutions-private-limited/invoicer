import * as moment from "moment";

export const dateFormatter = (value) => {
    const date = moment(value).format('DD/MM/YYYY')
    return value ? (date === 'Invalid date' ? '-' : date) : "-";
}
export const dateTimeFormatter = (value) => {
    const date = moment(value).format('DD/MM/YYYY HH:mm')
    return value ? (date === 'Invalid date' ? '-' : date) : "-";

}