angular.module('Account.controllers', [])

.controller('AppCtrl', function($state, $rootScope, $resource, baseURL, $scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $ionicPopup, $ionicPopover, $cordovaCamera, $cordovaImagePicker, $cordovaToast, localRecordFactory, cloudRecordFactory, userFactory, authFactory, localInfo, loginData, records, regToastType, loginToastType, settingToastType, uploadToastType, downloadToastType, lang) {

    $scope.loggedIn = false;
    $scope.registration = {};
    $scope.loginData = loginData;
    $scope.localInfo = localInfo;
    $scope.tmpInfo = { "lang": localInfo.lang };
    $scope.lang = lang;
    
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
        authFactory.login($scope.loginData);
        $scope.closeRegister();
    };
    $scope.closeRegister = function () {
        $scope.register_modal.hide();
    };

    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = authFactory.isAuthenticated();
        $ionicPlatform.ready(function () {
            $cordovaToast
                .showLongBottom(regToastType("success"))
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
        $scope.tmpInfo.username = authFactory.getUsername();
        $scope.localInfo.username = authFactory.getUsername();
        $ionicPlatform.ready(function () {
            $cordovaToast
                .showLongBottom(loginToastType("success"))
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
        
        $scope.localInfo.lang = $scope.tmpInfo.lang;
        $scope.localInfo.icon = $scope.tmpInfo.icon;
        $scope.localInfo.username = $scope.tmpInfo.username;
        $scope.localInfo.income = $scope.tmpInfo.income;
        $localStorage.storeObject('localInfo', $scope.localInfo);
        
        $rootScope.$broadcast("$ionicView.beforeEnter");
        
        $ionicPlatform.ready(function () {
            $cordovaToast
                .showLongBottom(settingToastType("success"))
                .then(
                    function (success) {}, 
                    function (error) {}
                );
            $scope.closeSetting();
        });
        
    };
    $scope.closeSetting = function() {
        $scope.setting_modal.hide();
    };
    
    $ionicPopover.fromTemplateUrl('templates/sync-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.sync = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    
    var upload_info = function() {
        cloudRecordFactory.upload_info($scope.localInfo);
    };
    var download_info = function() {
        $resource(baseURL + "users/info").get(function(res) {
            $scope.localInfo.income = res.income;
            $scope.localInfo.icon = res.icon;
            $localStorage.storeObject('localInfo', $scope.localInfo);
        });
    };
    
    var upload_records = function() {
        cloudRecordFactory.upload_allRec(records);
    };
    var download_records = function() {        
        $resource(baseURL + "records/").get(function(res) {
            
            records.mRecords.length = 0;
            records.tRecords.length = 0;
            records.tARecords.length = 0;
            records.mrRecords.length = 0;
            records.trRecords.length = 0;
            records.mtRecords.length = 0;
            
            for (var i = 0; i < res.mRecords.length; i++)
                records.mRecords.push(res.mRecords[i]);
            for (var i = 0; i < res.tRecords.length; i++)
                records.tRecords.push(res.tRecords[i]);
            for (var i = 0; i < res.tARecords.length; i++)
                records.tARecords.push(res.tARecords[i]);
            for (var i = 0; i < res.mrRecords.length; i++)
                records.mrRecords.push(res.mrRecords[i]);
            for (var i = 0; i < res.trRecords.length; i++)
                records.trRecords.push(res.trRecords[i]);
            for (var i = 0; i < res.mtRecords.length; i++)
                records.mtRecords.push(res.mtRecords[i]);
            records.tPoints = res.tPoints;
                
            $localStorage.storeObject('mRecords', records.mRecords);
            $localStorage.storeObject('tRecords', records.tRecords);
            $localStorage.storeObject('tARecords', records.tARecords);
            $localStorage.storeObject('mrRecords', records.mrRecords);
            $localStorage.storeObject('trRecords', records.trRecords);
            $localStorage.storeObject('mtRecords', records.mtRecords);
            $localStorage.storeObject('tPoints', records.tPoints);
            
        });
    };
    
    $scope.upload = function() {
        upload_info();
        upload_records();
        $ionicPlatform.ready(function () {
            $cordovaToast
                .showLongBottom(uploadToastType("success"))
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
        $rootScope.$broadcast("$ionicView.beforeEnter");
        
        $ionicPlatform.ready(function () {
            $cordovaToast
                .showLongBottom(downloadToastType("success"))
                .then(
                    function (success) {}, 
                    function (error) {}
                );
        });
        $scope.closePopover();
    };
    
    $ionicPlatform.ready(function () {
        /*var options = {
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };*/
        var gal_options = {
            maximumImagesCount: 1,
            width: 100,
            height: 100,
            quality: 80
        };
        /*$scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(
                function(imageData) {
                    $scope.tmpInfo.icon = "data:image/jpeg;base64," + imageData;
                }, 
                function(err) {
                    console.log(err);
                });
            $scope.registerform.show();
        };*/
        $scope.getPicture = function() {
            $cordovaImagePicker.getPictures(gal_options).then(
                function (results) {
                    $scope.tmpInfo.icon = results[0];
                }, 
                function (error) {
                    console.log(err);
                });
        };
    });
    
})

.controller('homeController', function($scope, records, localInfo, formatNumber, lang) {

    $scope.localInfo = localInfo;
    $scope.lang = lang;
    
    $scope.records = records;
    
    $scope.output = function() {
        var amount = 0;
        for (var i = 0; i < records.mRecords.length; i++) {
            var tmpRec = records.mRecords[i];
            if (tmpRec.type === "output")
                amount += tmpRec.sum;
        }
        return formatNumber(amount, 2);
    };
    $scope.income = function() {
        var amount = 0;
        for (var i = 0; i < records.mRecords.length; i++) {
            var tmpRec = records.mRecords[i];
            if (tmpRec.type === "income")
                amount += tmpRec.sum;
        }
        return formatNumber(amount, 2);
    };

    $scope.checkMemo = function() {
        var exist = false;
        for (var i = 0; i < records.tRecords.length; i++) {
            if (records.tRecords[i].type === "memo") {
                exist = true; break;
            }
                
        }
        return exist;
    };

})

.controller('recentController', function($filter, $scope, $ionicModal, localRecordFactory, localInfo, mrRecords, trRecords, moneyType, taskType, doneType, textType, time, formatNumber, lang) {
    
    localRecordFactory.refreshRRecords();
    
    $scope.typeText = "money";
    $scope.mrRecords = mrRecords;
    $scope.trRecords = trRecords;
    
    $scope.localInfo = localInfo;
    $scope.lang = lang;
    
    $scope.moneyType = moneyType;
    $scope.taskType = taskType;
    $scope.doneType = doneType;
    $scope.textType = textType;
    
    $scope.time = time;
    
    $scope.doneTimes = function(rec) {
        var rs = "";
        for (var i = 0; i < rec.done_times.length; i++) {
            var date = new Date();
            date.setTime(rec.done_times[i]);
            rs += $filter('date') (date, 'HH:mm') + " ";
        }
        return rs;
    };
    
    $scope.sumOutput = function(typeText) {
        if (typeText === "money") {
            var amount = 0;
            for (var i = 0; i < mrRecords.length; i++) {
                var rec = mrRecords[i];
                if (rec.type === "output")
                    amount += rec.sum;
            }
            return formatNumber(amount, 2);
        }
    };
    $scope.sumIncome = function(typeText) {
        if (typeText === "money") {
            var amount = 0;
            for (var i = 0; i < mrRecords.length; i++) {
                var rec = mrRecords[i];
                if (rec.type === "income")
                    amount += rec.sum;
            }
            return formatNumber(amount, 2);
        }
    };
    $scope.sumTask = function(typeText) {
        if (typeText === "task") {
            var points = 0;
            for (var i = 0; i < trRecords.length; i++) {
                var rec = trRecords[i];
                if (rec.type === "task")
                    points += rec.points * rec.amount;
            }
            return formatNumber(points, 2);
        }
    };
    $scope.sumDesire = function(typeText) {
        if (typeText === "task") {
            var points = 0;
            for (var i = 0; i < trRecords.length; i++) {
                var rec = trRecords[i];
                if (rec.type === "desire")
                    points += rec.points * rec.amount;
            }
            return formatNumber(points, 2);
        }
    };
    
})

.controller('maController', function($state, $scope, localRecordFactory, cloudRecordFactory, formFactory, localInfo, mRecords, mtRecords, doMoneyFormAdd, lang) {
    
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.forms = formFactory.getMForms(localInfo.lang);
    });
    
    $scope.tab = 1;
    $scope.filtText = "output";
    
    $scope.localInfo = localInfo;
    $scope.lang = lang;
    
    $scope.select = function(setTab) {
        
        $scope.tab = setTab;

        if (setTab === 1) {
            $scope.filtText = "output";
        } else if (setTab === 2) {
            $scope.filtText = "income";
        } else {
            console.log("Error: No implementation in maController of tab: ", setTab);
        }
        
    };
    $scope.isSelected = function(checkTab) {
        return ($scope.tab === checkTab);
    };
    
    $scope.doAdd = function(type) {
        doMoneyFormAdd(type, $scope.forms, mRecords, "记录", function(info) {
            info.sum = info.amount * info.unit_price;
            mRecords.push(info);
            localRecordFactory.updateRRecords(info, "money");
            localRecordFactory.updateMRecords(mRecords);
        });
    };
    $scope.saveTemplate = function(type) {
        doMoneyFormAdd(type, $scope.forms, mtRecords, "保存", function(info) {
            info.sum = info.amount * info.unit_price;
            mtRecords.push(info);
            localRecordFactory.updateMtRecords(mtRecords);
        });
    };
    
})

.controller('matController', function($state, $scope, $filter, $ionicPopup, $ionicListDelegate, localRecordFactory, cloudRecordFactory, localInfo, mtRecords, time, doDel, type, lang) {
    
    $scope.records = mtRecords;
    $scope.showAllDelete = false;
    
    $scope.localInfo = localInfo;
    $scope.lang = lang;
    
    var tmpOt = localRecordFactory.tmpOutputTemplate;
    var tmpIt = localRecordFactory.tmpIncomeTemplate;
    tmpOt.triggered = false; tmpIt.triggered = false;
    
    $scope.type = type;
    $scope.order = "date";
    $scope.orderText = "-date";
    
    $scope.time = time;
    
    $scope.toggleDel = function() {
        $scope.showAllDelete = !$scope.showAllDelete;
    };
    $scope.doDel = function(id, filtText) {
        doDel("templates", "", id, "删除", function() {});
        $scope.showAllDelete = false;
    };
    
    $scope.loadTemplate = function(id) {
        
        var tmp;
        var rec = mtRecords[id];
        
        if (rec.type === "output")
            tmp = tmpOt;
        else
            tmp = tmpIt;
        
        tmp.triggered = true;
        tmp.event = rec.event;
        tmp.amount = rec.amount;
        tmp.unit_price = rec.unit_price;
        
        $state.go('app.mata');
        
    };
    
})

.controller('mataController', function($state, $scope, $ionicHistory, localRecordFactory, cloudRecordFactory, localInfo, mRecords, mtRecords, doMoneyTemplateAdd, lang) {
    
    $scope.localInfo = localInfo;
    $scope.lang = lang;
    
    $scope.tmpOutput = localRecordFactory.tmpOutputTemplate;
    $scope.tmpIncome = localRecordFactory.tmpIncomeTemplate;
    
    $scope.doAdd = function(type) {
        doMoneyFormAdd(type, $scope.forms, mRecords, function(info) {
            info.sum = info.amount * info.unit_price;
            mRecords.push(info);
            localRecordFactory.updateRRecords(info, "money");
            localRecordFactory.updateMRecords(mRecords);
        });
    };
    
    $scope.finishLoadTemplate = function(type) {
        var tmp;
        if (type === "output")
            tmp = $scope.tmpOutput;
        else
            tmp = $scope.tmpIncome;
        doMoneyTemplateAdd(type, tmp, mRecords, function(info) {
            info.sum = info.amount * info.unit_price;
            mRecords.push(info);
            localRecordFactory.updateRRecords(info, "money");
            localRecordFactory.updateMRecords(mRecords);
            $ionicHistory.goBack();
        });
        
    };
    
})

.controller('mcController', function($scope, $filter, $ionicPopup, $ionicListDelegate, localRecordFactory, cloudRecordFactory, localInfo, mRecords, time, doDel, lang) {

    $scope.records = mRecords;
    $scope.showAllDelete = false;
    
    $scope.localInfo = localInfo;
    $scope.lang = lang;
    
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

.controller('mceController', function($scope, $ionicPlatform, $ionicHistory, $cordovaToast, localRecordFactory, localInfo, mRecords, textType, modifyToastType, meErrMsg, id, lang) {
    
    $scope.record = {};
    
    $scope.localInfo = localInfo;
    $scope.lang = lang;
    
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
        
        if (isNaN($scope.record.amount) || $scope.record.amount <= 0) {
            err_flag = true;
            err_msg += meErrMsg("amount");
        }
        if (isNaN($scope.record.unit_price)) {
            err_flag = true;
            err_msg += meErrMsg("unit_price") + $scope.textType($scope.record.type) + " !";
        }
        
        if (!err_flag) {
            $scope.record.milli = $scope.record.date.getTime();
            $scope.record.sum = $scope.record.amount * $scope.record.unit_price;
            localRecordFactory.editFromMRec(id, $scope.record);
        } 
        
        $ionicPlatform.ready(function () {
            if (!err_flag) {
                $cordovaToast
                    .showLongBottom(modifyToastType("success"))
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
                $ionicHistory.goBack();
            } else {
                $cordovaToast
                    .show(modifyToastType("failed") + err_msg, 'long', 'center')
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            }
        s});
        
    };
    
})

.controller('mtController', function($stateParams, $scope, $filter, $ionicPopup, $ionicListDelegate, localRecordFactory, cloudRecordFactory, localInfo, mtRecords, date, time, doDel, lang) {
    
    $scope.records = mtRecords;
    $scope.showAllDelete = false;
    
    $scope.localInfo = localInfo;
    $scope.lang = lang;
    
    $scope.filtText = "output";
    $scope.order = "date";
    $scope.orderText = "-date";
    
    $scope.date = date;
    $scope.time = time;
    
    $scope.toggleDel = function() {
        $scope.showAllDelete = !$scope.showAllDelete;
    };
    $scope.doDel = function(id, filtText) {
        doDel("templates", "", id, "删除", function() {});
        $scope.showAllDelete = false;
    };
    
})

.controller('mteController', function($state, $scope, $ionicPlatform, $ionicHistory, $cordovaToast, localRecordFactory, localInfo, mtRecords, textType, modifyToastType, meErrMsg, id, lang) {
    
    $scope.record = {};
    
    $scope.localInfo = localInfo;
    $scope.lang = lang;
    
    var tmpOt = localRecordFactory.tmpOutputTemplate;
    var tmpIt = localRecordFactory.tmpIncomeTemplate;
    tmpOt.triggered = false; tmpIt.triggered = false;
    
    var rec = mtRecords[id];
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
        
        if (isNaN($scope.record.amount) || $scope.record.amount < 0) {
            err_flag = true;
            err_msg += meErrMsg("amount");
        }
        if (isNaN($scope.record.unit_price)) {
            err_flag = true;
            err_msg += meErrMsg("unit_price") + $scope.textType($scope.record.type) + " !";
        }
        
        if (!err_flag) {
            $scope.record.milli = $scope.record.date.getTime();
            $scope.record.sum = $scope.record.amount * $scope.record.unit_price;
            localRecordFactory.editFromMtRec(id, $scope.record);
        } 
        
        $ionicPlatform.ready(function () {
            if (!err_flag) {
                $cordovaToast
                    .showLongBottom(modifyToastType("success"))
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            } else {
                $cordovaToast
                    .show(modifyToastType("failed") + err_msg, 'long', 'center')
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            }
        s});
        
    };
    $scope.loadTemplate = function() {
        
        var tmp;
        if (rec.type === "output")
            tmp = tmpOt;
        else
            tmp = tmpIt;
        
        tmp.triggered = true;
        tmp.event = $scope.record.event;
        tmp.amount = $scope.record.amount;
        tmp.unit_price = $scope.record.unit_price;
        
        $state.go('app.mata');
        
    };
    
})

.controller('mgController', function($scope, localInfo, mRecords, time, lang) {
    
    $scope.records = mRecords;
    $scope.time = time;
    
    $scope.localInfo = localInfo;
    $scope.lang = lang;
    
})

.controller('taController', function ($scope, $ionicPlatform, $cordovaToast, localRecordFactory, cloudRecordFactory, formFactory, localInfo, tRecords, addToastType, teErrMsg, lang) {
    
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.forms = formFactory.getTForms(localInfo.lang);
    });
    
    $scope.records = tRecords;
    $scope.tab = 1;
    $scope.filtText = "task";
    
    $scope.localInfo = localInfo;
    $scope.lang = lang;
    
    $scope.select = function(setTab) {
        
        $scope.tab = setTab;

        if (setTab === 1) {
            $scope.filtText = "task";
        } else if (setTab === 2) {
            $scope.filtText = "desire";
        } else if (setTab === 3) {
            $scope.filtText = "memo";
        } else {
            console.log("Error: No implementation in taController of tab: ", setTab);
        }
        
    };
    $scope.isSelected = function(checkTab) {
        return ($scope.tab === checkTab);
    };
    
    $scope.doAdd = function(type) {
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
        
        if (type != "memo") {
            
            if (type === "desire")
                form_idx = 1;
            
            info.event = $scope.forms[form_idx].contents[0].body;
            info.points = parseFloat($scope.forms[form_idx].contents[1].body);

            if (isNaN(info.points)) {
                err_flag = true;
                err_msg = teErrMsg("points");
            }
            
        } else {
            
            info.event = $scope.forms[2].contents[0].body;
            
        }

        if (!err_flag) {
            $scope.records.push(info);
            localRecordFactory.updateTRecords($scope.records);
        }

        $ionicPlatform.ready(function() {
            if (!err_flag) {
                $cordovaToast
                    .showLongBottom(addToastType("success"))
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            } else {
                $cordovaToast
                    .show(addToastType("failed") + err_msg, 'long', 'center')
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            }
        });
    };
    
})

.controller('tcController', function($scope, localInfo, tRecords, taskType, doneType, textType, date, time, doDel, lang) {
    
    $scope.showAllDelete = false;
    $scope.records = tRecords;
    
    $scope.localInfo = localInfo;
    $scope.lang = lang;
    
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

.controller('tceController', function($scope, $ionicPlatform, $ionicHistory, $cordovaToast, localRecordFactory, localInfo, tRecords, tARecords, tPoints, injectInfo, taskType, textType, doneType, doneText, archiveType, doDel, modifyToastType, tceErrMsg, tceDoneText, id, lang) {
    
    $scope.record = {};
    
    $scope.localInfo = localInfo;
    $scope.lang = lang;
    
    $scope.taskType = taskType;
    $scope.textType = textType;
    $scope.doneType = doneType;
    $scope.doneText = doneText;
    $scope.archiveType = archiveType;
    
    var rec = tRecords[id];
    var pt = 0;
    injectInfo(rec, $scope.record);
    
    if ($scope.record.type === "task") {
        pt = rec.points;
        $scope.btn_class = "button-balanced";
    } else {
        pt = rec.points * -1;
        $scope.btn_class = "button-assertive";
    }
    
    $scope.finishEdit = function() {
        
        var err_flag = false, err_msg = "";
        $scope.record.date = new Date();
        $scope.record.milli = $scope.record.date.getTime();
        $scope.record.points = parseFloat($scope.record.points);
        $scope.record.amount = parseInt($scope.record.amount);
        
        if (isNaN($scope.record.points)) {
            err_flag = true;
            err_msg += tceErrMsg("points");
        }
        if (isNaN($scope.record.amount) || $scope.record.amount < 0) {
            err_flag = true;
            err_msg += tceErrMsg("amount");
        }
        
        if (!err_flag) {
            tPoints += $scope.record.amount * $scope.record.points - rec.amount * rec.points;   
            localRecordFactory.updatePoints(tPoints);
            localRecordFactory.editFromTRec(id, $scope.record);
        } 
        
        $ionicPlatform.ready(function () {
            if (!err_flag) {
                $cordovaToast
                    .showLongBottom(modifyToastType("success"))
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
                $ionicHistory.goBack();
            } else {
                $cordovaToast
                    .show(modifyToastType("failed") + err_msg, 'long', 'center')
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            }
        });
        
    };
    $scope.finishDone = function() {
        
        rec.date = new Date();
        rec.milli = rec.date.getTime();
        localRecordFactory.updateRRecords(rec, "task");
        
        tPoints += pt;
        $scope.record.date = new Date();
        $scope.record.milli = $scope.record.date.getTime();
        $scope.record.amount += 1;
        $scope.record.done_times.push($scope.record.milli);
        localRecordFactory.updatePoints(tPoints);
        localRecordFactory.editFromTRec(id, $scope.record);
        
        $ionicPlatform.ready(function() {
            $cordovaToast
                .show(tceDoneText($scope.record.type) + $scope.record.points + " !", 'long', 'center')
                .then(
                    function (success) {}, 
                    function (error) {}
                );
            $ionicHistory.goBack();
        });
        
    };
    $scope.finishArchive = function() {
        $scope.record.date = new Date();
        $scope.record.milli = $scope.record.date.getTime();
        doDel("task", $scope.record.type, $scope.record.id, "归档", function() {
            $scope.record.id = tARecords.length;
            tARecords.push($scope.record);
            localRecordFactory.updateTARecords(tARecords);
            $ionicHistory.goBack();
        });
    };
    
})

.controller('tmController', function($scope, localInfo, tRecords, date, time, doDel, lang) {
    
    $scope.showAllDelete = false;
    $scope.records = tRecords;
    
    $scope.localInfo = localInfo;
    $scope.lang = lang;
    
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

.controller('tmeController', function($scope, $ionicPlatform, $ionicHistory, $cordovaToast, localRecordFactory, localInfo, tRecords, injectInfo, modifyToastType, id, lang) {
    
    $scope.record = {};
    
    $scope.localInfo = localInfo;
    $scope.lang = lang;
    
    var rec = tRecords[id];
    injectInfo(rec, $scope.record);
    
    $scope.finishEdit = function() {
        
        $scope.record.date = new Date();
        $scope.record.milli = $scope.record.date.getTime();
        
        localRecordFactory.editFromTRec(id, $scope.record);
        
        $ionicPlatform.ready(function () {
            $cordovaToast
                .showLongBottom(modifyToastType("success"))
                .then(
                    function (success) {}, 
                    function (error) {}
                );
            $ionicHistory.goBack();
        });
        
    };
    
})

.controller('tsController', function($scope, localRecordFactory, localInfo, tARecords, textType, date, time, doDel, lang) {
    
    $scope.records = tARecords;
    $scope.showAllDelete = false;
    
    $scope.localInfo = localInfo;
    $scope.lang = lang;
    
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

.controller('tsdController', function($scope, localInfo, tARecords, taskType, doneType, textType, date, time, showDateAndTime, id, lang) {
    
    $scope.record = tARecords[id];
    
    $scope.localInfo = localInfo;
    $scope.lang = lang;
    
    $scope.taskType = taskType($scope.record.type);
    $scope.doneType = doneType($scope.record.type);
    $scope.textType = textType($scope.record.type);
    
    $scope.date = date;
    $scope.time = time;
    $scope.showDateAndTime = showDateAndTime;
    
})

.filter('memoFilter', function () {
    return function(records) {
        var out = [];
        for (var i = 0; i < records.length; i++) {
            out.push(records[i]);
            if (i === 2)
                break;
        }
        return out;
}})

;