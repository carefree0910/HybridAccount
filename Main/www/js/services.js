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

.factory('cloudRecordFactory', function($q, $resource, baseURL, $ionicListDelegate) {
    var recFac = {};
    
    recFac.allRecords = $resource(baseURL + "records/:id", null, {
        'update': {
            method: 'PUT'
        }
    });
    
    recFac.getMRecords = function() {
        var rs = $q.defer();
        recFac.allRecords.get({id:0}, function(res) {
            rs.resolve(res.content);
        }, function() {
            rs.reject();
        });
        return rs.promise;
    };
    recFac.getTRecords = function() {
        var rs = $q.defer();
        recFac.allRecords.get({id:1}, function(res) {
            rs.resolve(res.content);
        }, function() {
            rs.reject();
        });
        return rs.promise;
    };

    recFac.getTimes = function() {
        var rs = $q.defer();
        recFac.allRecords.get({id:1}, function(res) {
            var times = 0;
            for (var i = 0; i < res.content.length; i++) {
                times += res.content[i].time;
            }
            rs.resolve(times);
        })
        return rs.promise;
    };
    recFac.getDDL = function() { return 0; };
    
    recFac.delFromMRec = function(id) {
        recFac.allRecords.get({id:0}, function(res) {
            for (var i = 0; i < res.content.length; i++) {
                if (i == id) {
                    res.content.splice(i, 1);
                    break;
                }
            }
            for (var i = 0; i < res.content.length; i++) {
                if (i >= id)
                    res.content[i].id = i;
            }
            recFac.allRecords.update({id:0}, res);
            $ionicListDelegate.closeOptionButtons();
        });
    };
    
    return recFac;
})

.factory('localRecordFactory', ['$localStorage', 'cloudRecordFactory', function($localStorage, cRecFac) {
    var recFac = {};
    
    var mRecords = $localStorage.getObject('mRecords', '[]');
    var tRecords = $localStorage.getObject('tRecords', '[]');
    var tARecords = $localStorage.getObject('tARecords', '[]');
    var tPoints = parseFloat($localStorage.get('tPoints', 0));
    
    recFac.getMRecords = function() {
        return mRecords;
    };
    recFac.getTRecords = function() {
        return tRecords;
    };
    recFac.getTARecords = function() {
        return tARecords;
    };
    recFac.getPoints = function() {
        return tPoints;
    };
    
    recFac.updateMRecords = function(mRec) {
        mRecords = mRec;
        $localStorage.storeObject('mRecords', mRec);
    };
    recFac.updateTRecords = function(tRec) {
        tRecords = tRec;
        $localStorage.storeObject('tRecords', tRec);
    };
    recFac.updateTARecords = function(tARec) {
        tARecords = tARec;
        $localStorage.storeObject('tARecords', tARec);
    };
    recFac.updatePoints = function(pt) {
        tPoints = pt;
        $localStorage.storeObject('tPoints', pt);
    }
    
    recFac.delFromMRec = function(id) {
        for (var i = 0; i < mRecords.length; i++) {
            if (i == id) {
                mRecords.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < mRecords.length; i++) {
            if (i >= id)
                mRecords[i].id = i;
        }
        recFac.updateMRecords(mRecords);
    };
    recFac.editFromMRec = function(id, rec) {
        mRecords[id] = rec;
        recFac.updateMRecords(mRecords);
    };
    recFac.delFromTRec = function(id) {
        for (var i = 0; i < tRecords.length; i++) {
            if (i == id) {
                tRecords.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < tRecords.length; i++) {
            if (i >= id)
                tRecords[i].id = i;
        }
        recFac.updateTRecords(tRecords);
    };
    recFac.editFromTRec = function(id, rec) {
        tRecords[id] = rec;
        recFac.updateTRecords(tRecords);
    };
    recFac.delFromTARec = function(id) {
        for (var i = 0; i < tARecords.length; i++) {
            if (i == id) {
                tARecords.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < tARecords.length; i++) {
            if (i >= id)
                tARecords[i].id = i;
        }
        recFac.updateTARecords(tARecords);
    };
    
    return recFac;
}])

.factory('textManageFactory', function() {
    var tmFac = {};
    
    tmFac.moneyTextType = function(type) {
        if (type === "output")
            return "单价";
        return "数额";
    };
    
    tmFac.taskType = function(type) {
        if (type === "task")
            return "任务";
        return "欲望";
    };
    tmFac.taskDoneType = function(type) {
        if (type === "task")
            return "完成";
        return "实现";
    };
    tmFac.taskTextType = function(type) {
        if (type === "task")
            return "得点";
        return "失点";
    };
    
    return tmFac;
})

.factory('recordManageFactory', function($ionicPlatform, $ionicListDelegate, $ionicPopup, $cordovaToast, localRecordFactory, textManageFactory) {
    var rmFac = {};
    
    rmFac.doDel = function(category, type, id, msg, next) {
        
        var del_method, pop_msg, toast_msg;
        if (category === "money") {
            del_method = localRecordFactory.delFromMRec;
            pop_msg = "你确定要删除这条记录吗 ?";
            toast_msg = "删除成功 !";
        } else if (category === "task") {
            del_method = localRecordFactory.delFromTRec;
            pop_msg = "你确定要" + msg + "这个" + textManageFactory.taskType(type) + "吗 ?";
            toast_msg = msg + "成功 !";
        } else if (category === "aTask") {
            del_method = localRecordFactory.delFromTARec;
            pop_msg = "确认删除 ?";
            toast_msg = "删除成功 !";
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
    
    return rmFac;
})

.factory('formatFactory', function($filter) {
    var fFac = {};
    
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
    
    userFac.getLocalInfo = function() {
        return localInfo;
    };
    userFac.getLoginData = function() {
        return loginData;
    };
    
    return userFac;
})

.factory('formFactory', function($resource, baseURL) {
    return {
        forms: [
            [
                {
                    "type": "output",
                    "title": "记录支出",
                    "button": "记录",
                    "contents": [
                        {
                            "title": "单价",
                            "body": ""
                        },
                        {
                            "title": "数量",
                            "body": ""
                        },
                        {
                            "title": "事件描述",
                            "body": ""
                        }
                    ]
                },
                {
                    "type": "income",
                    "title": "记录收入",
                    "button": "记录",
                    "contents": [
                        {
                            "title": "数额",
                            "body": ""
                        },
                        {
                            "title": "事件描述",
                            "body": ""
                        }
                    ]
                }
            ],
            [
                {
                    "type": "task",
                    "title": "新任务",
                    "button": "添加",
                    "contents": [
                        {
                            "title": "描述",
                            "body": ""
                        },
                        {
                            "title": "得点",
                            "body": ""
                        }
                    ]
                },
                {
                    "type": "desire",
                    "title": "新欲望",
                    "button": "添加",
                    "contents": [
                        {
                            "title": "描述",
                            "body": ""
                        },
                        {
                            "title": "失点",
                            "body": ""
                        }
                    ]
                }
            ]
        ]
    };
})

.factory('authFactory', function($resource, $http, $localStorage, $rootScope, baseURL, $ionicPopup) {
    
    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var authToken = undefined;
    
    var loadUserCredentials = function () {
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
        
        $resource(baseURL + "users/login")
        
            .save(loginData, function(response) {
            
                storeUserCredentials({username:loginData.username, token: response.token});
                $rootScope.$broadcast('login:Successful');
            
            }, function(response){
            
                isAuthenticated = false;
            
                var message = '<div><p>' +  response.data.err.message + '</p><p>' + response.data.err.name + '</p></div>';
                var alertPopup = $ionicPopup.alert({
                    title: '<h4>登录失败 !</h4>',
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
        
        $resource(baseURL + "users/register")
        
            .save(registerData, function(response) {

                authFac.login({username:registerData.username, password:registerData.password});
                $rootScope.$broadcast('registration:Successful');

            }, function(response){

                var message = '<div><p>' +  response.data.err.message + '</p><p>' + response.data.err.name + '</p></div>';

                var alertPopup = $ionicPopup.alert({
                    title: '<h4>注册失败 !</h4>',
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

;