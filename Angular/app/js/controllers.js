angular.module('Account.controllers', [])

.controller('sidebarController', function($rootScope, $scope, $state) {
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    $scope.goto = function(state) {
        if (state === "dashboard") {

        } else if (state === "user") {

        } else if (state === "add") {

        } else if (state === "recent") {
            
        }
    }
})

.controller('headerController', function($rootScope, $state, $scope, ngDialog, $localStorage, authFactory, dataFactory, textManageFactory, localRecordFactory, cloudRecordFactory, notificationFactory) {

    $scope.headerData = dataFactory.headerData;
    $scope.title = function () {
        if ($state.is("app"))
            return "Dashboard";
        if ($state.is("app.user"))
            return "Profile";
        if ($state.is("app.add"))
            return "Add";
        if ($state.is("app.mc"))
            return "Check Financial Records";
        if ($state.is("app.mt"))
            return "Check Templates";
        if ($state.is("app.tc"))
            return "Check On-going Events";
        if ($state.is("app.ts"))
            return "Check Archived Events";
        if ($state.is("app.recent"))
            return "Today's Account";
    };

    if (authFactory.isAuthenticated()) {
        $scope.headerData.loggedIn = true;
        $scope.headerData.username = authFactory.getUsername();
    }

    $scope.openLogin = function() {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"loginController" });
    };
    $scope.logOut = function() {
       authFactory.logout();
        $scope.headerData.loggedIn = false;
        $scope.headerData.username = "";
    };

    $rootScope.$on('login:Successful', function() {
        $scope.headerData.loggedIn = authFactory.isAuthenticated();
        $scope.headerData.username = authFactory.getUsername();
        notificationFactory.genNotification("pe-7s-check", "success", textManageFactory.regToastType("success"));
    });
    $rootScope.$on('registration:Successful', function() {
        $scope.headerData.loggedIn = authFactory.isAuthenticated();
        $scope.headerData.username = authFactory.getUsername();
        notificationFactory.genNotification("pe-7s-check", "success", textManageFactory.loginToastType("success"));
    });

    $scope.goto = function(state) {
        if (state === "mc") {

        } else if (state === "mt") {

        } else if (state === "tc") {

        }
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
        var records = localRecordFactory.getAllRecords();
        cloudRecordFactory.upload_allRec(records);
    };
    var download_records = function() {
        var records = localRecordFactory.getAllRecords();
        $resource(baseURL + "records/all").get(function(res) {
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
        if (!authFactory.isAuthenticated())
            notificationFactory.genNotification("pe-7s-attention", "danger", "Please log in first!");
        else {
            upload_info();
            upload_records();
            notificationFactory.genNotification("pe-7s-check", "success", textManageFactory.uploadToastType("success"));
        }
    };
    $scope.download = function() {
        if (!authFactory.isAuthenticated())
            notificationFactory.genNotification("pe-7s-attention", "danger", "Please log in first!");
        else {
            download_info();
            download_records();
            notificationFactory.genNotification("pe-7s-check", "success", textManageFactory.downloadToastType("success"));
        }
    };

})

.controller('footerController', function() {

})

.controller('loginController', function($scope, ngDialog, $localStorage, userFactory, localRecordFactory, authFactory) {
    $scope.loginData = {};
    $scope.doLogin = function() {
        authFactory.login($scope.loginData);
        ngDialog.close();
    };     
    $scope.openRegister = function() {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"registerController" });
    };
})

.controller('registerController', function($scope, ngDialog, $localStorage, authFactory) {
    $scope.registration = {};
    $scope.doRegister = function() {
        authFactory.register($scope.registration);
        ngDialog.close();
    };
})

.controller('dashboardController', function($rootScope, $scope, $timeout, localRecordFactory, userFactory, formatNumber, genTagManager, filtOiRecordsWithTags, sumEachTagWithOiRecords, init_line_data, init_bar_data, lang) {

    var refresh = function() {
        $scope.records = localRecordFactory.getAllRecords();
        $scope.localInfo = userFactory.getLocalInfo();
    };

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


    $scope.dt = {};
    $scope.dt.tab = 1;
    $scope.dt.type = "line";
    $scope.dt.tagManager = genTagManager([]);
    $scope.dt.onClick = function(type) {
        var id = $scope.dt.tagManager.selectedTagId;
        if (!isNaN(id)) {
            if (type === "add")
                $scope.dt.tagManager.addCurrentTagById(id);
            else
                $scope.dt.tagManager.delAllTagById(id);
        }
    };

    $scope.dt.dLabelShow = true;
    $scope.dt.wLabelShow = true;
    $scope.dt.mLabelShow = true;
    $scope.dt.yLabelShow = true;

    $scope.dt.dCanvasShow = true;
    $scope.dt.wCanvasShow = true;
    $scope.dt.mCanvasShow = true;
    $scope.dt.yCanvasShow = true;

    $scope.dt.lineOptions = {
        legend: {
            display: true
        }
    };
    $scope.dt.barOptions = function(amount) {
        var percentage;
        if (amount <= 6)
            percentage = 2 * amount / 15;
        else
            percentage = 0.8;
        return {
            scales: {
                yAxes: [{
                    categoryPercentage: percentage
                }]
            }
        };
    };

    $scope.dt.setDisplayStatusOfLine = function() {
        $scope.dt.dLabelShow = true;
        $scope.dt.wLabelShow = true;
        $scope.dt.mLabelShow = true;
        $scope.dt.yLabelShow = true;

        $scope.dt.dCanvasShow = true;
        $scope.dt.wCanvasShow = true;
        $scope.dt.mCanvasShow = true;
        $scope.dt.yCanvasShow = true;
    };
    $scope.dt.setDisplayStatusOfBar = function() {
        $scope.dt.dLabelShow = true;
        $scope.dt.wLabelShow = false;
        $scope.dt.mLabelShow = false;
        $scope.dt.yLabelShow = false;

        $scope.dt.dCanvasShow = true;
        $scope.dt.wCanvasShow = true;
        $scope.dt.mCanvasShow = false;
        $scope.dt.yCanvasShow = false;
    };

    $scope.dt.draw_line_sep = function() {
        var mr = localRecordFactory.getMrRecords($scope.dt.date);

        filtOiRecordsWithTags(mr.mrd, $scope.dt.tagManager.current_tags);
        filtOiRecordsWithTags(mr.mrw, $scope.dt.tagManager.current_tags);
        filtOiRecordsWithTags(mr.mrm, $scope.dt.tagManager.current_tags);
        filtOiRecordsWithTags(mr.mry, $scope.dt.tagManager.current_tags);

        var dData = init_line_data(mr.mrd.o, mr.mrd.i, "day");
        var wData = init_line_data(mr.mrw.o, mr.mrw.i, "week");
        var mData = init_line_data(mr.mrm.o, mr.mrm.i, "month");
        var yData = init_line_data(mr.mry.o, mr.mry.i, "year");

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
            options: $scope.dt.lineOptions
        });
        var week = new Chart(new_wctx, {
            type: 'line',
            data: wData,
            options: $scope.dt.lineOptions
        });
        var month = new Chart(new_mctx, {
            type: 'line',
            data: mData,
            options: $scope.dt.lineOptions
        });
        var year = new Chart(new_yctx, {
            type: 'line',
            data: yData,
            options: $scope.dt.lineOptions
        });
    };
    $scope.dt.draw_line_sum = function() {
        var moi = localRecordFactory.getMoiRecords();
        filtOiRecordsWithTags(moi, $scope.dt.tagManager.current_tags);

        var dData = init_line_data(moi.o, moi.i, "day");
        var wData = init_line_data(moi.o, moi.i, "week");
        var mData = init_line_data(moi.o, moi.i, "month");
        var yData = init_line_data(moi.o, moi.i, "year");

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
            options: $scope.dt.lineOptions
        });
        var week = new Chart(new_wctx, {
            type: 'line',
            data: wData,
            options: $scope.dt.lineOptions
        });
        var month = new Chart(new_mctx, {
            type: 'line',
            data: mData,
            options: $scope.dt.lineOptions
        });
        var year = new Chart(new_yctx, {
            type: 'line',
            data: yData,
            options: $scope.dt.lineOptions
        });
    };

    $scope.dt.draw_bar_sep = function() {
        var currentTags = $scope.dt.tagManager.current_tags;
        var mrd = localRecordFactory.getMrRecords($scope.dt.date).mrd;

        if (currentTags.length === 0)
            currentTags = $scope.dt.tagManager.tags;

        var rs = sumEachTagWithOiRecords(mrd, currentTags);
        var oData = init_bar_data(rs.o, currentTags, "output");
        var iData = init_bar_data(rs.i, currentTags, "income");

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

        var oGraph = new Chart(new_dctx, {
            type: 'horizontalBar',
            data: oData,
            options: $scope.dt.barOptions(currentTags.length)
        });
        var iGraph = new Chart(new_wctx, {
            type: 'horizontalBar',
            data: iData,
            options: $scope.dt.barOptions(currentTags.length)
        });
    };
    $scope.dt.draw_bar_sum = function() {
        var currentTags = $scope.dt.tagManager.current_tags;
        var moi = localRecordFactory.getMoiRecords();

        if (currentTags.length === 0)
            currentTags = $scope.dt.tagManager.tags;

        var rs = sumEachTagWithOiRecords(moi, currentTags);
        var oData = init_bar_data(rs.o, currentTags, "output");
        var iData = init_bar_data(rs.i, currentTags, "income");

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

        var oGraph = new Chart(new_dctx, {
            type: 'horizontalBar',
            data: oData,
            options: $scope.dt.barOptions(currentTags.length)
        });
        var iGraph = new Chart(new_wctx, {
            type: 'horizontalBar',
            data: iData,
            options: $scope.dt.barOptions(currentTags.length)
        });
    };

    $scope.dt.refresh_sep = function() {
        $rootScope.$broadcast("loading:show");

        if ($scope.dt.type === "line")
            $scope.dt.setDisplayStatusOfLine();
        else if ($scope.dt.type === "bar")
            $scope.dt.setDisplayStatusOfBar();
        else
            console.log("Error. No implementation for " + $scope.dt.type + " in mg_sep");

        $timeout(function() {
            $scope.localInfo = userFactory.getLocalInfo();

            if ($scope.dt.type === "line")
                $scope.dt.draw_line_sep();
            else if ($scope.dt.type === "bar")
                $scope.dt.draw_bar_sep();
            else
                console.log("Error. No implementation for " + $scope.dt.type + " in mg_sep");

            $rootScope.$broadcast("loading:hide");
        }, 500);
    };
    $scope.dt.refresh_sum = function() {
        $rootScope.$broadcast("loading:show");

        if ($scope.dt.type === "line")
            $scope.dt.setDisplayStatusOfLine();
        else if ($scope.dt.type === "bar")
            $scope.dt.setDisplayStatusOfBar();
        else
            console.log("Error. No implementation for " + $scope.dt.type + " in mg_sep");

        $timeout(function() {
            $scope.localInfo = userFactory.getLocalInfo();

            if ($scope.dt.type === "line")
                $scope.dt.draw_line_sum();
            else if ($scope.dt.type === "bar")
                $scope.dt.draw_bar_sum();
            else
                console.log("Error. No implementation for " + $scope.dt.type + " in mg_sum");

            $rootScope.$broadcast("loading:hide");
        }, 500);
    };
    $scope.dt.refresh = function(refreshDate, refreshTagManager) {
        if (refreshDate)
            $scope.dt.date = new Date();

        if ($scope.dt.tab != 2)
            $scope.dt.refresh_sep();
        else
            $scope.dt.refresh_sum();

        if (refreshTagManager)
            $scope.dt.tagManager = genTagManager([]);
    };

    $scope.select = function(setTab) {
        $scope.dt.tab = setTab;
        $scope.dt.refresh(false, false);
    };
    $scope.isSelected = function(checkTab) {
        return (checkTab === $scope.dt.tab);
    };
    
    $scope.showLatestMemoPlaceholder = function(records) {
        var rs = true;
        
        for (var i = records.length - 1; i >= 0; i--) {
            if (records[i].type === "memo") {
                rs = false; break;
            }
        }
        
        return rs;
    };

    refresh();
    $scope.dt.refresh(true, true);

})

.controller('userController', function($scope, settingToastType, $localStorage, authFactory, userFactory, localRecordFactory, notificationFactory) {
    var refresh = function() {
        $scope.tmpInfo = {};
        $scope.localInfo = userFactory.getLocalInfo();

        $scope.tmpInfo.lang = $scope.localInfo.lang;
        $scope.tmpInfo.avatar = $scope.localInfo.avatar;
        $scope.tmpInfo.username = $scope.localInfo.username;
        $scope.tmpInfo.firstName = $scope.localInfo.firstName;
        $scope.tmpInfo.lastName = $scope.localInfo.lastName;
        $scope.tmpInfo.description = $scope.localInfo.description;
    };

    refresh();

    $scope.getAvatar = function() {
        if ($scope.tmpInfo.avatar)
            return $scope.tmpInfo.avatar;
        return "img/default-avatar.jpg";
    };
    $scope.changeAvatar = function() {
        alert("Going to introduce picture upload here... However not so willing to introduce it now, in fact not so willing to introduce those functionalities which need server side support, since my Bluemix is in a mess...")
    };

    $scope.doSetting = function() {
        $scope.localInfo.lang = $scope.tmpInfo.lang;
        $scope.localInfo.avatar = $scope.tmpInfo.avatar;
        $scope.localInfo.username = $scope.tmpInfo.username;
        $scope.localInfo.firstName = $scope.tmpInfo.firstName;
        $scope.localInfo.lastName = $scope.tmpInfo.lastName;
        $scope.localInfo.description = $scope.tmpInfo.description;
        $localStorage.storeObject('localInfo', $scope.localInfo);
        
        notificationFactory.genNotification("pe-7s-check", "success", settingToastType("success"));
    };
})

.controller('addController', function($state, $scope, localRecordFactory, cloudRecordFactory, userFactory, formFactory, genNotification, genTagManager, doMoneyFormAdd, addToastType, teErrMsg, lang) {
    var refresh = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        $scope.tagManager = genTagManager([]);

        $scope.mRecords = localRecordFactory.getMRecords();
        $scope.mtRecords = localRecordFactory.getMtRecords();
        $scope.mForms = formFactory.getMForms($scope.localInfo.lang);

        $scope.tRecords = localRecordFactory.getTRecords();
        $scope.tForms = formFactory.getTForms($scope.localInfo.lang);
    };

    refresh();

    $scope.lang = lang;

    $scope.mTab = 1;
    $scope.tTab = 1;

    $scope.mFiltText = "output";
    $scope.tFiltText = "task";

    $scope.mSelect = function(setTab) {
        $scope.mTab = setTab;
        if (setTab === 1)
            $scope.mFiltText = "output";
        else if (setTab === 2)
            $scope.mFiltText = "income";
        else
            console.log("Error: No implementation in maController of tab: ", setTab);
    };
    $scope.tSelect = function(setTab) {
        $scope.tTab = setTab;
        if (setTab === 1)
            $scope.tFiltText = "task";
        else if (setTab === 2)
            $scope.tFiltText = "desire";
        else if (setTab === 3)
            $scope.tFiltText = "memo";
        else
            console.log("Error: No implementation in taController of tab: ", setTab);
    };

    $scope.isMSelected = function(checkTab) {
        return (checkTab === $scope.mTab);
    };
    $scope.isTSelected = function(checkTab) {
        return (checkTab === $scope.tTab);
    };

    $scope.doMAdd = function(type) {
        doMoneyFormAdd(type, $scope.mForms, $scope.mRecords, "record", function(info) {
            info.sum = info.amount * info.unit_price;
            for (var i = $scope.tagManager.current_tags.length - 1; i >= 0; i--) {
                $scope.tagManager.current_tags[i].id = info.tags.length;
                info.tags.push($scope.tagManager.current_tags[i]);
            }
            $scope.mRecords.push(info);

            for (var i = $scope.tagManager.current_tags.length - 1; i >= 0; i--) {
                var curTag = $scope.tagManager.current_tags[i];
                var involve = false;
                for (var j = $scope.tagManager.tags.length - 1; j >= 0; j--) {
                    if ($scope.tagManager.tags[j].body === curTag.body) {
                        involve = true; break;
                    }
                }
                if (!involve) {
                    var tmpTag = {};
                    tmpTag.id = $scope.tagManager.tags.length;
                    tmpTag.body = curTag.body;
                    $scope.tagManager.tags.push(tmpTag);
                }
            }
            $scope.tagManager.current_tag = {};
            $scope.tagManager.current_tags = [];

            localRecordFactory.updateMRecords($scope.mRecords);
            localRecordFactory.updateTags($scope.tagManager.tags);
        });
    };
    $scope.doTAdd = function(type) {
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
            info.event = $scope.tForms[form_idx].contents[0].body;
            info.points = parseFloat($scope.tForms[form_idx].contents[1].body);
            if (isNaN(info.points)) {
                err_flag = true;
                err_msg = teErrMsg("points");
            }
        } else {
            info.event = $scope.tForms[2].contents[0].body;
        }

        if (!err_flag) {
            $scope.tRecords.push(info);
            localRecordFactory.updateTRecords($scope.tRecords);
            if (type === "memo")
                $scope.tForms[2].contents[0].body = "";

            genNotification("pe-7s-check", "success", addToastType("success"));
        } else {
            genNotification("pe-7s-attention", "danger", addToastType("failed") + err_msg);
        }
    };

    $scope.onClick = function(type) {
        var id = $scope.tagManager.selectedTagId;
        if (!isNaN(id)) {
            if (type === "add")
                $scope.tagManager.addCurrentTagById(id);
            else
                $scope.tagManager.delAllTagById(id);
        }
    };
    $scope.saveTemplate = function(type) {
        doMoneyFormAdd(type, $scope.mForms, $scope.mtRecords, "save", function(info) {
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

.controller('recentController', function($filter, $rootScope, $scope, localRecordFactory, userFactory, getTags, moneyType, taskType, doneType, textType, time, formatNumber, lang) {

    var refresh = function() {
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
    };

    refresh();

    $scope.tab = 1;
    $scope.filtText = "money";

    $scope.lang = lang;

    $scope.moneyType = moneyType;
    $scope.taskType = taskType;
    $scope.doneType = doneType;
    $scope.textType = textType;

    $scope.time = time;

    $scope.select = function(setTab) {
        $scope.tab = setTab;
        if (setTab === 1)
            $scope.filtText = "money";
        else if (setTab === 2)
            $scope.filtText = "task";
        else
            console.log("Error: No implementation in recentController of tab: ", setTab);
    };
    $scope.isSelected = function(checkTab) {
        return (checkTab === $scope.tab);
    };

    $scope.mType = function(type) {
        if (type === "output")
            return "Expenditure";
        return "Income";
    };
    $scope.tType = function(type) {
        if (type === "task")
            return "Task";
        return "Desire";
    };

    $scope.badge_class = function(type) {
        if (type != "desire")
            return "t-short-task-badge";
        return "t-short-desire-badge";
    };
    $scope.transformDoneTime = function(done_time) {
        var date = new Date();
        date.setTime(done_time);
        return $scope.time(date);
    }

})

.controller('mcController', function($rootScope, $scope, $filter, ngDialog, localRecordFactory, cloudRecordFactory, userFactory, checkTagInvolve, getTags, full_date, time, doDel, lang) {

    $scope.dt = {};
    $scope.dt.rs = [];
    $scope.dt.tab = 1;
    $scope.dt.date = new Date();
    $scope.dt.tag = {};
    $scope.dt.getTags = getTags;
    $scope.dt.type = "all";
    $scope.dt.description = "";

    $scope.dt.select = function(setTab) {
        $scope.dt.tab = setTab;
        if (setTab === 1)
            $scope.dt.doFocusFilter();
        else if (setTab === 2)
            $scope.dt.doAllFilter();
        else
            console.log("Error: No implementation in mcController of tab: ", setTab);
    };
    $scope.dt.isSelected = function(checkTab) {
        return (checkTab === $scope.dt.tab);
    };

    $scope.dt.doFocusFilter = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        var mrd = localRecordFactory.getDateRecords($scope.dt.date);

        $scope.dt.rs.length = 0;
        for (var i = mrd.length - 1; i >= 0; i--) {
            if (mrd[i].event.indexOf($scope.dt.description) >= 0 && (!$scope.dt.tag.body || checkTagInvolve($scope.dt.tag, mrd[i].tags)))
                $scope.dt.rs.push(mrd[i]);
        }

        $scope.dt.filtText = "focus";
    };
    $scope.dt.doAllFilter = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        var mr = localRecordFactory.getMRecords();

        $scope.dt.rs.length = 0;
        for (var i = mr.length - 1; i >= 0; i--) {
            if (mr[i].event.indexOf($scope.dt.description) >= 0 && (!$scope.dt.tag.body || checkTagInvolve($scope.dt.tag, mr[i].tags)))
                $scope.dt.rs.push(mr[i]);
        }

        $scope.dt.filtText = "all";
    };
    $scope.dt.doFilter = function() {
        if ($scope.dt.filtText != "all")
            $scope.dt.doFocusFilter();
        else
            $scope.dt.doAllFilter();
    };
    $scope.dt.refresh = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        $scope.dt.doFilter();
    };

    $scope.dt.showPlaceholder = function(type, records) {
        if (type === "all")
            return records.length === 0;
        var rs = true;
        for (var i = records.length - 1; i >= 0; i--) {
            if (records[i].type === type) {
                rs = false;
                break;
            }
        }
        return rs;
    };

    $scope.dt.refresh();
    $scope.$on('refresh:/app/mc', $scope.dt.refresh);

    $scope.lang = lang;

    $scope.full_date = full_date;
    $scope.time = time;

    $scope.onMce = function(id) {
        $rootScope.onMceId = id;
        ngDialog.open({ template: 'views/mce.html', scope: $scope, className: 'ngdialog-theme-default', controller:"mceController" });
    };
    $scope.doDel = function(id) {
        doDel("money", "", id, "delete", function() {
            $scope.dt.refresh();
        });
    };

})

.controller('mceController', function($rootScope, $scope, ngDialog, userFactory, recordManageFactory, localRecordFactory, notificationFactory, languageFactory, textManageFactory) {
    var localInfo = userFactory.getLocalInfo();
    var genTagManager = recordManageFactory.genTagManager;
    var mRecords = localRecordFactory.getMRecords();
    var lang = languageFactory.lang;
    var textType = textManageFactory.moneyTextType;
    var modifyToastType = textManageFactory.modifyToastType;
    var meErrMsg = textManageFactory.meErrMsg;
    var id = $rootScope.onMceId;

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
        var id = $scope.tagManager.selectedTagId;
        if (!isNaN(id)) {
            if (type === "add")
                $scope.tagManager.addCurrentTagById(id);
            else if ($scope.tagManager.selectedTag)
                $scope.tagManager.delAllTagById(id);
        }
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
                var recTag = $scope.record.tags[i];
                var involve = false;
                for (var j = $scope.tagManager.tags.length - 1; j >= 0; j--) {
                    if ($scope.tagManager.tags[j].body === recTag.body) {
                        involve = true; break;
                    }
                }
                if (!involve) {
                    var tmpTag = {};
                    tmpTag.id = $scope.tagManager.tags.length;
                    tmpTag.body = recTag.body;
                    $scope.tagManager.tags.push(tmpTag);
                }
            }

            localRecordFactory.updateTags($scope.tagManager.tags);
            localRecordFactory.editFromMRec(id, $scope.record);
        }

        $rootScope.$broadcast("refresh:/app/mc");
        ngDialog.close();

        if (!err_flag)
            notificationFactory.genNotification("pe-7s-check", "success", modifyToastType("success"));
        else
            notificationFactory.genNotification("pe-7s-attention", "danger", modifyToastType("failed") + err_msg);
    };
})

.controller('mtController', function($rootScope, $scope, $filter, ngDialog, localRecordFactory, cloudRecordFactory, userFactory, checkTagInvolve, getTags, doDel, lang, type) {

    $scope.dt = {};
    $scope.dt.rs = [];
    $scope.dt.tag = {};
    $scope.dt.getTags = getTags;
    $scope.dt.type = type;
    $scope.dt.description = "";
    $scope.dt.doFilter = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        var mt = localRecordFactory.getMtRecords();

        $scope.dt.rs.length = 0;
        for (var i = mt.length - 1; i >= 0; i--) {
            if (mt[i].event.indexOf($scope.dt.description) >= 0 && (!$scope.dt.tag.body || checkTagInvolve($scope.dt.tag, mt[i].tags)))
                $scope.dt.rs.push(mt[i]);
        }
    };
    $scope.dt.refresh = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        $scope.dt.doFilter();
    };

    $scope.dt.showPlaceholder = function(type, records) {
        if (type === "all")
            return records.length === 0;
        var rs = true;
        for (var i = records.length - 1; i >= 0; i--) {
            if (records[i].type === type) {
                rs = false;
                break;
            }
        }
        return rs;
    };

    $scope.dt.refresh();
    $scope.$on('refresh:/app/mt', $scope.dt.refresh);

    $scope.lang = lang;

    $scope.onMte = function(id) {
        $rootScope.onMteId = id;
        ngDialog.open({ template: 'views/mte.html', scope: $scope, className: 'ngdialog-theme-default', controller:"mteController" });
    };
    $scope.doDel = function(id) {
        doDel("templates", "", id, "delete", function() {
            $scope.dt.refresh();
        });
    };

})

.controller('mteController', function($rootScope, $scope, ngDialog, userFactory, recordManageFactory, localRecordFactory, languageFactory, textManageFactory, notificationFactory) {

    var localInfo = userFactory.getLocalInfo();
    var genTagManager = recordManageFactory.genTagManager;
    var mtRecords = localRecordFactory.getMtRecords();
    var lang = languageFactory.lang;
    var textType = textManageFactory.moneyTextType;
    var modifyToastType = textManageFactory.modifyToastType;
    var meErrMsg = textManageFactory.meErrMsg;
    var id = $rootScope.onMteId;

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
        var id = $scope.tagManager.selectedTagId;
        if (!isNaN(id)) {
            if (type === "add")
                $scope.tagManager.addCurrentTagById(id);
            else if ($scope.tagManager.selectedTag)
                $scope.tagManager.delAllTagById(id);
        }
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

        $rootScope.$broadcast("refresh:/app/mt");
        ngDialog.close();

        if (!err_flag)
            notificationFactory.genNotification("pe-7s-check", "success", modifyToastType("success"));
        else
            notificationFactory.genNotification("pe-7s-attention", "danger", modifyToastType("failed") + err_msg);
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

        ngDialog.open({ template: 'views/mtd.html', scope: $scope, className: 'ngdialog-theme-default', controller:"mtdController" });
    };

})

.controller('mtdController', function($rootScope, $scope, ngDialog, languageFactory, recordManageFactory, userFactory, localRecordFactory, notificationFactory) {

    var lang = languageFactory.lang;
    var genTagManager = recordManageFactory.genTagManager;
    var doMoneyTemplateAdd = recordManageFactory.doMoneyTemplateAdd;

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

    refresh();

    $scope.lang = lang;

    $scope.onClick = function(type) {
        var id = $scope.tagManager.selectedTagId;
        if (!isNaN(id)) {
            if (type === "add")
                $scope.tagManager.addCurrentTagById(id);
            else if ($scope.tagManager.selectedTag)
                $scope.tagManager.delAllTagById(id);
        }
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
                var curTag = $scope.tagManager.current_tags[i];
                var involve = false;
                for (var j = $scope.tagManager.tags.length - 1; j >= 0; j--) {
                    if ($scope.tagManager.tags[j].body === curTag.body) {
                        involve = true; break;
                    }
                }
                if (!involve) {
                    var tmpTag = {};
                    tmpTag.id = $scope.tagManager.tags.length;
                    tmpTag.body = curTag.body;
                    $scope.tagManager.tags.push(tmpTag);
                }
            }

            localRecordFactory.updateTags($scope.tagManager.tags);
            localRecordFactory.updateMRecords($scope.mRecords);

            ngDialog.close();
        });
    };

})

.controller('tcController', function($rootScope, $scope, ngDialog, localRecordFactory, userFactory, genNotification, injectInfo, doneType, textType, full_date, time, tceDoneText, doDel, lang) {

    var refresh = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        $scope.tRecords = localRecordFactory.getTRecords();
    };

    refresh();
    $scope.$on('refresh:/app/tc', refresh);

    $scope.lang = lang;

    $scope.doneType = doneType;
    $scope.textType = textType;

    $scope.full_date = full_date;
    $scope.time = time;

    $scope.badge_class = function(type) {
        if (type != "desire")
            return "t-short-task-badge";
        return "t-short-desire-badge";
    };
    $scope.check_class = function(type) {
        if (type != "desire")
            return "achieve-task";
        return "achieve-desire";
    };

    $scope.doDel = function(id) {
        doDel("task", "memo", id, "delete", function() {});
    };
    $scope.onTce = function(id) {
        $rootScope.onTceId = id;
        ngDialog.open({ template: 'views/tce.html', scope: $scope, className: 'ngdialog-theme-default', controller:"tceController" });
    };
    $scope.onTme = function(id) {
        $rootScope.onTmeId = id;
        ngDialog.open({ template: 'views/tme.html', scope: $scope, className: 'ngdialog-theme-default', controller:"tmeController" });
    };
    $scope.finishDone = function(type, id) {
        var tPoints = localRecordFactory.getPoints();
        var rec = localRecordFactory.getTRecords()[id];
        var record = {};
        var notification_type = "success";
        injectInfo(rec, record);

        if (type === "task")
            tPoints += rec.points;
        else {
            tPoints -= rec.points;
            notification_type = "danger";
        }

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
        
        genNotification("pe-7s-check", notification_type, tceDoneText(record.type) + record.points + " !");
    };
    $scope.finishArchive = function(id) {
        var rec = localRecordFactory.getTRecords()[id];
        var tARecords = localRecordFactory.getTARecords();
        rec.date = new Date();
        rec.milli = rec.date.getTime();
        doDel("task", rec.type, rec.id, "archive", function() {
            rec.id = tARecords.length;
            tARecords.push(rec);
            localRecordFactory.updateTARecords(tARecords);
        });
    };

    $scope.showPlaceholder = function(type) {
        var rs = true;
        if (type === "memo") {
            for (var i = $scope.tRecords.length - 1; i >= 0; i--) {
                if ($scope.tRecords[i].type === type) {
                    rs = false;
                    break;
                }
            }
        } else {
            for (var i = $scope.tRecords.length - 1; i >= 0; i--) {
                if ($scope.tRecords[i].type != "memo") {
                    rs = false;
                    break;
                }
            }
        }
        return rs;
    };

})

.controller('tceController', function($rootScope, $scope, ngDialog, userFactory, localRecordFactory, languageFactory, recordManageFactory, textManageFactory, notificationFactory) {

    var localInfo = userFactory.getLocalInfo();
    var lang = languageFactory.lang;
    var injectInfo = recordManageFactory.injectBasicTRecInfo;
    var textType = textManageFactory.taskTextType;
    var doneType = textManageFactory.taskDoneType;
    var modifyToastType = textManageFactory.modifyToastType;
    var tceErrMsg = textManageFactory.tceErrMsg;
    var id = $rootScope.onTceId;

    $scope.lang = lang;
    $scope.localInfo = localInfo;

    $scope.record = {};
    var rec = localRecordFactory.getTRecords()[id];
    injectInfo(rec, $scope.record);

    $scope.textType = textType;
    $scope.doneType = doneType;

    $scope.finishEdit = function() {
        var err_flag = false, err_msg = "";
        var tPoints = localRecordFactory.getPoints();

        var one;
        if ($scope.record.type === "task")
            one = 1;
        else
            one = -1;

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

        $rootScope.$broadcast("refresh:/app/tc");
        ngDialog.close();

        if (!err_flag)
            notificationFactory.genNotification("pe-7s-check", "success", modifyToastType("success"));
        else
            notificationFactory.genNotification("pe-7s-attention", "danger", modifyToastType("failed") + err_msg);
    };

})

.controller('tmeController', function($rootScope, $scope, ngDialog, userFactory, localRecordFactory, languageFactory, recordManageFactory, textManageFactory, notificationFactory) {

    var localInfo = userFactory.getLocalInfo();
    var tRecords = localRecordFactory.getTRecords();
    var lang = languageFactory.lang;
    var injectInfo = recordManageFactory.injectBasicTRecInfo;
    var modifyToastType = textManageFactory.modifyToastType;
    var id = $rootScope.onTmeId;

    $scope.lang = lang;
    $scope.localInfo = localInfo;

    $scope.record = {};
    var rec = tRecords[id];
    injectInfo(rec, $scope.record);

    $scope.finishEdit = function() {
        $scope.record.date = new Date();
        $scope.record.milli = $scope.record.date.getTime();

        localRecordFactory.editFromTRec(id, $scope.record);

        ngDialog.close();
        notificationFactory.genNotification("pe-7s-check", "success", modifyToastType("success"));
    };

})

.controller('tsController', function($rootScope, $scope, ngDialog, localRecordFactory, userFactory, textType, full_date, time, showDateAndTime, doDel, lang) {

    var refresh = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        $scope.tARecords = localRecordFactory.getTARecords();
    };

    refresh();

    $scope.showAllDelete = false;

    $scope.lang = lang;

    $scope.tab = 1;
    $scope.filtText = "task";

    $scope.textType = textType;
    $scope.full_date = full_date;
    $scope.time = time;
    $scope.showDateAndTime = showDateAndTime;

    $scope.select = function(setTab) {
        $scope.tab = setTab;
        if (setTab === 1)
            $scope.filtText = "task";
        else if (setTab === 2)
            $scope.filtText = "desire";
        else
            console.log("Error: No implementation in tcController of tab: ", setTab);
    };
    $scope.isSelected = function(checkTab) {
        return (checkTab === $scope.tab);
    };

    $scope.showPlaceholder = function(type) {
        var rs = true;

        for (var i = $scope.tARecords.length - 1; i >= 0; i--) {
            if ($scope.tARecords[i].type === type) {
                rs = false;
                break;
            }
        }

        return rs;
    };

    $scope.doDel = function(id) {
        doDel("aTask", "", id, "delete", function() {});
        $scope.showAllDelete = false;
    };
    $scope.onDetail = function(id) {
        $rootScope.onDetailId = id;
        ngDialog.open({ template: 'views/tsd.html', scope: $scope, className: 'ngdialog-theme-default', controller:"tsdController" });
    };

})

.controller('tsdController', function($rootScope, $scope, ngDialog, userFactory, localRecordFactory, languageFactory, formatFactory) {

    var localInfo = userFactory.getLocalInfo();
    var tARecords = localRecordFactory.getTARecords();
    var lang = languageFactory.lang;
    var showDateAndTime = formatFactory.showDateAndTime;
    var id = $rootScope.onDetailId;

    $scope.lang = lang;
    $scope.localInfo = localInfo;

    $scope.record = tARecords[id];

    $scope.showDateAndTime = showDateAndTime;

})

.controller('helpController', function($scope, authFactory) {

})

;
