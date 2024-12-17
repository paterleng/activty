// 计算与当前时间差值,返回以秒为单位
export const timeValue =  (oldTime) => {// 示例：ISO 8601 格式
    const targetDate = new Date(oldTime);
    const currentDate = new Date();
    const timeDifference = targetDate - currentDate;
    const seconds = Math.floor(timeDifference / 1000);
    return seconds;
}