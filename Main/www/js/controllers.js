angular.module('Account.controllers', [])

.controller('AppCtrl', function($resource, baseURL, $rootScope, $scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $ionicPopup, $ionicPopover, $cordovaCamera, $cordovaImagePicker, $cordovaToast, localRecordFactory, userFactory, authFactory, localInfo, loginData, mRecords, tRecords, tARecords) {

    $scope.loggedIn = false;
    $scope.registration = {};
    $scope.loginData = loginData;
    $scope.localInfo = localInfo;
    
    if (authFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.localInfo.username = authFactory.getUsername();
    }
    
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.register_modal = modal;
    });
    $scope.register = function () {
        $scope.register_modal.show();
    };
    $scope.doRegister = function () {
        console.log('Doing registration', $scope.registration);
        $scope.loginData.username = $scope.registration.username;
        $scope.loginData.password = $scope.registration.password;
        authFactory.register($scope.registration);
        $scope.closeRegister();
    };
    $scope.closeRegister = function () {
        $scope.register_modal.hide();
    };

    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = authFactory.isAuthenticated();
        $scope.localInfo.username = authFactory.getUsername();
        $ionicPlatform.ready(function () {
            $cordovaToast
                .showLongBottom('注册成功 !')
                .then(
                    function (success) {}, 
                    function (error) {}
                );
        });
    });

    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.login_modal = modal;
    });
    $scope.login = function() {
        $scope.login_modal.show();
    };
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);
        authFactory.login($scope.loginData);
        $scope.closeLogin();
    };
    $scope.closeLogin = function() {
        $scope.login_modal.hide();
    };
    
    $scope.logOut = function() {
        authFactory.logout();
        $scope.loggedIn = false;
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = authFactory.isAuthenticated();
        $scope.localInfo.username = authFactory.getUsername();
        $ionicPlatform.ready(function () {
            $cordovaToast
                .showLongBottom('登录成功 !')
                .then(
                    function (success) {}, 
                    function (error) {}
                );
        });
    });
    
    $ionicModal.fromTemplateUrl('templates/setting.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.setting_modal = modal;
    });
    $scope.setting = function() {
        $scope.setting_modal.show();
    };
    $scope.doSetting = function() {
        $localStorage.storeObject('localInfo', $scope.localInfo);
        $ionicPlatform.ready(function () {
            $scope.closeSetting();
            $cordovaToast
                .showLongBottom('设置成功 !')
                .then(
                    function (success) {}, 
                    function (error) {}
                );
        });
    };
    $scope.closeSetting = function() {
        $scope.setting_modal.hide();
    };
    
    $ionicPopover.fromTemplateUrl('templates/sync-popover.html', {
        scope: $scope
    }).then(
        function(popover) {
            $scope.popover = popover;
        }
    );
    $scope.sync = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    
    var upload_info = function() {
        $resource(baseURL + "users/info", null, {
            'update': { method: 'PUT' }
        }).update($scope.localInfo);
    };
    var download_info = function() {
        $resource(baseURL + "users/info").get(function(res) {
            $scope.localInfo.income = res.income;
            $scope.localInfo.icon = res.icon;
            $localStorage.storeObject('localInfo', $scope.localInfo);
        });
    };
    
    var upload_records = function() {
        $resource(baseURL + "records/m", null, {
            'update': { method: 'PUT' }
        }).update(mRecords);
        $resource(baseURL + "records/t", null, {
            'update': { method: 'PUT' }
        }).update(tRecords);
        $resource(baseURL + "records/ta", null, {
            'update': { method: 'PUT' }
        }).update(tARecords);
        $resource(baseURL + "records/tp", null, {
            'update': { method: 'PUT' }
        }).update({ "points": localRecordFactory.getPoints() });
    };
    var download_records = function() {
        
        mRecords.length = 0;
        tRecords.length = 0;
        tARecords.length = 0;
        
        $resource(baseURL + "records/").get(function(res) {
            
            for (var i = 0; i < res.mRecords.length; i++)
                mRecords.push(res.mRecords[i])
            for (var i = 0; i < res.tRecords.length; i++)
                tRecords.push(res.tRecords[i])
            for (var i = 0; i < res.tARecords.length; i++)
                tARecords.push(res.tARecords[i])
                
            $localStorage.storeObject('mRecords', mRecords);
            $localStorage.storeObject('tRecords', tRecords);
            $localStorage.storeObject('tARecords', tARecords);
            $localStorage.storeObject('tPoints', res.tPoints);
            
        });
        
    }
    
    $scope.upload = function() {
        upload_info();
        upload_records();
        $ionicPlatform.ready(function () {
            $cordovaToast
                .showLongBottom('上传成功 !')
                .then(
                    function (success) {}, 
                    function (error) {}
                );
        });
        $scope.closePopover();
    };
    $scope.download = function() {
        download_info();
        download_records();
        $ionicPlatform.ready(function () {
            $cordovaToast
                .showLongBottom('下载成功 !')
                .then(
                    function (success) {}, 
                    function (error) {}
                );
        });
        $scope.closePopover();
    };    
    
    $ionicPlatform.ready(function () {
        var options = {
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
        var gal_options = {
            maximumImagesCount: 1,
            width: 100,
            height: 100,
            quality: 80
        };
        $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(
                function(imageData) {
                    $scope.settingData.icon = "data:image/jpeg;base64," + imageData;
                }, 
                function(err) {
                    console.log(err);
                });
            $scope.registerform.show();
        };
        $scope.getPicture = function() {
            $cordovaImagePicker.getPictures(gal_options).then(
                function (results) {
                    $scope.localInfo.icon = results[0];
                }, 
                function (error) {
                    console.log(err);
                });
        };
    });
    
})

.controller('IndexController', function($resource, $scope, baseURL, $ionicPlatform, $cordovaToast, localRecordFactory, mRecords, tRecords, tARecords, tPoints, localInfo) {

    $scope.baseURL = baseURL;
    $scope.localInfo = localInfo;

    $scope.mLength = function() {
        return mRecords.length;
    }
    $scope.ttLength = function() {
        var rs = 0;
        for (var i = 0; i < tRecords.length; i++) {
            if (tRecords[i].type === "task")
                rs += 1;
        }
        return rs;
    };
    $scope.tdLength = function() {
        var rs = 0;
        for (var i = 0; i < tRecords.length; i++) {
            if (tRecords[i].type === "desire")
                rs += 1;
        }
        return rs;
    };
    
    $scope.income = function() {
        var amount = 0;
        for (var i = 0; i < mRecords.length; i++) {
            var tmpRec = mRecords[i];
            if (tmpRec.type === "income")
                amount += tmpRec.sum;
        }
        return amount;
    };
    $scope.output = function() {
        var amount = 0;
        for (var i = 0; i < mRecords.length; i++) {
            var tmpRec = mRecords[i];
            if (tmpRec.type === "output")
                amount += tmpRec.sum;
        }
        return amount;
    };
    $scope.points = function() {
        return localRecordFactory.getPoints();
    }

})

.controller('maController', function($scope, baseURL, $ionicPlatform, $cordovaToast, localRecordFactory, cloudRecordFactory, forms, mRecords) {
    
    $scope.baseURL = baseURL;
    $scope.forms = forms;
    $scope.records = mRecords;
    
    $scope.doAdd = function(type) {
        var newMRec = {
            "id": 0,
            "type": "money records",
            "content": $scope.records
        };
        var date = new Date();
        var info = {
            "id": $scope.records.length,
            "type": type,
            "event": "",
            "amount": 0,
            "unit_price": 0,
            "sum": 0,
            "date": date,
            "milli": date.getTime()
        };
        var form_idx = 0, amount_idx = 0, per_idx = 0, event_idx = 0;
        var err_flag = false, err_msg = "";
        var err_type = "";

        if (type === "output") {
            form_idx = 0; event_idx = 2;
            amount_idx = 1; per_idx = 0;
            err_type = "单价";
        } else {
            form_idx = 1; event_idx = 1;
            amount_idx = -1; per_idx = 0;
            err_type = "数额";
        }

        info.event = $scope.forms[form_idx].contents[event_idx].body;
        if (amount_idx < 0)
            info.amount = 1;
        else
            info.amount = parseInt($scope.forms[form_idx].contents[amount_idx].body);
        info.unit_price = parseFloat($scope.forms[form_idx].contents[per_idx].body);

        if (isNaN(info.amount)) {
            err_flag = true;
            err_msg += "\n请输入正确的数量 !"
        }
        if (isNaN(info.unit_price)) {
            err_flag = true;
            err_msg += "\n请输入正确的" + err_type + " !"
        }

        if (!err_flag) {
            info.sum = info.amount * info.unit_price;
            $scope.records.push(info);
            localRecordFactory.updateMRecords($scope.records);
        }

        $ionicPlatform.ready(function() {
            if (!err_flag) {
                $cordovaToast
                    .showLongBottom('记录成功 !')
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            } else {
                $cordovaToast
                    .show('记录失败 !' + err_msg, 'long', 'center')
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            }
        });
    };
    
})

.controller('mcController', function($scope, baseURL, $filter, $ionicPlatform, $ionicPopup, $ionicListDelegate, $cordovaToast, localRecordFactory, cloudRecordFactory, mRecords, time, doDel) {
    
    $scope.baseURL = baseURL;
    $scope.records = mRecords;
    $scope.showAllDelete = false;
    
    $scope.filtText = "output";
    $scope.order = "date";
    $scope.orderText = "-date";
    
    $scope.time = time;
    
    $scope.toggleDel = function() {
        $scope.showAllDelete = !$scope.showAllDelete;
    };
    $scope.doDel = function(id) {
        doDel("money", "", id, "删除", function() {});
        $scope.showAllDelete = false;
    };
    
})

.controller('mceController', function($scope, baseURL, $ionicPlatform, $ionicHistory, $cordovaToast, localRecordFactory, mRecords, textType, id) {
    
    $scope.baseURL = baseURL;
    $scope.record = {};
    
    var rec = mRecords[id];
    $scope.record.id = rec.id;
    $scope.record.type = rec.type;
    $scope.record.event = rec.event;
    $scope.record.amount = rec.amount;
    $scope.record.unit_price = rec.unit_price;
    var date = new Date(), milli = rec.milli;
    date.setTime(milli);
    $scope.record.date = date;
    
    $scope.textType = textType;
    
    $scope.finishEdit = function() {
        
        var err_flag = false, err_msg = "";
        $scope.record.amount = parseInt($scope.record.amount);
        $scope.record.unit_price = parseFloat($scope.record.unit_price);
        
        if (isNaN($scope.record.amount)) {
            err_flag = true;
            err_msg += "\n请输入正确的数量 !";
        }
        if (isNaN($scope.record.unit_price)) {
            err_flag = true;
            err_msg += "\n请输入正确的" + $scope.textType() + " !";
        }
        
        if (!err_flag) {
            $scope.record.milli = $scope.record.date.getTime();
            $scope.record.sum = $scope.record.amount * $scope.record.unit_price;
            localRecordFactory.editFromMRec(id, $scope.record);
        } 
        
        $ionicPlatform.ready(function () {
            if (!err_flag) {
                $ionicHistory.goBack();
                $cordovaToast
                    .showLongBottom('修改成功 !')
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            } else {
                $cordovaToast
                    .show('修改失败 !' + err_msg, 'long', 'center')
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            }
        s});
        
    };
    
})

.controller('taController', function ($scope, baseURL, $ionicPlatform, $cordovaToast, localRecordFactory, cloudRecordFactory, forms, tRecords) {
    
    $scope.baseURL = baseURL;
    $scope.forms = forms;
    $scope.records = tRecords;
    
    $scope.doAdd = function(type) {
        var newTRec = {
            "id": 1,
            "type": "task records",
            "content": $scope.records
        };
        var date = new Date();
        var info = {
            "id": $scope.records.length,
            "type": type,
            "event": "",
            "points": 0,
            "amount": 0,
            "date": date,
            "milli": date.getTime(),
            "done_times": []
        };
        var form_idx = 0;
        var err_flag = false, err_msg = "";

        if (type === "desire")
            form_idx = 1

        info.event = $scope.forms[form_idx].contents[0].body;
        info.points = parseFloat($scope.forms[form_idx].contents[1].body);

        if (isNaN(info.points)) {
            err_flag = true;
            err_msg = "请输入正确的点数 !"
        }

        if (!err_flag) {
            $scope.records.push(info);
            localRecordFactory.updateTRecords($scope.records);
        }

        $ionicPlatform.ready(function() {
            if (!err_flag) {
                $cordovaToast
                    .showLongBottom('添加成功 !')
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            } else {
                $cordovaToast
                    .show('添加失败 !\n' + err_msg, 'long', 'center')
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            }
        });
    };
    
})

.controller('tcController', function($scope, baseURL, tRecords, taskType, doneType, textType, date, time, doDel) {
    
    $scope.baseURL = baseURL;
    $scope.showAllDelete = false;
    $scope.records = tRecords;
    
    $scope.filtText = "task";
    $scope.taskType = taskType;
    $scope.doneType = doneType;
    $scope.textType = textType;
    
    $scope.date = date;
    $scope.time = time;
    
    $scope.toggleDel = function() {
        $scope.showAllDelete = !$scope.showAllDelete;
    };
    $scope.doDel = function(type, id) {
        doDel("task", type, id, "删除", function() {});
        $scope.showAllDelete = false;
    };
    
})

.controller('tceController', function($scope, baseURL, $ionicPlatform, $ionicHistory, $cordovaToast, localRecordFactory, tRecords, tARecords, tPoints, doDel, id) {
    
    $scope.baseURL = baseURL;
    $scope.record = {};
    
    var rec = tRecords[id];
    var pt = 0, done_text = "";
    $scope.record.id = rec.id;
    $scope.record.type = rec.type;
    $scope.record.event = rec.event;
    $scope.record.points = rec.points;
    $scope.record.amount = rec.amount;
    
    if ($scope.record.type === "task") {
        pt = rec.points;
        $scope.taskType = "任务";
        $scope.textType = "得点";
        $scope.doneType = "完成次数";
        $scope.doneText = "完成任务";
        $scope.btn_class = "button-balanced";
        done_text = "记录成功 ! 点数 + " + $scope.record.points + " !";
    } else {
        pt = rec.points * -1;
        $scope.taskType = "欲望";
        $scope.textType = "失点";
        $scope.doneType = "实现次数";
        $scope.doneText = "实现欲望";
        $scope.btn_class = "button-assertive";
        done_text = "记录成功 ! 点数 - " + $scope.record.points + " !";
    }
    
    $scope.finishEdit = function() {
        
        var err_flag = false, err_msg = "";
        $scope.record.points = parseFloat($scope.record.points);
        $scope.record.amount = parseInt($scope.record.amount);
        
        if (isNaN($scope.record.points)) {
            err_flag = true;
            err_msg += "\n请输入正确的点数 !";
        }
        if ($scope.record.amount < 0) {
            err_flag = true;
            err_msg += "\n请输入正确的次数 !";
        }
        
        if (!err_flag) {
            tPoints += $scope.record.amount * $scope.record.points - rec.amount * rec.points;
            $scope.record.date = new Date();
            $scope.record.milli = $scope.record.date.getTime();
            localRecordFactory.updatePoints(tPoints);
            localRecordFactory.editFromTRec(id, $scope.record);
        } 
        
        $ionicPlatform.ready(function () {
            if (!err_flag) {
                $ionicHistory.goBack();
                $cordovaToast
                    .showLongBottom('修改成功 !')
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            } else {
                $cordovaToast
                    .show('修改失败 !\n' + err_msg, 'long', 'center')
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            }
        });
        
    };
    $scope.finishDone = function() {
        tPoints += pt;
        rec.amount += 1;
        var date = new Date();
        var milli = date.getTime();
        rec.done_times.push(milli);
        rec.date = date;
        rec.milli = milli;
        localRecordFactory.updatePoints(tPoints);
        localRecordFactory.editFromTRec(id, rec);
        $ionicPlatform.ready(function() {
            $cordovaToast
                .show(done_text, 'long', 'center')
                .then(
                    function (success) {}, 
                    function (error) {}
                );
            $ionicHistory.goBack();
        });
    };
    $scope.finishArchive = function() {
        doDel("task", $scope.record.type, $scope.record.id, "归档", function() {
            $scope.record.id = tARecords.length;
            $scope.record.date = new Date();
            $scope.record.milli = $scope.record.date.getTime();
            $scope.record.done_times = rec.done_times;
            tARecords.push($scope.record);
            localRecordFactory.updateTARecords(tARecords);
            $ionicHistory.goBack();
        });
    };
    
})

.controller('tsController', function($scope, baseURL, $ionicPlatform, $cordovaToast, localRecordFactory, tARecords, textType, date, time, doDel) {
    
    $scope.baseURL = baseURL;
    $scope.records = tARecords;
    $scope.showAllDelete = false;
    
    $scope.textType = textType;
    $scope.date = date;
    $scope.time = time;
    
    $scope.toggleDel = function() {
        $scope.showAllDelete = !$scope.showAllDelete;
    };
    $scope.doDel = function(id) {
        doDel("aTask", "", id, "删除", function() {});
        $scope.showAllDelete = false;
    }
    
})

.controller('tsdController', function($scope, baseURL, tARecords, taskType, doneType, textType, date, time, showDateAndTime, id) {
    
    $scope.baseURL = baseURL;
    $scope.record = tARecords[id];
    
    $scope.taskType = taskType($scope.record.type);
    $scope.doneType = doneType($scope.record.type);
    $scope.textType = textType($scope.record.type);
    
    $scope.date = date;
    $scope.time = time;
    $scope.showDateAndTime = showDateAndTime;
    
})

;