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
            loginData: ['userFactory', function(userFac) {
                return userFac.getLoginData();
            }],
            mRecords: ['localRecordFactory', function(recFac) {
                return recFac.getMRecords();
            }],
            tRecords: ['localRecordFactory', function(recFac) {
                return recFac.getTRecords();
            }],
            tARecords: ['localRecordFactory', function(recFac) {
                return recFac.getTARecords();
            }],
            tPoints: ['localRecordFactory', function(recFac) {
                return recFac.getPoints();
            }]
        }
    })
    
    .state('app.home', {
        url: '/home',
        views: {
            'mainContent': {
                templateUrl: 'templates/home.html',
                controller: 'IndexController',
                resolve: {
                    mRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getMRecords();
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
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
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
                    forms: ['formFactory', function(formFac) {
                        return formFac.forms[0];
                    }],
                    mRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getMRecords();
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
                    mRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getMRecords();
                    }],
                    textType: ['textManageFactory', function(tmFac) {
                        return tmFac.moneyTextType;
                    }],
                    id: ['$stateParams', function($param) {
                        return $param.id;
                    }]
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
                    forms: ['formFactory', function(formFac) {
                        return formFac.forms[1];
                    }],
                    tRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getTRecords();
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
                    tRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getTRecords();
                    }],
                    tARecords: ['localRecordFactory', function(recFac) {
                        return recFac.getTARecords();
                    }],
                    tPoints: ['localRecordFactory', function(recFac) {
                        return recFac.getPoints();
                    }],
                    doDel: ['recordManageFactory', function(rmFac) {
                        return rmFac.doDel;
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
