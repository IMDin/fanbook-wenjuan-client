let baseApi = "";
let isDev = false;
// 正式环境
if (~(location.host.indexOf(".fanbook.mobi"))) {
	baseApi = `https://open.fanbook.mobi/mp/195452636021915648/237779111534133248`;
	isDev = false;
} 
// 测试环境 (39)
else if (~(location.host.indexOf("10.100.1.39"))) {
	baseApi = "http://10.100.1.39/mp/195452636021915648/237779111534133248";
	isDev = true;
} 
// 开发环境
else {
	baseApi = "http://192.168.104.205:8888"; //ethan.li
	isDev = true;
}

export const CONFIG = {
	baseApi: baseApi,
	isDev: isDev,
};