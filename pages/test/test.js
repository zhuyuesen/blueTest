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
    list:[
      // {
      //   deviceId:"85A46C4E-C682-4C45-A820-5419D7C59835",
      //   advertisServiceUUIDs: ["0000FFF0-0000-1000-8000-00805F9B34FB"],
      //   localName: "HC-08",
      //   name:"HC-08",
      //   advertisData: "",  //ArrayBuffer
      //   RSSI:-38,
      // }
    ],

    deviceId: "", //已连接设备的 deviceId
    services: [],  //已连接设备的 所有 service（服务）{isPrimary:true,uuid:"0000180A-0000-1000-8000-00805F9B34FB"}
    characteristics:[], //已连接设备某个服务中的所有 characteristic（特征值）properties:{notify: false, write: false, indicate: false, read: true},uuid:"00002A23-0000-1000-8000-00805F9B34FB"
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
      // services: ['FFE0'],
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

  //获取本机已配对的蓝牙设备  根据 uuid 获取处于已连接状态的设备
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
        console.log("连接蓝牙 suc -->",res)
        that.setData({
          deviceId:deviceId
        })
      },
      fail:function(res){
        console.log("连接失败 -->", res)
      }
    })
  },

  // 获取蓝牙设备某个服务中的所有 characteristic（特征值）
  getBLEDeviceCharacteristics:function(e){
    let that = this;
    let deviceId = that.data.deviceId;
    let serviceId = that.data.services[2].uuid;
    wx.getBLEDeviceCharacteristics({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId: deviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: serviceId,
      success: function (res) {
        console.log('获取蓝牙设备某个服务中的所有 characteristic（特征值）: res', res)
        console.log('获取蓝牙设备某个服务中的所有 characteristic（特征值）: res.characteristics', res.characteristics);
        that.setData({
          characteristics:res.characteristics
        })
      },
      fail:function(res){
        console.log('获取蓝牙设备某个服务中的所有 characteristic（特征值）: fail', res)
      }
    })
  },


  // 获取蓝牙设备所有 service（服务）
  getBLEDeviceServices:function(e){
    let that = this;
    let deviceId = e.currentTarget.dataset.deviceId;
    wx.getBLEDeviceServices({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接 
      deviceId: deviceId,
      success: function (res) {
        console.log('获取蓝牙设备所有 service（服务）:', res)
        console.log('device services:', res.services)
        that.setData({
          services:res.services
        })
      }
    })
  },


  //保存输入值
  saveInput:function(e){
    let value = e.detail.value;
    this.setData({
      sendValue:value
    })
  },

    //保存输入值
  saveInput:function(e){
    let value = e.detail.value;
    this.setData({
      sendValue2:value
    })
  },

    // 向低功耗蓝牙设备特征值中写入二进制数据。
    writeBLECharacteristicValue:function(e){
      let that = this;
      let value = that.data.sendValue;
      let deviceId = that.data.deviceId;
      let serviceId = that.data.services[2].uuid;
      let characteristicId =  that.data.characteristics[0].uuid;

      console.log("deviceId-->",deviceId)
      console.log("serviceId-->",serviceId)
      console.log("characteristicId-->",characteristicId)

      // 向蓝牙设备发送一个0x00的16进制数据
      // let buffer = new ArrayBuffer(1)
      let buffer = new ArrayBuffer(1)
      let dataView = new DataView(buffer)
      //写入内存
      //第一个参数是字节序号，表示从哪个字节开始写入，
      //第二个参数为写入的数据。对于那些写入两个或两个以上字节的方法，
      //需要指定第三个参数，false或者undefined表示使用大端字节序写入，true表示使用小端字节序写入。
      dataView.setUint8(0,value)

      wx.writeBLECharacteristicValue({
        // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
        deviceId: deviceId,
        // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
        serviceId: serviceId,
        // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
        characteristicId: characteristicId,
        // 这里的value是ArrayBuffer类型
        value: buffer,
        success: function (res) {
          console.log('向低功耗蓝牙设备特征值中写入二进制数据 suc-->', res)
        },
        fail:function(res){
          console.log("发送数据失败 -->",res);
        }
      })

    },


    //启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。
    //注意：必须设备的特征值支持notify或者indicate才可以成功调用，具体参照 characteristic 的 properties 属性
    //另外，必须先启用notify才能监听到设备 characteristicValueChange 事件
    notifyBLECharacteristicValueChange:function(e){
      let that = this;

      let deviceId = that.data.deviceId;
      let serviceId = that.data.services[2].uuid;
      let characteristicId =  that.data.characteristics[0].uuid;

      wx.notifyBLECharacteristicValueChange({
        state: true, // 启用 notify 功能
        // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接  
        deviceId: deviceId,
        // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
        serviceId: serviceId,
        // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
        characteristicId: characteristicId,
        success: function (res) {
          console.log('启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值 success', res.errMsg)
        },
        fail:function(res){
          console.log("启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值 fail",res);
        }
      })
    },


    //监听低功耗蓝牙设备的特征值变化。必须先启用notify接口才能接收到设备推送的notification。
    onBLECharacteristicValueChange:function(e){
      console.log("jieshouzhi")
      // ArrayBuffer转16进度字符串示例
      
      wx.onBLECharacteristicValueChange(function(res) {
        console.log("监听低功耗蓝牙设备的特征值变化 res -->",res)
        console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
        console.log(ab2hex(res.value))
      })
    },


    // 向低功耗蓝牙设备特征值中写入二进制数据。2
    writeBLECharacteristicValue2:function(e){
      let that = this;
      let value = that.data.sendValue;
      let deviceId = that.data.deviceId;
      let serviceId = that.data.services[2].uuid;
      let characteristicId =  that.data.characteristics[0].uuid;

      console.log("deviceId-->",deviceId)
      console.log("serviceId-->",serviceId)
      console.log("characteristicId-->",characteristicId)

     let time = new Date("2018-04-18 21:06:34")
     let src = time.getTime();
     src = parseInt(src/1000);

      let buffer = new ArrayBuffer(20)
      let dataView = new DataView(buffer)
      dataView.setUint8(0,0xa1);
      dataView.setUint8(1,0x8);
      let uuuid = '78564312'+src;
      for (var i = 0; i < uuuid.length; i++) {
        dataView.setUint8(i+2, uuuid.charAt(i).charCodeAt())
      }

      //写入内存
      //第一个参数是字节序号，表示从哪个字节开始写入，
      //第二个参数为写入的数据。对于那些写入两个或两个以上字节的方法，
      //需要指定第三个参数，false或者undefined表示使用大端字节序写入，true表示使用小端字节序写入。
      // dataView.setUint8(0,value)

      wx.writeBLECharacteristicValue({
        // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
        deviceId: deviceId,
        // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
        serviceId: serviceId,
        // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
        characteristicId: characteristicId,
        // 这里的value是ArrayBuffer类型
        value: buffer,
        success: function (res) {
          console.log('向低功耗蓝牙设备特征值中写入二进制数据 suc-->', res)
        },
        fail:function(res){
          console.log("发送数据失败 -->",res);
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