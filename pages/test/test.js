// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },
  
  //初始化小程序蓝牙模块
  initBlue: function (e) {
    let that = this;
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log("初始化小程序蓝牙模块 suc -->", res);
      },
      fail: function (res) {
        console.log("初始化小程序蓝牙模块 fail -->", res);
      },
    })
  },

  // 获取本机蓝牙适配器状态
  getBluetoothAdapterState: function () {
    wx.getBluetoothAdapterState({
      success: function (res) {
        console.log("获取本机蓝牙适配器状态 suc->", res)
      },
      fail: function (res) {
        console.log("获取本机蓝牙适配器状态fail -->", res);
      },
    })
  },

  //开始搜寻附近的蓝牙外围设备 。注意，该操作比较耗费系统资源，请在搜索并连接到设备后调用 stop 方法停止搜索。
  startBluetoothDevicesDiscovery:function(){
    let that = this;
    wx.startBluetoothDevicesDiscovery({
      services: ['FFF0', 'FFF1', 'FFF2', 'FFF3', 'FFF4', 'FFF5'],
      interval: "2000", //每一秒获取一次数据
      allowDuplicatesKey: true,
      success: function (res) {
        console.log("开始搜寻附近的蓝牙外围设备 -->", res)
        //监听寻找到新设备的事件
        // that.onBluetoothDeviceFound(['FFF0', 'FFF1', 'FFF2', 'FFF3', 'FFF4', 'FFF5'])
        wx.onBluetoothDeviceFound(function (res) {
          console.log("新设备 res -->",res);
          that.setData({
            list:res.devices
          })
        })
      },
      fail: function (res) {
        console.log("开始搜寻附近的蓝牙外围设备fail -->", res);
      },
    })
  },

  //停止搜寻附近的蓝牙外围设备 。若已经找到需要的蓝牙设备并不需要继续搜索时，建议调用该接口停止蓝牙搜索。
  stopBluetoothDevicesDiscovery:function(){
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log("停止搜寻附近的蓝牙外围设备 suc -->", res)
      },
      fail: function (res) {
        console.log("停止搜寻附近的蓝牙外围设备 fail -->", res);
      },
    })
  },

  // 监听寻找到新设备的事件
  onBluetoothDeviceFound: function (devices){
    wx.onBluetoothDeviceFound(function (devices) {
      console.log('new device list has founded')
      console.dir(devices)
      console.log(ab2hex(devices[0].advertisData))
    })
  },

  //获取本机已配对的蓝牙设备
  getConnectedBluetoothDevices:function(e){
    wx.getConnectedBluetoothDevices({
      success: function (res) {
        console.log("获取本机已配对的蓝牙设备",res)
      },
      fail: function (res) {
        console.log("获取本机已配对的蓝牙设备 fail -->", res);
      },
    })
  },

  // 获取在小程序蓝牙模块生效期间所有已发现的蓝牙设备，包括已经和本机处于连接状态的设备。
  getBluetoothDevices:function(e){
    wx.getBluetoothDevices({
      success: function (res) {
        console.log("获取在小程序蓝牙模块生效期间所有已发现的蓝牙设备，包括已经和本机处于连接状态的设备。 -->",res)
        if (res.devices[0]) {
          console.log(ab2hex(res.devices[0].advertisData))
        }
      }
    })
  },

  //连接蓝牙
  connect:function(e){
    let that = this;
    let deviceId = e.currentTarget.dataset.deviceId;
    wx.createBLEConnection({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接 
      deviceId: deviceId,
      success: function (res) {
        console.log(res)
      },
      fail:function(res){
        console.log("连接失败 -->", res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initBlue()
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

})