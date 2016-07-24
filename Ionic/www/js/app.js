angular.module('Account', ['ionic', 'ngCordova', 'chart.js', 'Account.controllers', 'Account.services'])

.run(function($ionicPlatform, $rootScope, $location, $ionicLoading, $ionicHistory, $cordovaSplashscreen, $cordovaToast, $timeout, languageFactory, userFactory, localRecordFactory) {
    
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

    $rootScope.$on("loading:show", function() {
        var lang = languageFactory.lang(userFactory.getLocalInfo().lang);
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> ' + lang.loading.loading + ' ...'
        });
    });
    $rootScope.$on("loading:hide", function() {
        $ionicLoading.hide();
    });
    $rootScope.$on("$stateChangeStart", function() {
        console.log('Loading ...');
        $rootScope.$broadcast("loading:show");
    });
    $rootScope.$on("$stateChangeSuccess", function() {
        console.log('done');
        $rootScope.$broadcast("loading:hide");
    });
    
    $ionicPlatform.registerBackButtonAction(function(e) {
        
        var lang = languageFactory.lang(userFactory.getLocalInfo().lang);
        
        if ($location.path() == '/app/home') {
            if ($rootScope.backButtonPressedOnceToExit) {
                ionic.Platform.exitApp();
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortCenter(lang.exit.exit);
                setTimeout(function() {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
        } else if ($ionicHistory.backView()) {
            $ionicHistory.goBack();
        } else {
            $rootScope.backButtonPressedOnceToExit = true;
            $cordovaToast.showShortCenter(lang.exit.exit);
            setTimeout(function() {
                $rootScope.backButtonPressedOnceToExit = false;
            }, 2000);
        }
        e.preventDefault();
        return false;
        
    }, 101);
    
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-back');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-ios-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');
    
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
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    getTags: ['recordManageFactory', function(rmFac) {
                        return rmFac.getTags;
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
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    genTagManager: ['recordManageFactory', function(rmFac) {
                        return rmFac.genTagManager;
                    }],
                    doMoneyFormAdd: ['recordManageFactory', function(rmFac) {
                        return rmFac.doMoneyFormAdd;
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
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    checkTagInvolve: ['recordManageFactory', function(rmFac) {
                        return rmFac.checkTagInvolve;
                    }],
                    getTags: ['recordManageFactory', function(rmFac) {
                        return rmFac.getTags;
                    }],
                    full_date: ['formatFactory', function(fFac) {
                        return fFac.full_date;
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
                    genTagManager: ['recordManageFactory', function(rmFac) {
                        return rmFac.genTagManager;
                    }],
                    mRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getMRecords();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
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
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    checkTagInvolve: ['recordManageFactory', function(rmFac) {
                        return rmFac.checkTagInvolve;
                    }],
                    getTags: ['recordManageFactory', function(rmFac) {
                        return rmFac.getTags;
                    }],
                    doDel: ['recordManageFactory', function(rmFac) {
                        return rmFac.doDel;
                    }],
                    type: function() { return "all"; }
                }
            }
        }
    })
    
    .state('app.mtp', {
        url: '/mtp/:type',
        views: {
            'mainContent': {
                templateUrl: 'templates/corePages/mt.html',
                controller: 'mtController',
                resolve: {
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    checkTagInvolve: ['recordManageFactory', function(rmFac) {
                        return rmFac.checkTagInvolve;
                    }],
                    getTags: ['recordManageFactory', function(rmFac) {
                        return rmFac.getTags;
                    }],
                    full_date: ['formatFactory', function(fFac) {
                        return fFac.full_date;
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
                    genTagManager: ['recordManageFactory', function(rmFac) {
                        return rmFac.genTagManager;
                    }],
                    mtRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getMtRecords();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
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
    
    .state('app.mtd', {
        url: '/mtd',
        views: {
            'mainContent': {
                templateUrl: 'templates/corePages/mtd.html',
                controller: 'mtdController',
                resolve: {
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    genTagManager: ['recordManageFactory', function(rmFac) {
                        return rmFac.genTagManager;
                    }],
                    doMoneyTemplateAdd: ['recordManageFactory', function(rmFac) {
                        return rmFac.doMoneyTemplateAdd;
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
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    genTagManager: ['recordManageFactory', function(rmFac) {
                        return rmFac.genTagManager;
                    }],
                    filtOiRecordsWithTags: ['recordManageFactory', function(rmFac) {
                        return rmFac.filtOiRecordsWithTags;
                    }],
                    init_data: ['graphManageFactory', function(gFac) {
                        return gFac.init_data;
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
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
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
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    doneType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskDoneType;
                    }],
                    textType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskTextType;
                    }],
                    full_date: ['formatFactory', function(fFac) {
                        return fFac.full_date;
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
                    tRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getTRecords();
                    }],
                    tARecords: ['localRecordFactory', function(recFac) {
                        return recFac.getTARecords();
                    }],
                    tPoints: ['localRecordFactory', function(recFac) {
                        return recFac.getPoints();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
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
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    full_date: ['formatFactory', function(fFac) {
                        return fFac.full_date;
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
                    tRecords: ['localRecordFactory', function(recFac) {
                        return recFac.getTRecords();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
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
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    doneType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskDoneType;
                    }],
                    textType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskTextType;
                    }],
                    full_date: ['formatFactory', function(fFac) {
                        return fFac.full_date;
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
                    tARecords: ['localRecordFactory', function(recFac) {
                        return recFac.getTARecords();
                    }],
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
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
