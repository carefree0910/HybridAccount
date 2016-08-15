'use strict';

angular.module('Account', ['ionic', 'ui.router','ngDialog', 'chart.js', 'Account.controllers', 'Account.services'])

.run(function($rootScope, $ionicLoading, languageFactory, userFactory) {
    $rootScope.$on("loading:show", function () {
        var lang = languageFactory.lang(userFactory.getLocalInfo().lang);
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> ' + lang.loading.loading + ' ...'
        });
    });
    $rootScope.$on("loading:hide", function () {
        $ionicLoading.hide();
    });
    $rootScope.$on("$stateChangeStart", function () {
        console.log('Loading ...');
        $rootScope.$broadcast("loading:show");
    });
    $rootScope.$on("$stateChangeSuccess", function () {
        console.log('done');
        $rootScope.$broadcast("loading:hide");
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider

    .state('app', {
        url: '/',
        views: {
            'content': {
                templateUrl: 'views/dashboard.html',
                controller: 'dashboardController',
                resolve: {
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    formatNumber: ['formatFactory', function(fFac) {
                        return fFac.formatNumber;
                    }],
                    genTagManager: ['recordManageFactory', function(rmFac) {
                        return rmFac.genTagManager;
                    }],
                    filtOiRecordsWithTags: ['recordManageFactory', function(rmFac) {
                        return rmFac.filtOiRecordsWithTags;
                    }],
                    sumEachTagWithOiRecords: ['recordManageFactory', function(rmFac) {
                        return rmFac.sumEachTagWithOiRecords;
                    }],
                    init_line_data: ['graphManageFactory', function(gFac) {
                        return gFac.init_line_data;
                    }],
                    init_bar_data: ['graphManageFactory', function(gFac) {
                        return gFac.init_bar_data;
                    }]
                }
            },
            'footer': {
                templateUrl: 'views/footer.html',
                controller: 'footerController',
                resolve: {}
            }
        }

    })

    .state('app.user', {
        url: 'user',
        views: {
            'content@': {
                templateUrl: 'views/user.html',
                controller: 'userController',
                resolve: {
                    settingToastType: ['textManageFactory', function(tmFac) {
                        return tmFac.settingToastType;
                    }]
                }
            }
        }
    })

    .state('app.add', {
        url: 'add',
        views: {
            'content@': {
                templateUrl: 'views/add.html',
                controller: 'addController',
                resolve: {
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    genNotification: ['notificationFactory', function (noteFac) {
                        return noteFac.genNotification;
                    }],
                    genTagManager: ['recordManageFactory', function(rmFac) {
                        return rmFac.genTagManager;
                    }],
                    doMoneyFormAdd: ['recordManageFactory', function(rmFac) {
                        return rmFac.doMoneyFormAdd;
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

    .state('app.recent', {
        url: '/recent',
        views: {
            'content@': {
                templateUrl: 'views/recent.html',
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

    .state('app.mc', {
        url: 'mc',
        views: {
            'content@': {
                templateUrl: 'views/mc.html',
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

    .state('app.mt', {
        url: 'mt',
        views: {
            'content@': {
                templateUrl: 'views/mt.html',
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

    .state('app.tc', {
        url: 'tc',
        views: {
            'content@': {
                templateUrl: 'views/tc.html',
                controller: 'tcController',
                resolve: {
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    genNotification: ['notificationFactory', function (noteFac) {
                        return noteFac.genNotification;
                    }],
                    injectInfo: ['recordManageFactory', function(rmFac) {
                        return rmFac.injectBasicTRecInfo;
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
                    tceDoneText: ['textManageFactory', function(tmFac) {
                        return tmFac.tceDoneText;
                    }],
                    archiveType: ['textManageFactory', function(tmFac) {
                        return tmFac.taskArchiveType;
                    }],
                    doDel: ['recordManageFactory', function(rmFac) {
                        return rmFac.doDel;
                    }]
                }
            }
        }
    })

    .state('app.ts', {
        url: '/ts',
        views: {
            'content@': {
                templateUrl: 'views/ts.html',
                controller: 'tsController',
                resolve: {
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
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
                    showDateAndTime: ['formatFactory', function(fFac) {
                        return fFac.showDateAndTime;
                    }],
                    doDel: ['recordManageFactory', function(rmFac) {
                        return rmFac.doDel;
                    }]
                }
            }
        }
    })

    ;

    $urlRouterProvider.otherwise('/');
    
})

;
