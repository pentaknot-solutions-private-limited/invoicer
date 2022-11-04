export function sumByKey(rowData: any[], key: string) {
    let sumVal = 0;
    rowData.forEach(row => {
        sumVal += row[key];
    })
    return Number(sumVal);
}