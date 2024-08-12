function isMobileLark() {
    const ua = window.navigator.userAgent;
    const isLark = /feishu/i.test(ua) || /lark/i.test(ua);
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(ua);
    return isLark && isMobile;
}
if (isMobileLark()) {
    // 满足一定条件的时候，重定向到图片
    window.location.href = "https://lf3-static.bytednsdoc.com/obj/eden-cn/ulwv_lzhi_ryhs/ljhwZthlaukjlkulzlp/dashboard/mobile_disable.html";

    // 阻止后续内容加载
    document.head.insertAdjacentHTML(
        "beforeend",
        `<meta http-equiv="Content-Security-Policy" content="script-src 'none'">`
    );
}
