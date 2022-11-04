export const findDistinctValues = (data: any[], key: any | string) => {
    const unique = data.filter((elem: any, index: any) => data.findIndex((obj: any) => obj[key] === elem[key]) === index);
    return unique;
}