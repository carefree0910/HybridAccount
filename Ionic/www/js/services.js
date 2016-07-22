'use strict';

angular.module('Account.services', ['ngResource'])

.constant("baseURL", "https://10.2.75.150:3443/")
// .constant("baseURL", "https://localhost:3443/")

.filter('latestFilter', function() {
    return function(records) {
        var rs = [];
        for (var i = 0; i < records.length; i++) {
            rs.push(records[i]);
            if (i == 2)
                break;
        }
        return rs;
    }
})

.filter('moneyRecordsFilter', function() {
    return function(records, type) {
        if (type === "all")
            return records;
        var rs = [];
        for (var i = records.length - 1; i >= 0; i--) {
            if (records[i].type === type)
                rs.push(records[i]);
        }
        return rs;
    }
})

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

.factory('cloudRecordFactory', function($resource, baseURL) {
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

.factory('localRecordFactory', ['$localStorage', 'cloudRecordFactory', 'formatFactory', function($localStorage, cRecFac, fFac) {
    var recFac = {};
    var records = {};
    
    records.mRecords = $localStorage.getObject('mRecords', '[]');
    records.tRecords = $localStorage.getObject('tRecords', '[]');
    records.tARecords = $localStorage.getObject('tARecords', '[]');
    records.tPoints = parseFloat($localStorage.get('tPoints', 0));
    
    records.mtRecords = $localStorage.getObject('mtRecords', '[]');
    records.trRecords = $localStorage.getObject('trRecords', '[]');
    
    records.tags = $localStorage.getObject('tags', '[]');
    
    recFac.getAllRecords = function() {
        return records;
    };
    
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
    
    recFac.getDateRecords = function(date) {
        if (!date)
            date = new Date();
        var mRecords = recFac.getMRecords();
        
        var rs = [];
        for (var i = mRecords.length - 1; i >= 0; i--) {
            var rec = mRecords[i];
            var pDate = new Date(); pDate.setTime(rec.milli);
            if (pDate.getDate() === date.getDate() && pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear())
                rs.push(rec);
        }
        
        return rs;
    }
    recFac.getMrRecords = function(date) {
        if (!date)
            date = new Date();
        var mRecords = recFac.getMRecords();
        var mr = {};
        mr.mrd = {}; mr.mrw = {}; mr.mrm = {}; mr.mry = {};
        mr.mrd.o = []; mr.mrd.i = [];
        mr.mrw.o = []; mr.mrw.i = [];
        mr.mrm.o = []; mr.mrm.i = [];
        mr.mry.o = []; mr.mry.i = [];
        for (var i = mRecords.length - 1; i >= 0; i--) {
            var rec = mRecords[i];
            var pDate = new Date(); pDate.setTime(rec.milli);
            var dT, wT, mT, yT;
            if (rec.type === "output") {
                dT = mr.mrd.o; wT = mr.mrw.o; mT = mr.mrm.o; yT = mr.mry.o;
            } else {
                dT = mr.mrd.i; wT = mr.mrw.i; mT = mr.mrm.i; yT = mr.mry.i;
            }
            if (pDate.getFullYear() != date.getFullYear())
                continue;
            if (pDate.getMonth() != date.getMonth()) {
                yT.push(rec);
            } else {
                var pdt = pDate.getDate(), ddt = date.getDate(), ddy = date.getDay();
                if ((pdt > ddt && pdt - ddt > 6 - ddy) || (pdt < ddt && ddt - pdt > ddy)) {
                    yT.push(rec);
                    mT.push(rec);
                } else if (pdt != ddt) {
                    yT.push(rec);
                    mT.push(rec);
                    wT.push(rec);
                } else {
                    yT.push(rec);
                    mT.push(rec);
                    wT.push(rec);
                    dT.push(rec);
                }
            }
        }
        
        return mr;
    };
    recFac.getMoiRecords = function() {
        var rs = {};
        rs.o = []; rs.i = [];
        var mRecords = recFac.getMRecords();
        
        for (var i = mRecords.length - 1; i >= 0; i--) {
            if (mRecords[i].type === "output")
                rs.o.push(mRecords[i]);
            else
                rs.i.push(mRecords[i]);
        }
        
        return rs;  
    };
    
    recFac.getMtRecords = function() {
        return records.mtRecords;
    };
    recFac.getTrRecords = function() {
        return records.trRecords;
    };
    
    recFac.getTags = function() {
        return records.tags;
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
        $localStorage.store('tPoints', pt);
    };
    recFac.updateMtRecords = function(mtRec) {
        records.mtRecords = mtRec;
        $localStorage.storeObject('mtRecords', mtRec);
    };
    recFac.updateTrRecords = function(rec) {
        var date = new Date;
        var milli = date.getTime();
        
        var trRecords = records.trRecords;
        if (trRecords.length === 0) {
            
        } else {
            var pDate = new Date();
            pDate.setTime(trRecords[0].milli);
            
            if (pDate.getDate() != date.getDate() || pDate.getMonth() != date.getMonth() || pDate.getFullYear() != date.getFullYear())
                trRecords.length = 0;
        }
        
        var involve_flag = false;
        for (var i = trRecords.length - 1; i >= 0; i--) {
            var trRec = trRecords[i];
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
            trRecords.push(rec);
        }
        $localStorage.storeObject('trRecords', trRecords);
    };
    recFac.updateTags = function(tags) {
        records.tags = tags;
        $localStorage.storeObject('tags', tags);
    }
    
    recFac.delById = function(id, rec, type) {        
        for (var i = rec.length - 1; i >= 0; i--) {
            if (i == id) {
                rec.splice(i, 1);
                break;
            }
        }
        for (var i = rec.length - 1; i >= 0; i--) {
            if (i >= id)
                rec[i].id = i;
        }
        if (type)
            $localStorage.storeObject(type, rec);
    }
    recFac.delFromMRec = function(id) {
        recFac.delById(id, records.mRecords, "mRecords");
    };
    recFac.delFromTRec = function(id) {
        recFac.delById(id, records.tRecords, "tRecords");
        for (var i = records.trRecords.length - 1; i >= 0; i--) {
            if (records.trRecords[i].id == id) {
                records.trRecords.splice(i, 1);
                break;
            }
        }
        for (var i = records.trRecords.length - 1; i >= 0; i--) {
            if (records.trRecords[i].id > id)
                records.trRecords[i].id -= 1;
        }
        $localStorage.storeObject('trRecords', records.trRecords);
    };
    recFac.delFromTARec = function(id) {
        recFac.delById(id, records.tARecords, "tARecords");
    };
    recFac.delFromMtRec = function(id) {
        recFac.delById(id, records.mtRecords, "mtRecords");
    };
    recFac.delFromTags = function(id) {
        recFac.delById(id, records.tags, "tags");
    };
    
    recFac.editFromMRec = function(id, rec) {
        records.mRecords[id] = rec;
        $localStorage.storeObject('mRecords', records.mRecords);
    };
    recFac.editFromTRec = function(id, rec) {
        records.tRecords[id] = rec;
        $localStorage.storeObject('tRecords', records.tRecords);
    };  
    recFac.editFromMtRec = function(id, rec) {
        records.mtRecords[id] = rec;
        $localStorage.storeObject('mtRecords', records.mtRecords);
    };
    recFac.editFromMtRec = function(id, tag) {
        records.tags[id] = tag;
        $localStorage.storeObject('tags', records.tags);
    };
    
    recFac.tmpOutputTemplate = {
        "triggered": false,
        "tags": [],
        "event": "",
        "amount": 0,
        "unit_price": 0
    };
    recFac.tmpIncomeTemplate = {
        "triggered": false,
        "tags": [],
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
    
    rmFac.checkTagInvolve = function(tagBody, tags) {
        for (var i = tags.length - 1; i >= 0; i--) {
            if (tags[i].body === tagBody)
                return true;
        }
        return false;
    };
    rmFac.genTagManager = function(current_tags) {
        var tagManager = {};
        tagManager.tags = localRecordFactory.getTags();
        tagManager.selectedTag = "";
        tagManager.current_tag = {};
        tagManager.current_tags = current_tags;
        
        tagManager.addTag = function() {
            if (tagManager.current_tag.body) {
                var involve = rmFac.checkTagInvolve(tagManager.current_tag.body, tagManager.current_tags);
                if (!involve) {
                    tagManager.current_tag.id = tagManager.current_tags.length;
                    tagManager.current_tags.push(tagManager.current_tag);
                }
                tagManager.current_tag = {};
            }
        };
        tagManager.addTagById = function(id) {
            var involve = rmFac.checkTagInvolve(tagManager.tags[id].body, tagManager.current_tags);
            if (!involve) {
                var tmpTag = {};
                tmpTag.id = tagManager.current_tags.length;
                tmpTag.body = tagManager.tags[id].body;
                tagManager.current_tags.push(tmpTag);
            }
        };
        tagManager.addTagByBody = function() {
            if (tagManager.selectedTag) {
                var involve = rmFac.checkTagInvolve(tagManager.selectedTag.body, tagManager.current_tags);
                if (!involve) {
                    var tmpTag = {};
                    tmpTag.id = tagManager.current_tags.length;
                    tmpTag.body = tagManager.selectedTag.body;
                    tagManager.current_tags.push(tmpTag);
                }
                tagManager.selectedTag = "";
            }
        };
        tagManager.delTagById = function(id) {
            localRecordFactory.delById(id, tagManager.current_tags);
        };
        return tagManager;
    };
    
    rmFac.checkSubTagList = function(sub, org) {
        for (var i = sub.length - 1; i >= 0; i--) {
            var involve = false;
            var tmpBody = sub[i].body;
            for (var j = org.length - 1; j >= 0; j--) {
                if (tmpBody === org[j].body) {
                    involve = true; break;
                }
            }
            if (!involve)
                return false;
        }
        return true;
    };
    rmFac.filtRecordsWithTags = function(tags, records) {
        for (var i = records.length - 1; i >= 0; i--) {
            if (!rmFac.checkSubTagList(tags, records[i].tags))
                records.splice(i, 1);
        }
    };
    rmFac.getAndFiltOiRecordsWithTags = function(oiRecords, tags) {
        if (tags.length === 0)
            return oiRecords;
        rmFac.filtRecordsWithTags(tags, oiRecords.o);
        rmFac.filtRecordsWithTags(tags, oiRecords.i);
        return oiRecords;
    };
    
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
            "tags": [],
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
            "tags": [],
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

.factory('graphManageFactory', ['formatFactory', 'languageFactory', 'userFactory', function(fFac, lFac, uFac) {
    var gFac = {};
    
    var get_graph = function(records, type) {
        var graph = {};
        graph.data = [];
        graph.labels = [];
        if (type === "day") {
            graph.labels = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
            graph.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = records.length - 1; i >= 0; i--) {
                var rec = records[i];
                graph.data[graph.labels.indexOf(fFac.hour(rec))] += rec.sum;
            }
        } else if (type === "week") {
            graph.labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            graph.data = [0, 0, 0, 0, 0, 0, 0];
            for (var i = records.length - 1; i >= 0; i--) {
                var rec = records[i];
                graph.data[graph.labels.indexOf(fFac.day(rec))] += rec.sum;
            }
        } else if (type === "month") {
            graph.labels = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
            graph.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = records.length - 1; i >= 0; i--) {
                var rec = records[i];
                graph.data[graph.labels.indexOf(fFac.date(rec))] += rec.sum;
            }
        } else if (type === "year") {
            graph.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            graph.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = records.length - 1; i >= 0; i--) {
                var rec = records[i];
                graph.data[graph.labels.indexOf(fFac.month(rec))] += rec.sum;
            }
        }
        fFac.formatListNumber(graph.data, 2);
        return graph;
    };
    
    gFac.init_data = function(oRecords, iRecords, type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        var data = {
            labels: [],
            datasets: [
                {
                    label: lang.gmFac.a,
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "rgba(255, 177, 165, 0.5)",
                    borderColor: "rgba(255, 143, 125, 1)",
                    borderCapStyle: 'butt',
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(254, 86, 60, 1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(255, 114, 91, 1)",
                    pointHoverBorderColor: "rgba(255, 220, 215, 1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [],
                },
                {
                    label: lang.gmFac.b,
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "rgba(156, 241, 178, 0.5)",
                    borderColor: "rgba(111, 227, 142, 1)",
                    borderCapStyle: 'butt',
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(45, 190, 83, 1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75, 210, 111, 1)",
                    pointHoverBorderColor: "rgba(211, 251, 222, 1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [],
                }
            ]
        };
        
        var oGraph = get_graph(oRecords, type);
        var iGraph = get_graph(iRecords, type);;
        
        if (oGraph.labels.length >= iGraph.labels)
            data.labels = oGraph.labels;
        else
            data.labels = iGraph.labels;
        
        data.datasets[0].data = oGraph.data;
        data.datasets[1].data = iGraph.data;
        return data;
    };
    
    return gFac;
}])

.factory('formatFactory', function($filter) {
    var fFac = {};
    
    fFac.formatNumber = function(num, precision) {
        return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
    };
    fFac.formatListNumber = function(lst, precision) {
        for (var i = lst.length - 1; i >= 0; i--) {
            lst[i] = fFac.formatNumber(lst[i], precision);
        }
    }
    
    fFac.sortByMilli = function(x, y) { 
        return x.milli - y.milli; 
    };
    
    fFac.full_date = function(rec) {
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
    
    fFac.month = function(rec) {
        return $filter('date') (rec.date, 'MMM');
    };
    fFac.date = function(rec) {
        return $filter('date') (rec.date, 'dd');
    };
    fFac.day = function(rec) {
        return $filter('date') (rec.date, 'EEE');
    };
    fFac.hour = function(rec) {
        return $filter('date') (rec.date, 'HH');
    };
    
    return fFac;
})

.factory('userFactory', function($resource, $localStorage) {
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
                        "body": "1"
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
    };
    var destroyUserCredentials = function() {
        authToken = undefined;
        username = '';
        isAuthenticated = false;
        $http.defaults.headers.common['x-access-token'] = authToken;
        $localStorage.remove(TOKEN_KEY);
    };
     
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
            "d": "暂无标签...",
            "e": "保存模板",
            "f": "加载模板",
            "g": "输入或选择一个标签...",
            "h": "所有标签"
        },
        "mc": {
            "a": "财务记录查询",
            "b": "当日记录",
            "c": "全部记录",
            "d": "支出",
            "e": "收入",
            "f": "过滤器",
            "g": "标签",
            "h": "日期",
            "i": "事件描述",
            "j": "单价",
            "k": "数量",
            "l": "数额",
            "m": "具体时间",
            "n": "删除"
        },
        "mce": {
            "a": "编辑记录",
            "b": "日期",
            "c": "时间",
            "d": "事件",
            "e": "数量",
            "f": "暂无标签...",
            "g": "输入或选择一个标签...",
            "h": "所有标签"
        },
        "mg": {
            "a": "统计记录",
            "b": "聚焦",
            "c": "加总",
            "d": "设置",
            "e": "日期",
            "f": "暂无标签限制...",
            "g": "选择标签...",
            "h": function(filtText) {
                if (filtText === "sep")
                    return "当日记录统计";
                return "每日记录加总";
            },
            "i": function(filtText) {
                if (filtText === "sep")
                    return "当周记录统计";
                return "每周记录加总";
            },
            "j": function(filtText) {
                if (filtText === "sep")
                    return "当月记录统计";
                return "每月记录加总";
            },
            "k": function(filtText) {
                if (filtText === "sep")
                    return "当年记录统计";
                return "每年记录加总";
            }
        },
        "mt": {
            "a": "记录模板查询",
            "b": "支出",
            "c": "收入",
            "d": "过滤器",
            "e": "标签",
            "f": "事件描述",
            "g": "单价",
            "h": "数量",
            "j": "数额",
            "k": "更新时间",
            "l": "删除"
        },
        "mte": {
            "a": "编辑模板",
            "b": "数量",
            "c": "事件",
            "d": "暂无标签...",
            "e": "应用",
            "f": "输入或选择一个标签...",
            "g": "所有标签"
        },
        "mtd": {
            "a": "增添财务记录",
            "b": "记录支出",
            "c": "单价",
            "d": "数量",
            "e": "事件描述",
            "f": "暂无标签...",
            "g": "记录收入",
            "h": "数额",
            "i": "事件描述",
            "j": "暂无标签...",
            "k": "输入或选择一个标签...",
            "l": "所有标签"
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
            "a": "编辑备忘"
        },
        "ts": {
            "a": "归档事件",
            "b": "任务",
            "c": "欲望",
            "d": "次数",
            "e": "归档时间",
            "f": "删除"
        },
        "tsd": {
            "a": "详情",
            "b": "事件",
            "c": "次数",
            "d": "时间"
        },
        
        "home": {
            "a": "主页",
            "b": "财务管理综述",
            "c": "支出金额",
            "d": "收入金额",
            "e": "事件管理综述",
            "f": "剩余点数",
            "g": "最近备忘",
            "h": "记账者信息",
            "i": "用户名",
            "j": "年收入"
        },
        "login": {
            "a": "登录",
            "b": "用户名",
            "c": "密码"
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
            "a": "注册",
            "b": "用户名",
            "c": "密码"
        },
        "setting": {
            "a": "设置",
            "b": "语言",
            "c": "头像",
            "d": "照相",
            "e": "图库",
            "f": "用户名",
            "g": "年收入"
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

        },
        "gmFac": {
            "a": "支出",
            "b": "收入",
        },
        
        "loading": {
            "a": "加载中"
        },
        "exit": {
            "a": "再按一次退出"
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
            "c": "pt. +",
            "d": "New Desire",
            "e": "Description",
            "f": "pt. -",
            "g": "New Memo"
        },
        
        "ma": {
            "a": "Add Financial Record",
            "b": "Expenditure Record",
            "c": "Income Record",
            "d": "No tags yet...",
            "e": "Save Template",
            "f": "Load Template",
            "g": "Enter or select a tag...",
            "h": "All Tags"
        },
        "mc": {
            "a": "Check Financial Records",
            "b": "Focus",
            "c": "All",
            "d": "Expenditure",
            "e": "Income",
            "f": "Filter",
            "g": "Tag",
            "h": "Date",
            "i": "Description",
            "j": "Unit-Price",
            "k": "Quantity",
            "l": "Amount",
            "m": "Time",
            "n": "Delete"
        },
        "mce": {
            "a": "Edit Record",
            "b": "Date",
            "c": "Time",
            "d": "Description",
            "e": "Quantity",
            "f": "No tags yet...",
            "g": "Enter or select a tag...",
            "h": "All Tags"
        },
        "mg": {
            "a": "Analytics",
            "b": "Focus",
            "c": "Adding Up",
            "d": "Setting",
            "e": "Date",
            "f": "No tags specified yet...",
            "g": "Select a tag...",
            "h": function(filtText) {
                if (filtText === "sep")
                    return "Analytics for that Day";
                return "Adding up each Day's Records";
            },
            "i": function(filtText) {
                if (filtText === "sep")
                    return "Analytics for that Week";
                return "Adding up each Week's Records";
            },
            "j": function(filtText) {
                if (filtText === "sep")
                    return "Analytics for that Month";
                return "Adding up each Month's Records";
            },
            "k": function(filtText) {
                if (filtText === "sep")
                    return "Analytics for that Year";
                return "Adding up each Year's Records";
            }
        },
        "mt": {
            "a": "Check Templates",
            "b": "Expenditure",
            "c": "Income",
            "d": "Filter",
            "e": "Tag",
            "f": "Description",
            "g": "Unit-Price",
            "h": "Quantity",
            "i": "Amount",
            "j": "Update Time",
            "k": "Delete"
        },
        "mte": {
            "a": "Edit Template",
            "b": "Quantity",
            "c": "Description",
            "d": "No tags yet...",
            "e": "Apply",
            "f": "Enter or select a tag...",
            "g": "All Tags"
        },
        "mtd": {
            "a": "Add Financial Record",
            "b": "Expenditure Record",
            "c": "Unit-Price",
            "d": "Quantity",
            "e": "Description",
            "f": "No tags yet...",
            "g": "Income Record",
            "h": "Amount",
            "i": "Description",
            "j": "No tags yet...",
            "k": "Enter or select a tag...",
            "l": "All Tags"
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
            "a": "Edit Memo"
        },
        "ts": {
            "a": "Archived Events",
            "b": "Task",
            "c": "Desire",
            "d": "",
            "e": "Archive Time",
            "f": "Delete"
        },
        "tsd": {
            "a": "Detail",
            "b": "Description",
            "c": "",
            "d": " Time(s)"
        },
        
        "home": {
            "a": "Home",
            "b": "Financial Summerization",
            "c": "Expenditure",
            "d": "Income",
            "e": "Event Summerization",
            "f": "pt. Left",
            "g": "Latest Memo",
            "h": "User Info",
            "i": "Username",
            "j": "Income"
        },
        "login": {
            "a": "Log In",
            "b": "Username",
            "c": "Password"
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
            "a": "Register",
            "b": "Username",
            "c": "Password"
        },
        "setting": {
            "a": "Setting",
            "b": "Language",
            "c": "Avatar",
            "d": "Camera",
            "e": "Gallery",
            "f": "Username",
            "g": "Income"
        },
        "sidebar": {
            "a": "Navigation",
            "b": "Home",
            "c": "Today's Account",
            "d": "Financial Account",
            "e": "Add Record",
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
            "task": "pt. +",
            "desire": "pt. -"
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
            "success": "Setting Completed !",
            "failed": "Setting Failed !"
        },
        "uploadToastType": {
            "success": "Upload Completed !",
            "failed": "Upload Failed !"
        },
        "downloadToastType": {
            "success": "Download Completed !",
            "failed": "Download Failed !"
        },
        
        "addToastType": {
            "success": "Added !",
            "failed": "Failed !"
        },
        "modifyToastType": {
            "success": "Modified !",
            "failed": "Failed !"
        },
        
        "meErrMsg": {
            "amount": "\nPlease provide a validate number for Quantity !",
            "unit_price": "\nPlease provide a validate number for "
        },
        "teErrMsg": {
            "points": "Please provide a validate number for pt. !"
        },
        "tceErrMsg": {
            "points": "\nPlease provide a validate number for Points !",
            "amount": "\nPlease provide a validate number for Achieved !"
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
                return "Confirm " + msg + " this " + taskType + " ?";
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
                    return "\nPlease provide a validate number for Quantity !";
                return "\Please provide a validate number for ";
            },
            "toast": function(type, msg, err_msg) {
                var sMsg, fMsg;
                if (msg === "保存") {
                    sMsg = "Saved Successfully !";
                    fMsg = "Saved Failed !"
                } else {
                    sMsg = "Recorded !";
                    fMsg = "Failed !";
                }
                if (type === "success")
                    return sMsg;
                return fMsg + err_msg;
            }

        },
        "gmFac": {
            "a": "Expenditure",
            "b": "Income",
        },
        
        "loading": {
            "a": "Loading"
        },
        "exit": {
            "a": "Press again to Exit"
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