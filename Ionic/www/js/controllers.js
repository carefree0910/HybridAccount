angular.module('Account.controllers', [])

.controller('AppCtrl', function($state, $rootScope, $resource, baseURL, $scope, $location, $ionicModal, $timeout, $localStorage, $ionicPlatform, $ionicPopover, $cordovaCamera, $cordovaImagePicker, $cordovaToast, localRecordFactory, cloudRecordFactory, userFactory, authFactory, localInfo, loginData, records, regToastType, loginToastType, settingToastType, uploadToastType, downloadToastType, lang) {

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
        
        $rootScope.$broadcast("refresh:" + $location.path());
        
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
            if (res.lang)
                $scope.localInfo.lang = res.lang;
            $localStorage.storeObject('localInfo', $scope.localInfo);
            $rootScope.$broadcast("refresh:" + $location.path());
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
            records.trRecords.length = 0;
            records.mtRecords.length = 0;
            
            for (var i = res.mRecords.length - 1; i >= 0; i--)
                records.mRecords.push(res.mRecords[i]);
            for (var i = res.tRecords.length - 1; i >= 0; i--)
                records.tRecords.push(res.tRecords[i]);
            for (var i = res.tARecords.length - 1; i >= 0; i--)
                records.tARecords.push(res.tARecords[i]);
            for (var i = res.trRecords.length - 1; i >= 0; i--)
                records.trRecords.push(res.trRecords[i]);
            for (var i = res.mtRecords.length - 1; i >= 0; i--)
                records.mtRecords.push(res.mtRecords[i]);
            records.tPoints = res.tPoints;
                
            $localStorage.storeObject('mRecords', records.mRecords);
            $localStorage.storeObject('tRecords', records.tRecords);
            $localStorage.storeObject('tARecords', records.tARecords);
            $localStorage.storeObject('mrRecords', records.mrRecords);
            $localStorage.storeObject('trRecords', records.trRecords);
            $localStorage.storeObject('mtRecords', records.mtRecords);
            $localStorage.storeObject('tPoints', records.tPoints);
            
            $rootScope.$broadcast("refresh:" + $location.path());
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

.controller('homeController', function($scope, $timeout, formatNumber, localRecordFactory, userFactory, lang) {
    
    var refresh = function() {
        $scope.records = localRecordFactory.getAllRecords();
        $scope.localInfo = userFactory.getLocalInfo();
    };
    
    $scope.$on('$ionicView.beforeEnter', refresh);
    $scope.$on('refresh:/app/home', refresh);
    
    $scope.lang = lang;
    $scope.formatNumber = formatNumber;
    
    $scope.output = function() {
        var amount = 0;
        for (var i = $scope.records.mRecords.length - 1; i >= 0; i--) {
            var tmpRec = $scope.records.mRecords[i];
            if (tmpRec.type === "output")
                amount += tmpRec.sum;
        }
        return amount;
    };
    $scope.income = function() {
        var amount = 0;
        for (var i = $scope.records.mRecords.length - 1; i >= 0; i--) {
            var tmpRec = $scope.records.mRecords[i];
            if (tmpRec.type === "income")
                amount += tmpRec.sum;
        }
        return amount;
    };

})

.controller('recentController', function($filter, $rootScope, $scope, $timeout, localRecordFactory, userFactory, getTags, moneyType, taskType, doneType, textType, time, formatNumber, lang) {
    
    var refresh = function() {
        $rootScope.$broadcast("loading:show");
        $timeout(function() {
            $scope.localInfo = userFactory.getLocalInfo();
            $scope.getTags = getTags;
            
            var mrRecords = localRecordFactory.getMrRecords();
            $scope.mrdRecords = mrRecords.mrd.o.concat(mrRecords.mrd.i);
            $scope.trRecords = localRecordFactory.getTrRecords();
            
            $scope.sumOutput = function(typeText) {
                if (typeText === "money") {
                    var amount = 0;
                    for (var i = $scope.mrdRecords.length - 1; i >= 0; i--) {
                        var rec = $scope.mrdRecords[i];
                        if (rec.type === "output")
                            amount += rec.sum;
                    }
                    return amount;
                }
            };
            $scope.sumIncome = function(typeText) {
                if (typeText === "money") {
                    var amount = 0;
                    for (var i = $scope.mrdRecords.length - 1; i >= 0; i--) {
                        var rec = $scope.mrdRecords[i];
                        if (rec.type === "income")
                            amount += rec.sum;
                    }
                    return amount;
                }
            };
            $scope.sumTask = function(typeText) {
                if (typeText === "task") {
                    var points = 0;
                    for (var i = $scope.trRecords.length - 1; i >= 0; i--) {
                        var rec = $scope.trRecords[i];
                        if (rec.type === "task")
                            points += rec.points * rec.amount;
                    }
                    return formatNumber(points, 2);
                }
            };
            $scope.sumDesire = function(typeText) {
                if (typeText === "task") {
                    var points = 0;
                    for (var i = $scope.trRecords.length - 1; i >= 0; i--) {
                        var rec = $scope.trRecords[i];
                        if (rec.type === "desire")
                            points += rec.points * rec.amount;
                    }
                    return formatNumber(points, 2);
                }
            };
            
            $rootScope.$broadcast("loading:hide");
        }, 500);
    };
    
    $scope.$on('$ionicView.beforeEnter', refresh);
    $scope.$on('refresh:/app/recent', refresh);
    
    $scope.lang = lang;
    
    $scope.typeText = "money";
    
    $scope.moneyType = moneyType;
    $scope.taskType = taskType;
    $scope.doneType = doneType;
    $scope.textType = textType;
    
    $scope.time = time;
    
    $scope.doneTimes = function(rec) {
        var rs = "";
        for (var i = rec.done_times.length - 1; i >= 0; i--) {
            var date = new Date();
            date.setTime(rec.done_times[i]);
            rs += $filter('date') (date, 'HH:mm') + " ";
        }
        return rs;
    };
    
})

.controller('maController', function($state, $scope, localRecordFactory, cloudRecordFactory, userFactory, formFactory, genTagManager, doMoneyFormAdd, lang) {
    
    var refresh = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        $scope.tagManager = genTagManager([]);
        
        $scope.mRecords = localRecordFactory.getMRecords();
        $scope.mtRecords = localRecordFactory.getMtRecords();
        $scope.forms = formFactory.getMForms($scope.localInfo.lang);
    };
    
    $scope.$on('$ionicView.beforeEnter', refresh);
    $scope.$on('refresh:/app/ma', refresh);
    
    $scope.tab = 1;
    $scope.filtText = "output";
    
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
        return (checkTab === $scope.tab);
    };
    
    $scope.onClick = function(type) {
        if (type === "add")
            $scope.tagManager.addTagByBody();
        else if ($scope.tagManager.selectedTag)
            $scope.tagManager.delAllTagById($scope.tagManager.selectedTag.id);
    };
    
    $scope.doAdd = function(type) {
        doMoneyFormAdd(type, $scope.forms, $scope.mRecords, "记录", function(info) {
            info.sum = info.amount * info.unit_price;
            for (var i = $scope.tagManager.current_tags.length - 1; i >= 0; i--) {
                $scope.tagManager.current_tags[i].id = info.tags.length;
                info.tags.push($scope.tagManager.current_tags[i]);
            }
            $scope.mRecords.push(info);
            localRecordFactory.updateMRecords($scope.mRecords);
            for (var i = $scope.tagManager.current_tags.length - 1; i >= 0; i--) {
                var tmpTag = $scope.tagManager.current_tags[i];
                var involve = false;
                for (var j = $scope.tagManager.tags.length - 1; j >= 0; j--) {
                    if ($scope.tagManager.tags[j].body === tmpTag.body) {
                        involve = true; break;
                    }
                }
                if (!involve) {
                    tmpTag.id = $scope.tagManager.tags.length;
                    $scope.tagManager.tags.push(tmpTag);
                }
            }
            $scope.tagManager.current_tag = {};
            $scope.tagManager.current_tags = [];
            localRecordFactory.updateTags($scope.tagManager.tags);
        });
    };
    $scope.saveTemplate = function(type) {
        doMoneyFormAdd(type, $scope.forms, $scope.mtRecords, "保存", function(info) {
            info.sum = info.amount * info.unit_price;
            for (var i = $scope.tagManager.current_tags.length - 1; i >= 0; i--) {
                $scope.tagManager.current_tags[i].id = info.tags.length;
                info.tags.push($scope.tagManager.current_tags[i]);
            }
            $scope.mtRecords.push(info);
            localRecordFactory.updateMtRecords($scope.mtRecords);
        });
    };
    
})

.controller('mcController', function($rootScope, $scope, $timeout, $filter, localRecordFactory, cloudRecordFactory, userFactory, checkTagInvolve, getTags, time, doDel, lang) {
    
    $scope.dt = {};
    $scope.dt.rs = [];
    $scope.dt.date = new Date();
    $scope.dt.tag = {};
    $scope.dt.getTags = getTags;
    $scope.dt.type = "all";
    $scope.dt.description = "";
    
    $scope.dt.tab = 1;
    $scope.dt.filtText = "focus";
    
    $scope.dt.select = function(setTab) {
        $scope.dt.tab = setTab;
        if (setTab === 1) {
            $scope.dt.filtText = "focus";
            $scope.dt.doFocusFilter();
        } else if (setTab === 2) {
            $scope.dt.filtText = "all";
            $scope.dt.doAllFilter();
        } else {
            console.log("Error: No implementation in mcController of tab: ", setTab);
        }
    };
    $scope.dt.isSelected = function(checkTab) {
        return (checkTab === $scope.dt.tab);
    };
    
    $scope.dt.doFocusFilter = function() {
        $rootScope.$broadcast("loading:show");
        $timeout(function() {
            $scope.localInfo = userFactory.getLocalInfo();
            var mrd = localRecordFactory.getDateRecords($scope.dt.date);

            $scope.dt.rs.length = 0;
            for (var i = mrd.length - 1; i >= 0; i--) {
                if (mrd[i].event.indexOf($scope.dt.description) >= 0 && (!$scope.dt.tag.body || checkTagInvolve($scope.dt.tag, mrd[i].tags)))
                    $scope.dt.rs.push(mrd[i]);
            }
            
            $rootScope.$broadcast("loading:hide");
        }, 300);
    };
    $scope.dt.doAllFilter = function() {
        $rootScope.$broadcast("loading:show");
        $timeout(function() {
            $scope.localInfo = userFactory.getLocalInfo();
            var mr = localRecordFactory.getMRecords();

            $scope.dt.rs.length = 0;
            for (var i = mr.length - 1; i >= 0; i--) {
                if (mr[i].event.indexOf($scope.dt.description) >= 0 && (!$scope.dt.tag.body || checkTagInvolve($scope.dt.tag, mr[i].tags)))
                    $scope.dt.rs.push(mr[i]);
            }
            
            $rootScope.$broadcast("loading:hide");
        }, 300);
    };
    $scope.dt.doFilter = function() {
        if ($scope.dt.filtText === "focus")
            $scope.dt.doFocusFilter();
        else
            $scope.dt.doAllFilter();
    }
    $scope.dt.refresh = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        $scope.dt.doFilter();
    };
    
    $scope.$on('$ionicView.beforeEnter', $scope.dt.refresh);
    $scope.$on('refresh:/app/mc', $scope.dt.refresh);
    
    $scope.lang = lang;
    $scope.time = time;
    
    $scope.doDel = function(id) {
        doDel("money", "", id, "删除", function() {
            $scope.showAllDelete = false;
            $scope.dt.refresh();
        });
    };
    
})

.controller('mceController', function($scope, $ionicPlatform, $ionicHistory, $cordovaToast, localRecordFactory, localInfo, genTagManager, mRecords, textType, modifyToastType, meErrMsg, id, lang) {
    
    $scope.lang = lang;
    $scope.localInfo = localInfo;

    $scope.record = {};
    
    var rec = mRecords[id];
    $scope.record.id = rec.id;
    $scope.record.type = rec.type;
    $scope.record.tags = rec.tags.concat([]);
    $scope.record.event = rec.event;
    $scope.record.amount = rec.amount;
    $scope.record.unit_price = rec.unit_price;
    var date = new Date(), milli = rec.milli;
    date.setTime(milli);
    $scope.record.date = date;
    
    $scope.tagManager = genTagManager($scope.record.tags);
    
    $scope.textType = textType;
    
    $scope.onClick = function(type) {
        if (type === "add")
            $scope.tagManager.addTagByBody();
        else if ($scope.tagManager.selectedTag)
            $scope.tagManager.delAllTagById($scope.tagManager.selectedTag.id);
    };
    
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
            for (var i = $scope.record.tags.length - 1; i >= 0; i--) {
                var tmpTag = $scope.record.tags[i];
                var involve = false;
                for (var j = $scope.tagManager.tags.length - 1; j >= 0; j--) {
                    if ($scope.tagManager.tags[j].body === tmpTag.body) {
                        involve = true; break;
                    }
                }
                if (!involve) {
                    tmpTag.id = $scope.tagManager.tags.length;
                    $scope.tagManager.tags.push(tmpTag);
                }
            }
            
            localRecordFactory.updateTags($scope.tagManager.tags);
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
        });
    };
    
})

.controller('mtController', function($rootScope, $scope, $timeout, $filter, localRecordFactory, cloudRecordFactory, userFactory, checkTagInvolve, getTags, full_date, time, doDel, lang, type) {
    
    $scope.dt = {};
    $scope.dt.rs = [];
    $scope.dt.tag = {};
    $scope.dt.getTags = getTags;
    $scope.dt.type = "all";
    $scope.dt.description = "";
    $scope.dt.doFilter = function() {
        $rootScope.$broadcast("loading:show");
        
        $timeout(function() {
            $scope.localInfo = userFactory.getLocalInfo();
            var mt = localRecordFactory.getMtRecords();

            $scope.dt.rs.length = 0;
            for (var i = mt.length - 1; i >= 0; i--) {
                if (mt[i].event.indexOf($scope.dt.description) >= 0 && (!$scope.dt.tag.body || checkTagInvolve($scope.dt.tag, mt[i].tags)))
                    $scope.dt.rs.push(mt[i]);
            }
            
            $rootScope.$broadcast("loading:hide");
        }, 300);
    };
    $scope.dt.refresh = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        $scope.dt.doFilter();
    };
    
    $scope.$on('$ionicView.beforeEnter', $scope.dt.refresh);
    $scope.$on('refresh:/app/mt', $scope.dt.refresh);
    
    $scope.showAllDelete = false;
    
    $scope.lang = lang;
    
    $scope.full_date = full_date;
    $scope.time = time;
    
    $scope.toggleDel = function() {
        $scope.showAllDelete = !$scope.showAllDelete;
    };
    $scope.doDel = function(id, filtText) {
        doDel("templates", "", id, "删除", function() {});
        $scope.showAllDelete = false;
    };
    
})

.controller('mteController', function($state, $scope, $ionicPlatform, $cordovaToast, localRecordFactory, localInfo, genTagManager, mtRecords, textType, modifyToastType, meErrMsg, id, lang) {
    
    $scope.lang = lang;
    $scope.localInfo = localInfo;

    var tmpOt = localRecordFactory.tmpOutputTemplate;
    var tmpIt = localRecordFactory.tmpIncomeTemplate;
    tmpOt.triggered = false; tmpIt.triggered = false;

    $scope.record = {};
    
    var rec = mtRecords[id];
    $scope.record.id = rec.id;
    $scope.record.type = rec.type;
    $scope.record.tags = rec.tags.concat([]);
    $scope.record.event = rec.event;
    $scope.record.amount = rec.amount;
    $scope.record.unit_price = rec.unit_price;
    
    $scope.tagManager = genTagManager($scope.record.tags);
    
    $scope.textType = textType;
    
    $scope.onClick = function(type) {
        if (type === "add")
            $scope.tagManager.addTagByBody();
        else if ($scope.tagManager.selectedTag)
            $scope.tagManager.delAllTagById($scope.tagManager.selectedTag.id);
    };
    
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
            $scope.record.date = new Date();
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
        });
    };
    $scope.loadTemplate = function() {
        var tmp;
        if (rec.type === "output")
            tmp = tmpOt;
        else
            tmp = tmpIt;
        
        tmp.triggered = true;
        tmp.tags = $scope.record.tags.concat([]);
        tmp.event = $scope.record.event;
        tmp.amount = $scope.record.amount;
        tmp.unit_price = $scope.record.unit_price;
        
        $state.go('app.mtd');
    };
    
})

.controller('mtdController', function($state, $scope, $ionicHistory, localRecordFactory, cloudRecordFactory, userFactory, genTagManager, doMoneyTemplateAdd, lang) {
    
    var refresh = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        $scope.mRecords = localRecordFactory.getMRecords();
        
        $scope.tmpOutput = localRecordFactory.tmpOutputTemplate;
        $scope.tmpIncome = localRecordFactory.tmpIncomeTemplate;
        
        if ($scope.tmpOutput.triggered)
            $scope.tagManager = genTagManager($scope.tmpOutput.tags);
        else
            $scope.tagManager = genTagManager($scope.tmpIncome.tags);
    };
    
    $scope.$on('$ionicView.beforeEnter', refresh);
    $scope.$on('refresh:/app/mata', refresh);
    
    $scope.lang = lang;
    
    $scope.onClick = function(type) {
        if (type === "add")
            $scope.tagManager.addTagByBody();
        else if ($scope.tagManager.selectedTag)
            $scope.tagManager.delAllTagById($scope.tagManager.selectedTag.id);
    };
    
    $scope.finishLoadTemplate = function() {
        var tmp, type;
        if ($scope.tmpOutput.triggered) {
            tmp = $scope.tmpOutput;
            type = "output";
        } else {
            tmp = $scope.tmpIncome;
            type = "income";
        }
        
        doMoneyTemplateAdd(type, tmp, $scope.mRecords, function(info) {
            info.sum = info.amount * info.unit_price;
            for (var i = $scope.tagManager.current_tags.length - 1; i >= 0; i--) {
                $scope.tagManager.current_tags[i].id = info.tags.length;
                info.tags.push($scope.tagManager.current_tags[i]);
            }
            $scope.mRecords.push(info);
            for (var i = $scope.tagManager.current_tags.length - 1; i >= 0; i--) {
                var tmpTag = $scope.tagManager.current_tags[i];
                var involve = false;
                for (var j = $scope.tagManager.tags.length - 1; j >= 0; j--) {
                    if ($scope.tagManager.tags[j].body === tmpTag.body) {
                        involve = true; break;
                    }
                }
                if (!involve) {
                    tmpTag.id = $scope.tagManager.tags.length;
                    $scope.tagManager.tags.push(tmpTag);
                }
            }
            
            localRecordFactory.updateTags($scope.tagManager.tags);
            localRecordFactory.updateMRecords($scope.mRecords);
            $ionicHistory.goBack();
        });
    };
    
})

.controller('mgController', function($rootScope, $scope, $ionicLoading, $timeout, localRecordFactory, userFactory, genTagManager, filtOiRecordsWithTags, init_data, lang) {
    
    $scope.options = {
        legend: {
            display: true
        }
    };
    
    $scope.dt = {};
    $scope.dt.tagManager = genTagManager([]);
    $scope.dt.onClick = function(type) {
        if (type === "add")
            $scope.dt.tagManager.addTagByBody();
        else if ($scope.dt.tagManager.selectedTag)
            $scope.dt.tagManager.delAllTagById($scope.dt.tagManager.selectedTag.id);
    };
    
    $scope.dt.refresh_sep = function() {
        $rootScope.$broadcast("loading:show");
        
        $timeout(function() {
            $scope.dt.date = new Date();
            $scope.localInfo = userFactory.getLocalInfo();
            var mr = localRecordFactory.getMrRecords($scope.dt.date);
            
            filtOiRecordsWithTags(mr.mrd, $scope.dt.tagManager.current_tags);
            filtOiRecordsWithTags(mr.mrw, $scope.dt.tagManager.current_tags);
            filtOiRecordsWithTags(mr.mrm, $scope.dt.tagManager.current_tags);
            filtOiRecordsWithTags(mr.mry, $scope.dt.tagManager.current_tags);

            $scope.tab = 1;
            $scope.filtText = "sep";
            
            var dData = init_data(mr.mrd.o, mr.mrd.i, "day");
            var wData = init_data(mr.mrw.o, mr.mrw.i, "week");
            var mData = init_data(mr.mrm.o, mr.mrm.i, "month");
            var yData = init_data(mr.mry.o, mr.mry.i, "year");

            var dctx = document.getElementById("day");
            var wctx = document.getElementById("week");
            var mctx = document.getElementById("month");
            var yctx = document.getElementById("year");

            var dp = dctx.parentNode, new_dctx = dctx.cloneNode();
            dp.replaceChild(new_dctx, dctx);
            var wp = wctx.parentNode, new_wctx = wctx.cloneNode();
            wp.replaceChild(new_wctx, wctx);
            var mp = mctx.parentNode, new_mctx = mctx.cloneNode();
            mp.replaceChild(new_mctx, mctx);
            var yp = yctx.parentNode, new_yctx = yctx.cloneNode();
            yp.replaceChild(new_yctx, yctx);

            var day = new Chart(new_dctx, {
                type: 'line',
                data: dData,
                options: $scope.options
            });
            var week = new Chart(new_wctx, {
                type: 'line',
                data: wData,
                options: $scope.options
            });
            var month = new Chart(new_mctx, {
                type: 'line',
                data: mData,
                options: $scope.options
            });
            var year = new Chart(new_yctx, {
                type: 'line',
                data: yData,
                options: $scope.options
            });
            
            $rootScope.$broadcast("loading:hide");
        }, 500);
    };
    $scope.dt.refresh_sum = function() {
        $rootScope.$broadcast("loading:show");
        
        $timeout(function() {
            $scope.localInfo = userFactory.getLocalInfo();
            var moi = localRecordFactory.getMoiRecords();
            
            filtOiRecordsWithTags(moi, $scope.dt.tagManager.current_tags);

            $scope.tab = 2;
            $scope.filtText = "sum";
            
            var dData = init_data(moi.o, moi.i, "day");
            var wData = init_data(moi.o, moi.i, "week");
            var mData = init_data(moi.o, moi.i, "month");
            var yData = init_data(moi.o, moi.i, "year");

            var dctx = document.getElementById("day");
            var wctx = document.getElementById("week");
            var mctx = document.getElementById("month");
            var yctx = document.getElementById("year");

            var dp = dctx.parentNode, new_dctx = dctx.cloneNode();
            dp.replaceChild(new_dctx, dctx);
            var wp = wctx.parentNode, new_wctx = wctx.cloneNode();
            wp.replaceChild(new_wctx, wctx);
            var mp = mctx.parentNode, new_mctx = mctx.cloneNode();
            mp.replaceChild(new_mctx, mctx);
            var yp = yctx.parentNode, new_yctx = yctx.cloneNode();
            yp.replaceChild(new_yctx, yctx);

            var day = new Chart(new_dctx, {
                type: 'line',
                data: dData,
                options: $scope.options
            });
            var week = new Chart(new_wctx, {
                type: 'line',
                data: wData,
                options: $scope.options
            });
            var month = new Chart(new_mctx, {
                type: 'line',
                data: mData,
                options: $scope.options
            });
            var year = new Chart(new_yctx, {
                type: 'line',
                data: yData,
                options: $scope.options
            });
            
            $rootScope.$broadcast("loading:hide");
        }, 500);
    };
    
    $scope.$on('$ionicView.beforeEnter', $scope.dt.refresh_sep);
    $scope.$on('refresh:/app/mg', function() {
        $scope.dt.refresh_sep();
        $scope.dt.tagManager = genTagManager([]);
    });
    
    $scope.select = function(setTab) {
        $scope.tab = setTab;
        if (setTab === 1) {
            $scope.dt.refresh_sep();
        } else if (setTab === 2) {
            $scope.dt.refresh_sum();
        } else {
            console.log("Error: No implementation in mgController of tab: ", setTab);
        }
    };
    $scope.isSelected = function(checkTab) {
        return (checkTab === $scope.tab);
    };
    
    $scope.lang = lang;
    
})

.controller('taController', function ($scope, $ionicPlatform, $cordovaToast, localRecordFactory, cloudRecordFactory, formFactory, userFactory, addToastType, teErrMsg, lang) {
    
    var refresh = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        $scope.tRecords = localRecordFactory.getTRecords();
        $scope.forms = formFactory.getTForms($scope.localInfo.lang);
    };
    
    $scope.$on('$ionicView.beforeEnter', refresh);
    $scope.$on('refresh:/app/ta', refresh);
    
    $scope.tab = 1;
    $scope.filtText = "task";
    
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
        return (checkTab === $scope.tab);
    };
    
    $scope.doAdd = function(type) {
        var date = new Date();
        var info = {
            "id": $scope.tRecords.length,
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
            $scope.tRecords.push(info);
            localRecordFactory.updateTRecords($scope.tRecords);
            if (type === "memo")
                $scope.forms[2].contents[0].body = "";
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

.controller('tcController', function($scope, localRecordFactory, userFactory, doneType, textType, full_date, time, doDel, lang) {
    
    var refresh = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        $scope.tRecords = localRecordFactory.getTRecords();
    };
    
    $scope.$on('$ionicView.beforeEnter', refresh);
    $scope.$on('refresh:/app/tc', refresh);
    
    $scope.showAllDelete = false;
    
    $scope.lang = lang;
    
    $scope.tab = 1;
    $scope.filtText = "task";
    
    $scope.doneType = doneType;
    $scope.textType = textType;
    
    $scope.full_date = full_date;
    $scope.time = time;
    
    $scope.select = function(setTab) {
        $scope.tab = setTab;
        if (setTab === 1) {
            $scope.filtText = "task";
        } else if (setTab === 2) {
            $scope.filtText = "desire";
        } else {
            console.log("Error: No implementation in tcController of tab: ", setTab);
        }
    };
    $scope.isSelected = function(checkTab) {
        return (checkTab === $scope.tab);
    };
    
    $scope.toggleDel = function() {
        $scope.showAllDelete = !$scope.showAllDelete;
    };
    $scope.doDel = function(type, id) {
        doDel("task", type, id, "删除", function() {});
        $scope.showAllDelete = false;
    };
    
})

.controller('tceController', function($scope, $ionicPlatform, $ionicHistory, $cordovaToast, localRecordFactory, localInfo, tRecords, tARecords, tPoints, injectInfo, taskType, textType, doneType, doneText, archiveType, doDel, modifyToastType, tceErrMsg, tceDoneText, id, lang) {
        
    $scope.lang = lang;
    $scope.localInfo = localInfo;

    $scope.record = {};
    var rec = tRecords[id];
    injectInfo(rec, $scope.record);
    
    var one;
    if ($scope.record.type === "task") {
        one = 1;
        $scope.btn_class = "button-balanced";
    } else {
        one = -1
        $scope.btn_class = "button-assertive";
    }
    
    $scope.taskType = taskType;
    $scope.textType = textType;
    $scope.doneType = doneType;
    $scope.doneText = doneText;
    $scope.archiveType = archiveType;
    
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
            tPoints += $scope.record.amount * $scope.record.points - rec.amount * rec.points * one;
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
        tPoints += rec.points * one;
        rec.date = new Date();
        rec.milli = rec.date.getTime();
        rec.amount += 1;
        rec.done_times.push(rec.milli);
        var tmpRec = {};
        injectInfo(rec, tmpRec);
        tmpRec.date = new Date();
        tmpRec.milli = tmpRec.date.getTime();
        
        localRecordFactory.updatePoints(tPoints);
        localRecordFactory.editFromTRec(id, rec);
        localRecordFactory.updateTrRecords(tmpRec);
        
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
        rec.date = new Date();
        rec.milli = rec.date.getTime();
        doDel("task", rec.type, rec.id, "归档", function() {
            rec.id = tARecords.length;
            tARecords.push(rec);
            localRecordFactory.updateTARecords(tARecords);
            $ionicHistory.goBack();
        });
    };
    
})

.controller('tmController', function($scope, localRecordFactory, userFactory, full_date, time, doDel, lang) {
    
    var refresh = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        $scope.tRecords = localRecordFactory.getTRecords();
    };
    
    $scope.$on('$ionicView.beforeEnter', refresh);
    $scope.$on('refresh:/app/tm', refresh);
    
    $scope.showAllDelete = false;
    
    $scope.lang = lang;
    
    $scope.full_date = full_date;
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
    
    $scope.lang = lang;
    $scope.localInfo = localInfo;
    
    $scope.record = {};
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

.controller('tsController', function($scope, localRecordFactory, userFactory, doneType, textType, full_date, time, doDel, lang) {
    
    var refresh = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        $scope.tARecords = localRecordFactory.getTARecords();
    };
    
    $scope.$on('$ionicView.beforeEnter', refresh);
    $scope.$on('refresh:/app/ts', refresh);
    
    $scope.showAllDelete = false;
    
    $scope.lang = lang;
    
    $scope.tab = 1;
    $scope.filtText = "task";
    
    $scope.doneType = doneType;
    $scope.textType = textType;
    $scope.full_date = full_date;
    $scope.time = time;
    
    $scope.select = function(setTab) {
        $scope.tab = setTab;
        if (setTab === 1) {
            $scope.filtText = "task";
        } else if (setTab === 2) {
            $scope.filtText = "desire";
        } else {
            console.log("Error: No implementation in tcController of tab: ", setTab);
        }
    };
    $scope.isSelected = function(checkTab) {
        return (checkTab === $scope.tab);
    };
    
    $scope.toggleDel = function() {
        $scope.showAllDelete = !$scope.showAllDelete;
    };
    $scope.doDel = function(id) {
        doDel("aTask", "", id, "删除", function() {});
        $scope.showAllDelete = false;
    }
    
})

.controller('tsdController', function($scope, localRecordFactory, localInfo, tARecords, taskType, doneType, textType, showDateAndTime, id, lang) {
    
    $scope.lang = lang;
    $scope.localInfo = localInfo;
    
    $scope.record = tARecords[id];
    
    $scope.taskType = taskType($scope.record.type);
    $scope.doneType = doneType($scope.record.type);
    $scope.textType = textType($scope.record.type);
    
    $scope.showDateAndTime = showDateAndTime;
    
})

;