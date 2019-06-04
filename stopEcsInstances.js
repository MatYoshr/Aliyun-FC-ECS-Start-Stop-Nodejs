'use strict';

var Core = require('@alicloud/pop-core');
var ACCESS_KEY = process.env['ACCESS_KEY'];
var SECRET_KEY = process.env['SECRET_KEY'];
var REGION = process.env['REGION'];
var ENDPOINT = process.env['ENDPOINT'];
var TAG_KEY = process.env['TAG_KEY'];
var TAG_VALUE = process.env['TAG_VALUE'];

var client = new Core({
  accessKeyId: ACCESS_KEY,
  accessKeySecret: SECRET_KEY,
  endpoint: ENDPOINT,
  apiVersion: '2014-05-26',
});

function ecsStop(instanceID){
  var params = {
    "RegionId": REGION,
    "ForceStop": false,
    "InstanceId": instanceID
  };
  
  var requestOption = {
    method: 'POST'
  };
  
  client.request('StopInstance', params, requestOption).then((result) => {
    console.log(result);
    console.log(instanceID + "を停止しました。");
  }, (ex) => {
    console.log(ex);
  })
}

exports.handler = function(event, context, callback) {

  var tagParams = {
    "Tag.1.Key": TAG_KEY,
    "Tag.1.Value": TAG_VALUE,
    "RegionId": REGION,
    "ResourceType": "instance"
  }
    
  var requestOption = {
    method: 'POST'
  };
  
  console.log('対象インスタンスIDの取得');

  client.request('ListTagResources', tagParams, requestOption).then((result) => {
    console.log(JSON.stringify(result));
    console.log("対象件数" + Object.keys(result.TagResources.TagResource).length + "件");
    
    for (var i = 0; i < Object.keys(result.TagResources.TagResource).length; i += 1) {
      var id = result.TagResources.TagResource[i].ResourceId
      console.log(id);
      console.log("Instance停止処理");
      ecsStop(id);
    }
  }, (ex) => {
    console.log(ex);
    process.exit(0);
  })
};