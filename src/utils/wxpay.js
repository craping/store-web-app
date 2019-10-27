//微信浏览器支付
export function wxpay(params, callback) {
  if (typeof WeixinJSBridge == 'undefined') {
    if (document.addEventListener) {
      document.addEventListener(
        'WeixinJSBridgeReady',
        onBridgeReady(params, callback),
        false
      )
    } else if (document.attachEvent) {
      document.attachEvent(
        'WeixinJSBridgeReady',
        onBridgeReady(params, callback)
      )
      document.attachEvent(
        'onWeixinJSBridgeReady',
        onBridgeReady(params, callback)
      )
    }
  } else {
    onBridgeReady(params, callback)
  }
}

function onBridgeReady(params, callback) {
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest',
    {
      appId: params.appId,
      timeStamp: params.timeStamp,
      nonceStr: params.nonceStr,
      package: params.package,
      signType: params.signType,
      paySign: params.paySign
    },
    function(res) {
      callback(res)
    }
  )
}
