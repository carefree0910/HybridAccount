angular.module('Account', ['ionic', 'ngCordova', 'Account.controllers', 'Account.services'])

.run(function($ionicPlatform, $rootScope, $ionicLoading, $cordovaSplashscreen, $timeout) {
    
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    $timeout(function () {
      $cordovaSplashscreen.hide();
    }, 0);
  });
    
  $rootScope.$on('loading:show', function () {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> 加载中 ...'
    })
  });
  $rootScope.$on('loading:hide', function () {
    $ionicLoading.hide();
  });
  $rootScope.$on('$stateChangeStart', function () {
    console.log('Loading ...');
    $rootScope.$broadcast('loading:show');
  });
  $rootScope.$on('$stateChangeSuccess', function () {
    console.log('done');
    $rootScope.$broadcast('loading:hide');
  });
    
})

.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/sidebar.html',
        controller: 'AppCtrl',
        resolve: {
            localInfo: ['userFactory', function(userFac) {
                return userFac.getLocalInfo();
            }],
            lang: ['languageFactory', function(lFac) {
                return lFac.lang;
            }],
            loginData: ['userFactory', function(userFac) {
                return userFac.getLoginData();
            }],
            records: ['localRecordFactory', function(recFac) {
                return recFac.getAllRecords();
            }],
            regToastType: ['textManageFactory', function(tmFac) {
                return tmFac.regToastType;
            }],
            loginToastType: ['textManageFactory', function(tmFac) {
                return tmFac.loginToastType;
            }],
            settingToastType: ['textManageFactory', function(tmFac) {
                return tmFac.settingToastType;
            }],
            uploadToastType: ['textManageFactory', function(tmFac) {
                return tmFac.uploadToastType;
            }],
            downloadToastType: ['textManageFactory', function(tmFac) {
                return tmFac.downloadToastType;
            }],
        }
    })
    
    .state('app.home', {
        url: '/home',
        views: {
            'mainContent': {
                templateUrl: 'templates/home.html',
                controller: 'homeController',
                resolve: {
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    records: ['localRecordFactory', function(recFac) {
                        return recFac.getAllRecords();
                    }],
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    formatNumber: ['formatFactory', function(fFac) {
                        return fFac.formatNumber;
                    }]
                }
            }
        }
    })
    
    .state('app.recent', {
        url: '/recent',
        views: {
            'mainContent': {
                templateUrl: 'templates/recent.html',
                controller: 'recentController',
                resolve: {
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    mrRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getMrRecords();
                    }],
                    trRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getTrRecords();
                    }],
                    moneyType: ['textManageFactory', function(tmFac) {
                        return tmFac.moneyType;
                    }],
                    taskType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskType;
                    }],
                    doneType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskDoneType;
                    }],
                    textType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskTextType;
                    }],
                    time: ['formatFactory', function(fFac) {
                        return fFac.time;
                    }],
                    formatNumber: ['formatFactory', function(fFac) {
                        return fFac.formatNumber;
                    }]
                }
            }
        }
    })
    
    .state('app.ma', {
        url: '/ma',
        views: {
            'mainContent': {
                templateUrl: 'templates/corePages/ma.html',
                controller: 'maController',
                resolve: {
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    mRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getMRecords();
                    }],
                    mtRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getMtRecords();
                    }],
                    doMoneyFormAdd: ['recordManageFactory', function(rmFac) {
                        return rmFac.doMoneyFormAdd;
                    }]
                }
            }
        }
    })
    
    .state('app.mat', {
        url: '/mat/:type',
        views: {
            'mainContent': {
                templateUrl: 'templates/corePages/mat.html',
                controller: 'matController',
                resolve: {
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    mtRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getMtRecords();
                    }],
                    time: ['formatFactory', function(fFac) {
                        return fFac.time;
                    }],
                    doDel: ['recordManageFactory', function(rmFac) {
                        return rmFac.doDel;
                    }],
                    type: ['$stateParams', function($param) {
                        return $param.type;
                    }]
                }
            }
        }
    })
    
    .state('app.mata', {
        url: '/mata',
        views: {
            'mainContent': {
                templateUrl: 'templates/corePages/mata.html',
                controller: 'mataController',
                resolve: {
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    mRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getMRecords();
                    }],
                    mtRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getMtRecords();
                    }],
                    doMoneyTemplateAdd: ['recordManageFactory', function(rmFac) {
                        return rmFac.doMoneyTemplateAdd;
                    }]
                }
            }
        }
    })
    
    .state('app.mc', {
        url: '/mc',
        views: {
            'mainContent': {
                templateUrl: 'templates/corePages/mc.html',
                controller: 'mcController',
                resolve: {
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    mRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getMRecords();
                    }],
                    time: ['formatFactory', function(fFac) {
                        return fFac.time;
                    }],
                    doDel: ['recordManageFactory', function(rmFac) {
                        return rmFac.doDel;
                    }]
                }
            }
        }
    })
    
    .state('app.mce', {
        url: '/mc/:id',
        views: {
            'mainContent': {
                templateUrl: 'templates/corePages/mce.html',
                controller: 'mceController',
                resolve: {
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    mRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getMRecords();
                    }],
                    textType: ['textManageFactory', function(tmFac) {
                        return tmFac.moneyTextType;
                    }],
                    modifyToastType: ['textManageFactory', function(tmFac) {
                        return tmFac.modifyToastType;
                    }],
                    meErrMsg: ['textManageFactory', function(tmFac) {
                        return tmFac.meErrMsg;
                    }],
                    id: ['$stateParams', function($param) {
                        return $param.id;
                    }]
                }
            }
        }
    })
    
    .state('app.mt', {
        url: '/mt',
        views: {
            'mainContent': {
                templateUrl: 'templates/corePages/mt.html',
                controller: 'mtController',
                resolve: {
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    mtRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getMtRecords();
                    }],
                    date: ['formatFactory', function(fFac) {
                        return fFac.date;
                    }],
                    time: ['formatFactory', function(fFac) {
                        return fFac.time;
                    }],
                    doDel: ['recordManageFactory', function(rmFac) {
                        return rmFac.doDel;
                    }]
                }
            }
        }
    })
    
    .state('app.mte', {
        url: '/mt/:id',
        views: {
            'mainContent': {
                templateUrl: 'templates/corePages/mte.html',
                controller: 'mteController',
                resolve: {
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    mtRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getMtRecords();
                    }],
                    textType: ['textManageFactory', function(tmFac) {
                        return tmFac.moneyTextType;
                    }],
                    modifyToastType: ['textManageFactory', function(tmFac) {
                        return tmFac.modifyToastType;
                    }],
                    meErrMsg: ['textManageFactory', function(tmFac) {
                        return tmFac.meErrMsg;
                    }],
                    id: ['$stateParams', function($param) {
                        return $param.id;
                    }]
                }
            }
        }
    })
    
    .state('app.mg', {
        url: '/mg',
        views: {
            'mainContent': {
                templateUrl: 'templates/corePages/mg.html',
                controller: 'mgController',
                resolve: {
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    mRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getMRecords();
                    }],
                    time: ['formatFactory', function(fFac) {
                        return fFac.time;
                    }],
                }
            }
        }
    })
    
    .state('app.ta', {
        url: '/ta',
        views: {
            'mainContent': {
                templateUrl: 'templates/corePages/ta.html',
                controller: 'taController',
                resolve: {
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    tRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getTRecords();
                    }],
                    addToastType: ['textManageFactory', function(tmFac) {
                        return tmFac.addToastType;
                    }],
                    teErrMsg: ['textManageFactory', function(tmFac) {
                        return tmFac.teErrMsg;
                    }]
                }
            }
        }
    })
    
    .state('app.tc', {
        url: '/tc',
        views: {
            'mainContent': {
                templateUrl: 'templates/corePages/tc.html',
                controller: 'tcController',
                resolve: {
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    tRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getTRecords();
                    }],
                    taskType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskType;
                    }],
                    doneType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskDoneType;
                    }],
                    textType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskTextType;
                    }],
                    date: ['formatFactory', function(fFac) {
                        return fFac.date;
                    }],
                    time: ['formatFactory', function(fFac) {
                        return fFac.time;
                    }],
                    doDel: ['recordManageFactory', function(rmFac) {
                        return rmFac.doDel;
                    }]
                }
            }
        }
    })
    
    .state('app.tce', {
        url: '/tc/:id',
        views: {
            'mainContent': {
                templateUrl: 'templates/corePages/tce.html',
                controller: 'tceController',
                resolve: {
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    tRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getTRecords();
                    }],
                    tARecords: ['localRecordFactory', function(recFac) {
                        return recFac.getTARecords();
                    }],
                    tPoints: ['localRecordFactory', function(recFac) {
                        return recFac.getPoints();
                    }],
                    injectInfo: ['recordManageFactory', function(rmFac) {
                        return rmFac.injectBasicTRecInfo;
                    }],
                    taskType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskType;
                    }],
                    textType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskTextType;
                    }],
                    doneType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskDoneType;
                    }],
                    doneText: ['textManageFactory', function(tmFac) {
                        return tmFac.taskDoneText;
                    }],
                    archiveType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskArchiveType;
                    }],
                    doDel: ['recordManageFactory', function(rmFac) {
                        return rmFac.doDel;
                    }],
                    modifyToastType: ['textManageFactory', function(tmFac) {
                        return tmFac.modifyToastType;
                    }],
                    tceErrMsg: ['textManageFactory', function(tmFac) {
                        return tmFac.tceErrMsg;
                    }],
                    tceDoneText: ['textManageFactory', function(tmFac) {
                        return tmFac.tceDoneText;
                    }],
                    id: ['$stateParams', function($param) {
                        return $param.id;
                    }]
                }
            }
        }
    })
    
    .state('app.tm', {
        url: '/tm',
        views: {
            'mainContent': {
                templateUrl: 'templates/corePages/tm.html',
                controller: 'tmController',
                resolve: {
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    tRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getTRecords();
                    }],
                    date: ['formatFactory', function(fFac) {
                        return fFac.date;
                    }],
                    time: ['formatFactory', function(fFac) {
                        return fFac.time;
                    }],
                    doDel: ['recordManageFactory', function(rmFac) {
                        return rmFac.doDel;
                    }]
                }
            }
        }
    })
    
    .state('app.tme', {
        url: '/tm/:id',
        views: {
            'mainContent': {
                templateUrl: 'templates/corePages/tme.html',
                controller: 'tmeController',
                resolve: {
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    tRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getTRecords();
                    }],
                    injectInfo: ['recordManageFactory', function(rmFac) {
                        return rmFac.injectBasicTRecInfo;
                    }],
                    modifyToastType: ['textManageFactory', function(tmFac) {
                        return tmFac.modifyToastType;
                    }],
                    id: ['$stateParams', function($param) {
                        return $param.id;
                    }]
                }
            }
        }
    })
    
    .state('app.ts', {
        url: '/ts',
        views: {
            'mainContent': {
                templateUrl: 'templates/corePages/ts.html',
                controller: 'tsController',
                resolve: {
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    tARecords: ['localRecordFactory', function(recFac) {
                        return recFac.getTARecords();
                    }],
                    textType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskTextType;
                    }],
                    date: ['formatFactory', function(fFac) {
                        return fFac.date;
                    }],
                    time: ['formatFactory', function(fFac) {
                        return fFac.time;
                    }],
                    doDel: ['recordManageFactory', function(rmFac) {
                        return rmFac.doDel;
                    }]
                }
            }
        }
    })
    
    .state('app.tsd', {
        url: '/ts/:id',
        views: {
            'mainContent': {
                templateUrl: 'templates/corePages/tsd.html',
                controller: 'tsdController',
                resolve: {
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    tARecords: ['localRecordFactory', function(recFac) {
                        return recFac.getTARecords();
                    }],
                    taskType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskType;
                    }],
                    doneType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskDoneType;
                    }],
                    textType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskTextType;
                    }],
                    date: ['formatFactory', function(fFac) {
                        return fFac.date;
                    }],
                    time: ['formatFactory', function(fFac) {
                        return fFac.time;
                    }],
                    showDateAndTime: ['formatFactory', function(fFac) {
                        return fFac.showDateAndTime;
                    }],
                    id: ['$stateParams', function($param) {
                        return $param.id;
                    }]
                }
            }
        }
    })
    
    ;

    $urlRouterProvider.otherwise('/app/home');
    
});
