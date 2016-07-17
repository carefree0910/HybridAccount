'use strict';

angular.module('Account.services', ['ngResource'])

.constant("baseURL", "https://10.2.75.150:3443/")
// .constant("baseURL", "https://localhost:3443/")

.factory('$localStorage', function($window) {
    return {
        store: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
})

.factory('cloudRecordFactory', function($resource, baseURL, $ionicListDelegate) {
    var recFac = {};
    
    recFac.upload_info = function(info) {
        $resource(baseURL + "users/info", null, { 'update': { method: 'PUT'} }).update(info, function(res) {
            console.log(res.body);
        }, function(res){
            console.log(res.data.err)
        });
    };
    
    recFac.upload_mRec = function(rec) {
        $resource(baseURL + "records/m", null, { 'update': { method: 'PUT'} }).update(rec, function(res) {
            console.log(res.body);
        }, function(res){
            console.log(res.data.err)
        });
    };
    recFac.upload_tRec = function(rec) {
        $resource(baseURL + "records/t", null, { 'update': { method: 'PUT'} }).update(rec, function(res) {
            console.log(res.body);
        }, function(res){
            console.log(res.data.err)
        });
    };
    recFac.upload_taRec = function(rec) {
        $resource(baseURL + "records/ta", null, { 'update': { method: 'PUT'} }).update(rec, function(res) {
            console.log(res.body);
        }, function(res){
            console.log(res.data.err)
        });
    };
    recFac.upload_tpRec = function(rec) {
        $resource(baseURL + "records/tp", null, { 'update': { method: 'PUT'} }).update(rec, function(res) {
            console.log(res.body);
        }, function(res){
            console.log(res.data.err)
        });
    };
    recFac.upload_mrRec = function(rec) {
        $resource(baseURL + "records/mr", null, { 'update': { method: 'PUT'} }).update(rec, function(res) {
            console.log(res.body);
        }, function(res){
            console.log(res.data.err)
        });
    };
    recFac.upload_trRec = function(rec) {
        $resource(baseURL + "records/tr", null, { 'update': { method: 'PUT'} }).update(rec, function(res) {
            console.log(res.body);
        }, function(res){
            console.log(res.data.err)
        });
    };
    recFac.upload_mtRec = function(rec) {
        $resource(baseURL + "records/mt", null, { 'update': { method: 'PUT'} }).update(rec, function(res) {
            console.log(res.body);
        }, function(res){
            console.log(res.data.err)
        });
    };
    
    recFac.upload_allRec = function(records) {
        $resource(baseURL + "records/all", null, { 'update': { method: 'PUT'} }).update(records, function(res) {
            console.log(res.body);
        }, function(res){
            console.log(res.data.err)
        });
    };
    
    return recFac;
})

.factory('localRecordFactory', ['$localStorage', 'cloudRecordFactory', function($localStorage, cRecFac) {
    var recFac = {};
    var records = {};
    
    records.mRecords = $localStorage.getObject('mRecords', '[]');
    records.tRecords = $localStorage.getObject('tRecords', '[]');
    records.tARecords = $localStorage.getObject('tARecords', '[]');
    records.tPoints = parseFloat($localStorage.get('tPoints', 0));
    
    records.mrRecords = $localStorage.getObject('mrRecords', '[]');
    records.trRecords = $localStorage.getObject('trRecords', '[]');
    
    records.mtRecords = $localStorage.getObject('mtRecords', '[]');
    
    recFac.getAllRecords = function() {
        return records;
    }
    
    recFac.getMRecords = function() {
        return records.mRecords;
    };
    recFac.getTRecords = function() {
        return records.tRecords;
    };
    recFac.getTARecords = function() {
        return records.tARecords;
    };
    recFac.getPoints = function() {
        return records.tPoints;
    };
    
    recFac.getMrRecords = function() {
        return records.mrRecords;
    };
    recFac.getTrRecords = function() {
        return records.trRecords;
    };
    
    recFac.getMtRecords = function() {
        return records.mtRecords;
    };
    
    recFac.updateMRecords = function(mRec) {
        records.mRecords = mRec;
        $localStorage.storeObject('mRecords', mRec);
    };
    recFac.updateTRecords = function(tRec) {
        records.tRecords = tRec;
        $localStorage.storeObject('tRecords', tRec);
    };
    recFac.updateTARecords = function(tARec) {
        records.tARecords = tARec;
        $localStorage.storeObject('tARecords', tARec);
    };
    recFac.updatePoints = function(pt) {
        records.tPoints = pt;
        $localStorage.storeObject('tPoints', pt);
    };
    
    var validateRRecords = function(rRec, date) { 
        if (rRec.length === 0) {
            
        } else {

            var pDate = new Date();
            var pMilli = rRec[0].milli;
            pDate.setTime(pMilli);

            if (pDate.getDate() != date.getDate() || pDate.getMonth() != date.getMonth() || pDate.getFullYear() != date.getFullYear())
                rRec.length = 0;

        }
    };
    recFac.refreshRRecords = function() {
        var date = new Date();
        validateRRecords(records.mrRecords, date);
        validateRRecords(records.trRecords, date);
        $localStorage.storeObject('mrRecords', records.mrRecords);
        $localStorage.storeObject('trRecords', records.trRecords);
    };
    recFac.updateRRecords = function(rec, type) {
        
        var date = new Date;
        var milli = date.getTime();
        
        if (type === "money") {
            validateRRecords(records.mrRecords, date);
            records.mrRecords.push(rec);
            $localStorage.storeObject('mrRecords', records.mrRecords);
        }
        if (type === "task") {
            validateRRecords(records.trRecords, date);
            var involve_flag = false;
            for (var i = 0; i < records.trRecords.length; i++) {
                var trRec = records.trRecords[i];
                if (trRec.id == rec.id) {
                    involve_flag = true;
                    trRec.date = rec.date;
                    trRec.milli = rec.milli;
                    trRec.amount += 1;
                    trRec.done_times.push(milli);
                    break;
                }
            }
            if (!involve_flag) {
                rec.amount = 1;
                rec.done_times = [milli];
                records.trRecords.push(rec);
            }
            $localStorage.storeObject('trRecords', records.trRecords);
        }
        
    };
    
    recFac.updateMtRecords = function(mtRec) {
        records.mtRecords = mtRec;
        $localStorage.storeObject('mtRecords', records.mtRecords);
    };
    
    recFac.delFromMRec = function(id) {
        for (var i = 0; i < records.mRecords.length; i++) {
            if (i == id) {
                records.mRecords.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < records.mRecords.length; i++) {
            if (i >= id)
                records.mRecords[i].id = i;
        }
        for (var i = 0; i < records.mrRecords.length; i++) {
            if (records.mrRecords[i].id == id) {
                records.mrRecords.splice(i, 1);
                break;
            }
        }
        $localStorage.storeObject('mRecords', records.mRecords);
        $localStorage.storeObject('mrRecords', records.mrRecords);
    };
    recFac.editFromMRec = function(id, rec) {
        records.mRecords[id] = rec;
        $localStorage.storeObject('mRecords', records.mRecords);
    };
    recFac.delFromTRec = function(id) {
        for (var i = 0; i < records.tRecords.length; i++) {
            if (i == id) {
                records.tRecords.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < records.tRecords.length; i++) {
            if (i >= id)
                records.tRecords[i].id = i;
        }
        for (var i = 0; i < records.trRecords.length; i++) {
            if (records.trRecords[i].id == id) {
                records.trRecords.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < records.trRecords.length; i++) {
            if (records.trRecords[i].id > id)
                records.trRecords[i].id -= 1;
        }
        $localStorage.storeObject('tRecords', records.tRecords);
        $localStorage.storeObject('trRecords', records.trRecords);
    };
    recFac.editFromTRec = function(id, rec) {
        records.tRecords[id] = rec;
        $localStorage.storeObject('tRecords', records.tRecords);
    };
    recFac.delFromTARec = function(id) {
        for (var i = 0; i < records.tARecords.length; i++) {
            if (i == id) {
                records.tARecords.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < records.tARecords.length; i++) {
            if (i >= id)
                records.tARecords[i].id = i;
        }
        $localStorage.storeObject('tARecords', records.tARecords);
    };
    
    recFac.delFromMtRec = function(id) {
        for (var i = 0; i < records.mtRecords.length; i++) {
            if (i == id) {
                records.mtRecords.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < records.mtRecords.length; i++) {
            if (i >= id)
                records.mtRecords[i].id = i;
        }
        $localStorage.storeObject('mtRecords', records.mtRecords);
    };
    recFac.editFromMtRec = function(id, rec) {
        records.mtRecords[id] = rec;
        $localStorage.storeObject('mtRecords', records.mtRecords);
    };
    
    recFac.tmpOutputTemplate = {
        "triggered": false,
        "event": "",
        "amount": 0,
        "unit_price": 0
    };
    recFac.tmpIncomeTemplate = {
        "triggered": false,
        "event": "",
        "amount": 1,
        "unit_price": 0
    };
    
    return recFac;
}])

.factory('textManageFactory', ['languageFactory', 'userFactory', function(lFac, uFac) {
    var tmFac = {};
    
    tmFac.moneyTextType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "output")
            return lang.moneyTextType.output;
        return lang.moneyTextType.income;
    };
    tmFac.moneyType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "output")
            return lang.moneyType.output;
        return lang.moneyType.income;
    };
    
    tmFac.taskType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "task")
            return lang.taskType.task;
        if (type === "desire")
            return lang.taskType.desire;
        return lang.taskType.memo;
    };
    tmFac.taskTextType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "task")
            return lang.taskTextType.task;
        return lang.taskTextType.desire;
    };
    tmFac.taskDoneType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "task")
            return lang.taskDoneType.task;
        return lang.taskDoneType.desire;
    };
    tmFac.taskDoneText = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "task")
            return lang.taskDoneText.task;
        return lang.taskDoneText.desire;
    };
    tmFac.taskArchiveType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "task")
            return lang.taskArchiveType.task;
        return lang.taskArchiveType.desire;
    };
    
    tmFac.regToastType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "success")
            return lang.regToastType.success;
        return lang.regToastType.failed;
    };
    tmFac.loginToastType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "success")
            return lang.loginToastType.success;
        return lang.loginToastType.failed;
    };
    tmFac.settingToastType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "success")
            return lang.settingToastType.success;
        return lang.settingToastType.failed;
    };
    tmFac.uploadToastType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "success")
            return lang.uploadToastType.success;
        return lang.uploadToastType.failed;
    };
    tmFac.downloadToastType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "success")
            return lang.downloadToastType.success;
        return lang.downloadToastType.failed;
    };
    
    tmFac.addToastType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "success")
            return lang.addToastType.success;
        return lang.addToastType.failed;
    };
    tmFac.modifyToastType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "success")
            return lang.modifyToastType.success;
        return lang.modifyToastType.failed;
    };
    
    tmFac.meErrMsg = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "amount")
            return lang.meErrMsg.amount;
        return lang.meErrMsg.unit_price;
    };
    tmFac.teErrMsg = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "points")
            return lang.teErrMsg.points;
    };
    tmFac.tceErrMsg = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "points")
            return lang.tceErrMsg.points;
        return lang.tceErrMsg.amount;
    };
    
    tmFac.tceDoneText = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "task")
            return lang.tceDoneText.task;
        return lang.tceDoneText.desire;
    };
    
    return tmFac;
}])

.factory('recordManageFactory', function($ionicPlatform, $ionicListDelegate, $ionicPopup, $cordovaToast, localRecordFactory, textManageFactory, languageFactory, userFactory) {
    var rmFac = {};
    
    rmFac.injectBasicTRecInfo = function(org, tar) {
        tar.id = org.id;
        tar.type = org.type;
        tar.event = org.event;
        tar.points = org.points;
        tar.amount = org.amount;
        tar.done_times = org.done_times;
    };
    rmFac.doDel = function(category, type, id, msg, next) {
        
        var del_method, pop_msg, toast_msg;
        var lang = languageFactory.lang(userFactory.getLocalInfo().lang);

        if (category === "money") {
            del_method = localRecordFactory.delFromMRec;
            pop_msg = lang.rmFac.moneyPop;
            toast_msg = lang.rmFac.moneyToast;
        } else if (category === "task") {
            del_method = localRecordFactory.delFromTRec;
            pop_msg = lang.rmFac.taskPop(msg, type);
            toast_msg = lang.rmFac.taskToast(msg);
        } else if (category === "aTask") {
            del_method = localRecordFactory.delFromTARec;
            pop_msg = lang.rmFac.aTaskPop;
            toast_msg = lang.rmFac.aTaskToast;
        } else if (category === "templates") {
            del_method = localRecordFactory.delFromMtRec;
            pop_msg = lang.rmFac.templatesPop;
            toast_msg = lang.rmFac.templatesToast;
        } else {
            console.log("Error, doDel not implemented with " + category + " !");
        }
        
        $ionicListDelegate.closeOptionButtons();
        var confirmPopup = $ionicPopup.confirm({
            template: '<p style="text-align:center;">' + pop_msg + "</p>"
        });
        confirmPopup.then(function (res) {
            if (res) {
                del_method(id);
                next();
                $ionicPlatform.ready(function () {
                    $cordovaToast
                        .showLongBottom(toast_msg)
                        .then(
                            function (success) {}, 
                            function (error) {}
                        );
                });
            } else {
                console.log('Canceled ' + msg);
            }
        });
        
    };
    rmFac.doMoneyFormAdd = function(type, forms, records, msg, next) {
        
        var lang = languageFactory.lang(userFactory.getLocalInfo().lang);

        var date = new Date();
        var info = {
            "id": records.length,
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

        if (type === "output") {
            form_idx = 0; event_idx = 2;
            amount_idx = 1; per_idx = 0;
        } else {
            form_idx = 1; event_idx = 1;
            amount_idx = -1; per_idx = 0;
        }

        info.event = forms[form_idx].contents[event_idx].body;
        if (amount_idx < 0)
            info.amount = 1;
        else
            info.amount = parseInt(forms[form_idx].contents[amount_idx].body);
        info.unit_price = parseFloat(forms[form_idx].contents[per_idx].body);

        if (isNaN(info.amount) || info.amount <= 0) {
            err_flag = true;
            err_msg += lang.rmFac.err_msg("amount");
        }
        if (isNaN(info.unit_price)) {
            err_flag = true;
            err_msg += lang.rmFac.err_msg("unit_price") + lang.rmFac.err_type(type) + " !";
        }

        if (!err_flag)
            next(info);

        $ionicPlatform.ready(function() {
            if (!err_flag) {
                $cordovaToast
                    .showLongBottom(lang.rmFac.toast("success", msg, err_msg))
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            } else {
                $cordovaToast
                    .show(lang.rmFac.toast("failed", msg, err_msg), 'long', 'center')
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            }
        });
        
    };
    rmFac.doMoneyTemplateAdd = function(type, template, records, next) {
        
        var lang = languageFactory.lang(userFactory.getLocalInfo().lang);
        
        var date = new Date();
        var info = {
            "id": records.length,
            "type": type,
            "event": template.event,
            "amount": parseInt(template.amount),
            "unit_price": parseFloat(template.unit_price),
            "sum": 0,
            "date": date,
            "milli": date.getTime()
        };
        var err_flag = false, err_msg = "";

        if (isNaN(info.amount) || info.amount <= 0) {
            err_flag = true;
            err_msg += lang.rmFac.err_msg("amount");
        }
        if (isNaN(info.unit_price)) {
            err_flag = true;
            err_msg += lang.rmFac.err_msg("unit_price"); + lang.rmFac.err_type(type) + " !";
        }

        if (!err_flag)
            next(info);

        $ionicPlatform.ready(function() {
            if (!err_flag) {
                $cordovaToast
                    .showLongBottom(lang.rmFac.toast("success", "记录", err_msg))
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            } else {
                $cordovaToast
                    .show(lang.rmFac.toast("failed", "记录", err_msg), 'long', 'center')
                    .then(
                        function (success) {}, 
                        function (error) {}
                    );
            }
        });
        
    };
    
    return rmFac;
})

.factory('formatFactory', function($filter) {
    var fFac = {};
    
    fFac.formatNumber = function(num, precision) {
        return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
    };
    
    fFac.date = function(rec) {
        return $filter('date') (rec.date, 'yyyy-MM-dd');
    };
    fFac.time = function(rec) { 
        return $filter('date') (rec.date, 'HH:mm');
    };
    fFac.showDateAndTime = function(milli) {
        var date = new Date();
        date.setTime(milli);
        return $filter('date') (date, 'yyyy-MM-dd HH:mm:ss');
    };
    
    return fFac;
})

.factory('userFactory', function($resource, $localStorage, baseURL) {
    var userFac = {};
    
    var localInfo = $localStorage.getObject('localInfo', '{}');
    var loginData = $localStorage.getObject('loginData', '{}');
    
    if (!localInfo.lang)
        localInfo.lang = "zh_cn";
    
    userFac.getLocalInfo = function() {
        return localInfo;
    };
    userFac.getLoginData = function() {
        return loginData;
    };
    
    return userFac;
})

.factory('formFactory', function($resource, baseURL, languageFactory) {
    var fFac = {};
    
    fFac.getMForms = function(lang) {
        var lang = languageFactory.lang(lang);
        var rs = [
            {
                "type": "output",
                "title": lang.mForm.a,
                "contents": [
                    {
                        "title": lang.mForm.b,
                        "body": ""
                    },
                    {
                        "title": lang.mForm.c,
                        "body": ""
                    },
                    {
                        "title": lang.mForm.d,
                        "body": ""
                    }
                ]
            },
            {
                "type": "income",
                "title": lang.mForm.e,
                "contents": [
                    {
                        "title": lang.mForm.f,
                        "body": ""
                    },
                    {
                        "title": lang.mForm.g,
                        "body": ""
                    }
                ]
            }
        ];
        return rs;
    };
    fFac.getTForms = function(lang) {
        var lang = languageFactory.lang(lang);
        var rs = [
            {
                "type": "task",
                "title": lang.tForm.a,
                "contents": [
                    {
                        "title": lang.tForm.b,
                        "body": ""
                    },
                    {
                        "title": lang.tForm.c,
                        "body": ""
                    }
                ]
            },
            {
                "type": "desire",
                "title": lang.tForm.d,
                "contents": [
                    {
                        "title": lang.tForm.e,
                        "body": ""
                    },
                    {
                        "title": lang.tForm.f,
                        "body": ""
                    }
                ]
            },
            {
                "type": "memo",
                "title": lang.tForm.g,
                "contents": [{
                    "title": "",
                    "body": ""
                }]
            }
        ];
        return rs;
    };
    
    return fFac;
})

.factory('authFactory', function($resource, $http, $localStorage, $rootScope, baseURL, $ionicPopup, userFactory, languageFactory) {
    
    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var authToken = undefined;
    
    var loadUserCredentials = function() {
        var credentials = $localStorage.getObject(TOKEN_KEY, '{}');
        if (credentials.username != undefined) {
            useCredentials(credentials);
        }
    };
    var storeUserCredentials = function(credentials) {
        $localStorage.storeObject(TOKEN_KEY, credentials);
        useCredentials(credentials);
    };
    var useCredentials = function(credentials) {
        isAuthenticated = true;
        username = credentials.username;
        authToken = credentials.token;
        $http.defaults.headers.common['x-access-token'] = authToken;
    }
    var destroyUserCredentials = function() {
        authToken = undefined;
        username = '';
        isAuthenticated = false;
        $http.defaults.headers.common['x-access-token'] = authToken;
        $localStorage.remove(TOKEN_KEY);
    }
     
    authFac.login = function(loginData) {   
        $resource(baseURL + "users/login").save(loginData, function(res) {
            storeUserCredentials({username: loginData.username, token: res.token});
            $rootScope.$broadcast('login:Successful');
        }, function(res){
            isAuthenticated = false;
            var message = '<div><p>' +  res.data.err.message + '</p></div>';
            var lang = languageFactory.lang(userFactory.getLocalInfo().lang);
            var alertPopup = $ionicPopup.alert({
                title: '<h4>' + lang.loginToastType.failed + '</h4>',
                template: message
            });
            alertPopup.then(function(res) {
                console.log('Login Failed!');
            });
        });
    };
    authFac.logout = function() {
        $resource(baseURL + "users/logout").get(function(response) {});
        destroyUserCredentials();
    };   
    authFac.register = function(registerData) {
        $resource(baseURL + "users/register").save(registerData, function(res) {
            authFac.login({username: registerData.username, password: registerData.password});
            $rootScope.$broadcast('registration:Successful');
        }, function(res){
            var message = '<div><p>' +  res.data.err.message + '</p></div>';
            var lang = languageFactory.lang(userFactory.getLocalInfo().lang);
            var alertPopup = $ionicPopup.alert({
                title: '<h4>' + lang.regToastType.failed + '</h4>',
                template: message
            });
            alertPopup.then(function(res) {
                console.log('Registration Failed!');
            });
        });
    };
    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };
    authFac.getUsername = function() {
        return username;  
    };
    
    loadUserCredentials();
    
    return authFac;
    
})

.factory('languageFactory', function() {
    var langFac = {};
    // {{lang(localInfo.lang).home.a}}
    langFac.zh_cn = {
        
        "mForm": {
            "a": "记录支出",
            "b": "单价",
            "c": "数量",
            "d": "事件描述",
            "e": "记录收入",
            "f": "数额",
            "g": "事件描述"
        },
        "tForm": {
            "a": "新任务",
            "b": "描述",
            "c": "得点",
            "d": "新欲望",
            "e": "描述",
            "f": "失点",
            "g": "新备忘"
        },
        
        "ma": {
            "a": "增添财务记录",
            "b": "记录支出",
            "c": "记录收入",
            "d": "保存模板",
            "e": "加载模板"
        },
        "mat": {
            "a": "记录模板查询",
            "b": "排列方式",
            "c": "排列顺序",
            "d": "时间",
            "e": "金额",
            "f": "顺序",
            "g": "倒序",
            "h": "事件",
            "i": "单价",
            "j": "数量",
            "k": "数额",
            "l": "具体时间",
            "m": "删除"
        },
        "mata": {
            "a": "增添财务记录",
            "b": "记录支出",
            "c": "单价",
            "d": "数量",
            "e": "事件描述",
            "f": "记录",
            "g": "记录收入",
            "h": "数额",
            "i": "事件描述",
            "j": "记录"
        },
        "mc": {
            "a": "财务记录查询",
            "b": "查询类别",
            "c": "排列方式",
            "d": "排列顺序",
            "e": "支出",
            "f": "收入",
            "g": "时间",
            "h": "金额",
            "i": "顺序",
            "j": "倒序",
            "k": "事件",
            "l": "单价",
            "m": "数量",
            "n": "数额",
            "o": "具体时间",
            "p": "删除"
        },
        "mce": {
            "a": "编辑记录",
            "b": "日期",
            "c": "时间",
            "d": "事件",
            "e": "数量",
            "f": "修改"
        },
        "mt": {
            "a": "记录模板查询",
            "b": "查询类别",
            "c": "排列方式",
            "d": "排列顺序",
            "e": "支出",
            "f": "收入",
            "g": "时间",
            "h": "金额",
            "i": "顺序",
            "j": "倒序",
            "k": "单价",
            "l": "数量",
            "m": "数额",
            "n": "更新时间",
            "o": "删除"
        },
        "mte": {
            "a": "编辑模板",
            "b": "数量",
            "c": "事件",
            "d": "修改",
            "e": "应用"
        },
        
        "ta": {
            "a": "增添事件",
            "b": "新任务",
            "c": "新欲望",
            "d": "新备忘"
        },
        "tc": {
            "a": "事件查询",
            "b": "任务",
            "c": "欲望",
            "d": "次数",
            "e": "更新时间",
            "f": "删除"
        },
        "tce": {
            "a": "详情",
            "b": "事件",
            "c": "次数",
            "d": "修改"
        },
        "tm": {
            "a": "备忘查询",
            "b": "更新时间",
            "c": "删除"
        },
        "tme": {
            "a": "编辑备忘",
            "b": "修改"
        },
        "ts": {
            "a": "归档事件",
            "b": "归档时间",
            "c": "删除"
        },
        "tsd": {
            "a": "详情",
            "b": "事件",
            "c": "次数",
            "d": "时间"
        },
        
        "home": {
            "a": "财务管理综述",
            "b": "支出金额",
            "c": "收入金额",
            "d": "事件管理综述",
            "e": "剩余点数",
            "f": "最近备忘",
            "g": "记账者信息",
            "h": "用户名",
            "i": "年收入"
        },
        "login": {
            "a": "返回",
            "b": "用户名",
            "c": "密码",
            "d": "登录"
        },
        "recent": {
            "a": "今日账本",
            "b": "财务账本",
            "c": "事件账本",
            "d": "今日财务统计",
            "e": "总支出数额",
            "f": "总收入数额",
            "g": "今日财务记录",
            "h": "今日事件统计",
            "i": "总得点",
            "j": "总失点",
            "k": "今日事件记录",
            "l": "数额",
            "m": "具体时间",
            "n": "今日",
            "o": "次数",
            "p": "时间"
        },
        "register": {
            "a": "返回",
            "b": "用户名",
            "c": "密码",
            "d": "注册"
        },
        "setting": {
            "a": "设置",
            "b": "返回",
            "c": "语言",
            "d": "头像",
            "e": "照相",
            "f": "图库",
            "g": "用户名",
            "h": "年收入",
            "i": "设置终了"
        },
        "sidebar": {
            "a": "导航",
            "b": "主页",
            "c": "今日账本",
            "d": "财务账本",
            "e": "记一笔",
            "f": "查询记录",
            "g": "查询模板",
            "h": "统计记录",
            "i": "事件账本",
            "j": "增添事件",
            "k": "查看事件",
            "l": "查看备忘",
            "m": "归档事件",
            "n": "服务",
            "o": "登录",
            "p": "注册",
            "q": "设置",
            "r": "同步"
        },
        "sync": {
            "a": "上传数据",
            "b": "下载数据"
        },
        
        "moneyType": {
            "output": "支出",
            "income": "收入"
        },
        "moneyTextType": {
            "output": "单价",
            "income": "数额"
        },
        "taskType": {
            "task": "任务",
            "desire": "欲望",
            "memo": "备忘"
        },
        "taskTextType": {
            "task": "得点",
            "desire": "失点"
        },
        "taskDoneType": {
            "task": "完成",
            "desire": "实现"
        },
        "taskDoneText": {
            "task": "完成任务",
            "desire": "实现欲望"
        },
        "taskArchiveType": {
            "task": "归档任务",
            "desire": "归档欲望"
        },
        
        "regToastType": {
            "success": "注册成功 !",
            "failed": "注册失败 !"
        },
        "loginToastType": {
            "success": "登录成功 !",
            "failed": "登录失败 !"
        },
        "settingToastType": {
            "success": "设置成功 !",
            "failed": "设置失败 !"
        },
        "uploadToastType": {
            "success": "上传成功 !",
            "failed": "上传失败 !"
        },
        "downloadToastType": {
            "success": "下载成功 !",
            "failed": "下载失败 !"
        },
        
        "addToastType": {
            "success": "添加成功 !",
            "failed": "添加失败 !"
        },
        "modifyToastType": {
            "success": "修改成功 !",
            "failed": "修改失败 !"
        },
        
        "meErrMsg": {
            "amount": "\n请输入正确的数量 !",
            "unit_price": "\n请输入正确的"
        },
        "teErrMsg": {
            "points": "\n请输入正确的点数 !"
        },
        "tceErrMsg": {
            "points": "\n请输入正确的点数 !",
            "amount": "\n请输入正确的次数 !"
        },
        
        "tceDoneText": {
            "task": "记录成功 ! 点数 + ",
            "desire": "记录成功 ! 点数 - "
        },

        "rmFac": {

            "moneyPop": "你确定要删除这条记录吗 ?",
            "moneyToast": "删除成功 !",
            "taskPop": function(msg, type) {
                var taskType = "";
                if (type === "task")
                    taskType = "任务";
                else if (type === "desire")
                    taskType = "欲望";
                else
                    taskType = "备忘";
                return "你确定要" + msg + "这个" + taskType + "吗 ?";
            },
            "taskToast": function(msg) {
                return msg + "成功 !";
            },
            "aTaskPop": "确认删除 ?",
            "aTaskToast": "删除成功 !",
            "templatesPop": "你确定要删除这个模板吗 ?",
            "templatesToast": "删除成功 !",

            "err_type": function(type) {
                if (type === "output")
                    return "单价";
                return "数额";
            },
            "err_msg": function(type) {
                if (type === "amount")
                    return "\n请输入正确的数量 !";
                return "\n请输入正确的";
            },
            "toast": function(type, msg, err_msg) {
                if (type === "success")
                    return msg + "成功 !";
                return msg + "失败 !" + err_msg;
            }

        }
        
    };
    langFac.en = {
        
        "mForm": {
            "a": "Expenditure",
            "b": "Unit-Price",
            "c": "Quantity",
            "d": "Description",
            "e": "Income",
            "f": "Amount",
            "g": "Description"
        },
        "tForm": {
            "a": "New Task",
            "b": "Description",
            "c": "pt. Gained",
            "d": "New Desire",
            "e": "Description",
            "f": "pt. Lost",
            "g": "New Memo"
        },
        
        "ma": {
            "a": "Add Financial Record",
            "b": "Expenditure Record",
            "c": "Income Record",
            "d": "Save Template",
            "e": "Load Template"
        },
        "mat": {
            "a": "Check Templates",
            "b": "Ordered By",
            "c": "Ordered Type",
            "d": "Time",
            "e": "Amount",
            "f": "Normal",
            "g": "Inverted",
            "h": "Description",
            "i": "Unit-Price",
            "j": "Quantity",
            "k": "Amount",
            "l": "Time",
            "m": "Delete",
        },
        "mata": {
            "a": "Add Financial Record",
            "b": "Expenditure Record",
            "c": "Unit-Price",
            "d": "Quantity",
            "e": "Description",
            "f": "Done",
            "g": "Income Record",
            "h": "Amount",
            "i": "Description",
            "j": "Done"
        },
        "mc": {
            "a": "Check Financial Records",
            "b": "Type",
            "c": "Ordered by",
            "d": "Ordered Type",
            "e": "Expenditure",
            "f": "Income",
            "g": "Time",
            "h": "Amount",
            "i": "Normal",
            "j": "Inverted",
            "k": "Description",
            "l": "Unit-Price",
            "m": "Quantity",
            "n": "Amount",
            "o": "Time",
            "p": "Delete"
        },
        "mce": {
            "a": "Edit Record",
            "b": "Date",
            "c": "Time",
            "d": "Description",
            "e": "Quantity",
            "f": "Modify"
        },
        "mt": {
            "a": "Check Financial Records",
            "b": "Type",
            "c": "Ordered by",
            "d": "Ordered Type",
            "e": "Expenditure",
            "f": "Income",
            "g": "Time",
            "h": "Amount",
            "i": "Normal",
            "j": "Inverted",
            "k": "Unit-Price",
            "l": "Quantity",
            "m": "Amount",
            "n": "Update Time",
            "o": "Delete"
        },
        "mte": {
            "a": "Edit Template",
            "b": "Quantity",
            "c": "Description",
            "d": "Modify",
            "e": "Apply"
        },
        
        "ta": {
            "a": "Add Event",
            "b": "New Task",
            "c": "New Desire",
            "d": "New Memo"
        },
        "tc": {
            "a": "Check Events",
            "b": "Tasks",
            "c": "Desires",
            "d": "",
            "e": "Update Time",
            "f": "Delete"
        },
        "tce": {
            "a": "Detail",
            "b": "Description",
            "c": "",
            "d": "Modify"
        },
        "tm": {
            "a": "Check Memo",
            "b": "Update Time",
            "c": "Delete"
        },
        "tme": {
            "a": "Edit Memo",
            "b": "Modify"
        },
        "ts": {
            "a": "Archived Events",
            "b": "Archive Time",
            "c": "Delete"
        },
        "tsd": {
            "a": "Detail",
            "b": "Description",
            "c": "",
            "d": " Time(s)"
        },
        
        "home": {
            "a": "Financial Summerization",
            "b": "Expenditure",
            "c": "Income",
            "d": "Event Summerization",
            "e": "pt. Left",
            "f": "Latest Memo",
            "g": "User Info",
            "h": "Username",
            "i": "Income"
        },
        "login": {
            "a": "Back",
            "b": "Username",
            "c": "Password",
            "d": "Log In"
        },
        "recent": {
            "a": "Today's Account",
            "b": "Finance",
            "c": "Event",
            "d": "Today's Financial Summerization",
            "e": "Total Expenditure",
            "f": "Total Income",
            "g": "Details",
            "h": "Today's Event Summerization",
            "i": "Total pt. Gained",
            "j": "Total pt. Lost",
            "k": "Details",
            "l": "",
            "m": "Time",
            "n": "",
            "o": "",
            "p": "Time(s)"
        },
        "register": {
            "a": "Back",
            "b": "Username",
            "c": "Password",
            "d": "Register"
        },
        "setting": {
            "a": "Setting",
            "b": "Back",
            "c": "Language",
            "d": "Avatar",
            "e": "Camera",
            "f": "Gallery",
            "g": "Username",
            "h": "Income",
            "i": "Done"
        },
        "sidebar": {
            "a": "Navigation",
            "b": "Home",
            "c": "Today's Account",
            "d": "Financial Account",
            "e": "Take a Note !",
            "f": "Check Records",
            "g": "Check Templates",
            "h": "Analytics",
            "i": "Event Account",
            "j": "Add Event",
            "k": "Check Events",
            "l": "Check Memo",
            "m": "Archived",
            "n": "Services",
            "o": "Log in",
            "p": "Register",
            "q": "Settings",
            "r": "Sync"
        },
        "sync": {
            "a": "Upload",
            "b": "Download"
        },
        
        "moneyType": {
            "output": "Amount",
            "income": "Amount"
        },
        "moneyTextType": {
            "output": "Unit-Price",
            "income": "Amount"
        },
        "taskType": {
            "task": "Task's ",
            "desire": "Desire's ",
            "memo": "Memo's "
        },
        "taskTextType": {
            "task": "pt. Gained",
            "desire": "pt. Lost"
        },
        "taskDoneType": {
            "task": "Achieved",
            "desire": "Achieved"
        },
        "taskDoneText": {
            "task": "Achieve",
            "desire": "Achieve"
        },
        "taskArchiveType": {
            "task": "Archive",
            "desire": "Archive"
        },
        
        "regToastType": {
            "success": "Registration Succeeded !",
            "failed": "Registration Failed !"
        },
        "loginToastType": {
            "success": "Log In Successfully !",
            "failed": "Log In Failed !"
        },
        "settingToastType": {
            "success": "Success !",
            "failed": "Failed !"
        },
        "uploadToastType": {
            "success": "Success !",
            "failed": "Failed !"
        },
        "downloadToastType": {
            "success": "Success !",
            "failed": "Failed !"
        },
        
        "addToastType": {
            "success": "Success !",
            "failed": "Failed !"
        },
        "modifyToastType": {
            "success": "Success !",
            "failed": "Failed !"
        },
        
        "meErrMsg": {
            "amount": "\nPlease Provide a Validate Number for Quantity !",
            "unit_price": "\nPlease Provide a Validate Number for "
        },
        "teErrMsg": {
            "points": "Please Provide a Validate Number for pt. !"
        },
        "tceErrMsg": {
            "points": "\nPlease Provide a Validate Number for Points !",
            "amount": "\nPlease Provide a Validate Number for Achieved !"
        },
        
        "tceDoneText": {
            "task": "pt. + ",
            "desire": "pt. - "
        },
        
        "rmFac": {

            "moneyPop": "Confirm Deletion ?",
            "moneyToast": "Deleted Successfully !",
            "taskPop": function(msg, type) {
                var taskType = "";
                if (type === "task")
                    taskType = "Task";
                else if (type === "desire")
                    taskType = "Desire";
                else
                    taskType = "Memo";
                if (msg === "删除")
                    msg = "Deleting";
                else
                    msg = "Archiving";
                return "Confirm " + msg + " This " + taskType + " ?";
            },
            "taskToast": function(msg) {
                if (msg === "删除")
                    msg = "Deleted";
                else
                    msg = "Archived";
                return msg + " Successfully !";
            },
            "aTaskPop": "Confirm Deletion ?",
            "aTaskToast": "Deleted Successfully !",
            "templatesPop": "Confirm Deletion ?",
            "templatesToast": "Deleted Successfully !",

            "err_type": function(type) {
                if (type === "output")
                    return "Unit-Price";
                return "Amount";
            },
            "err_msg": function(type) {
                if (type === "amount")
                    return "\nPlease Provide a Validate Number for Quantity !";
                return "\Please Provide a Validate Number for ";
            },
            "toast": function(type, msg, err_msg) {
                if (msg === "保存") {
                    sMsg = "Saved Successfully !";
                    fMsg = "Saved Failed !"
                } else {
                    sMsg = "Success !";
                    fMsg = "Failed !";
                }
                if (type === "success")
                    return sMsg;
                return fMsg + err_msg;
            }

        }
        
    };
    
    langFac.lang = function(type) {
        if (type === "zh_cn")
            return langFac.zh_cn;
        if (type === "en")
            return langFac.en;
    };
    
    return langFac;
})

;