export const convertAmountToMilliion = (num: any, prefix: string = "$ ", toFix: number = 1) => {
  num = Number(num);
  if (num > 999 && num < 1000000) {
    return prefix + (num / 1000).toFixed(toFix) + "K"; // convert to K for number from > 1000 < 1 million
  } else if (num > 1000000) {
    return prefix + (num / 1000000).toFixed(toFix) + "M"; // convert to M for number from > 1 million
  } else if (num < 900) {
    return prefix + num; // if value < 1000, nothing to do
  } else {
    return num
  }
};
