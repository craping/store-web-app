/**
 * 转换时间格式
 * 用法：format(ms,'yyyy-MM-dd hh:mm:ss')
 * @param time 毫秒数
 * @param fmt 要转换的时间格式
 */
export function format(time, fmt) {
    var d = new Date(time);
    var o = {
        "M+": d.getMonth() + 1,               //月份
        "d+": d.getDate(),                    //日
        "h+": d.getHours(),                   //小时
        "m+": d.getMinutes(),                 //分
        "s+": d.getSeconds(),                 //秒
        "q+": Math.floor((d.getMonth() + 3) / 3), //季度
        "S": d.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export function UUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

export function PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}