'use strict';

angular.module('Account.services', ['ngResource'])

.constant("baseURL", "https://192.168.100.107:3443/")
// .constant("baseURL", "https://localhost:3443/")
.constant("default_lang", "en")

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

.filter('taskRecordsFilter', function() {
    return function(records, type) {
        var rs = [];

        if (type === "memo") {
            for (var i = records.length - 1; i >= 0; i--) {
                if (records[i].type === type)
                    rs.push(records[i]);
            }
        } else {
            for (var i = records.length - 1; i >= 0; i--) {
                if (records[i].type != "memo")
                    rs.push(records[i]);
            }
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

.factory('dataFactory', function() {
    var dataFac = {};
    
    dataFac.headerData = {};
    dataFac.footerData = {};
    
    dataFac.headerData.loggedIn = false;
    dataFac.headerData.username = "";
    
    return dataFac;
})

.factory('refreshFactory', function($rootScope) {
    var refreshFac = {};
    
    refreshFac.refresh = function(state) {
        $rootScope.$broadcast("refresh:app" + state);
    };
    
    return refreshFac;
})

.factory('notificationFactory', function() {
    var noteFac = {};

    noteFac.genNotification = function(icon, type, msg) {
        $.notify({
            icon: icon,
            message: msg
        }, {
            type: type,
            placement: {
                from: "top",
                align: "right"
            }
        });
    };

    return noteFac;
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
    };
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
        recFac.updateTrRecords();
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

        if (rec) {
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
        }

        $localStorage.storeObject('trRecords', trRecords);
    };
    recFac.updateTags = function(tags) {
        records.tags = tags;
        $localStorage.storeObject('tags', tags);
    };

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
    };
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
    recFac.editFromTag = function(id, tag) {
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

.factory('recordManageFactory', function($ionicPopup, localRecordFactory, notificationFactory, textManageFactory, languageFactory, userFactory) {
    var rmFac = {};

    rmFac.checkTagInvolve = function(tag, tags) {
        for (var i = tags.length - 1; i >= 0; i--) {
            if (tags[i].body === tag.body)
                return true;
        }
        return false;
    };
    rmFac.genTagManager = function(current_tags) {
        var tagManager = {};

        tagManager.tags = localRecordFactory.getTags();
        tagManager.selectedTagId = 0;
        tagManager.current_tag = {};
        tagManager.current_tags = current_tags;

        tagManager.addCurrentTagById = function(id) {
            var involve = rmFac.checkTagInvolve(tagManager.tags[id], tagManager.current_tags);
            if (!involve) {
                var tmpTag = {};
                tmpTag.id = tagManager.current_tags.length;
                tmpTag.body = tagManager.tags[id].body;
                tagManager.current_tags.push(tmpTag);
            }
        };
        tagManager.addCurrentTagByEnter = function() {
            if (tagManager.current_tag.body) {
                var involve = rmFac.checkTagInvolve(tagManager.current_tag, tagManager.current_tags);
                if (!involve) {
                    tagManager.current_tag.id = tagManager.current_tags.length;
                    tagManager.current_tags.push(tagManager.current_tag);
                }
                tagManager.current_tag = {};
            }
        };

        tagManager.delCurrentTagById = function(id) {
            localRecordFactory.delById(id, tagManager.current_tags);
        };
        tagManager.delAllTagById = function(id) {
            var tagBody = tagManager.tags[id].body;
            rmFac.doDel("tags", "", id, tagBody, function() {
                var mRecords = localRecordFactory.getMRecords();
                for (var i = mRecords.length - 1; i >= 0; i--) {
                    var idx = -1, tmpTags = mRecords[i].tags;
                    for (var j = tmpTags.length - 1; j >= 0; j--) {
                        if (tmpTags[j].body === tagBody) {
                            idx = j; break;
                        }
                    }
                    if (idx >= 0)
                        localRecordFactory.delById(idx, tmpTags);
                }
                localRecordFactory.updateMRecords(mRecords);
            });
            tagManager.selectedTagId = 0;
        };

        return tagManager;
    };
    rmFac.getTags = function(tags) {
        if (!tags || tags.length === 0)
            return "";
        var rs = "";
        for (var i = tags.length - 1; i >= 0; i--)
            rs += tags[i].body + " ";
        return rs;
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
    rmFac.filtOiRecordsWithTags = function(oiRecords, tags) {
        if (tags.length === 0)
            return oiRecords;
        rmFac.filtRecordsWithTags(tags, oiRecords.o);
        rmFac.filtRecordsWithTags(tags, oiRecords.i);
        return oiRecords;
    };
    rmFac.sumEachTagWithOiRecords = function(oiRecords, currentTags) {
        var rs = {};
        rs.o = []; rs.i = [];

        for (var i = currentTags.length - 1; i >= 0; i--) {
            rs.o[currentTags[i].body] = 0; rs.i[currentTags[i].body] = 0;
        }

        var oRec = oiRecords.o, iRec = oiRecords.i;
        for (var i = oRec.length - 1; i >= 0; i--) {
            var tmpTags = oRec[i].tags;
            for (var j = currentTags.length - 1; j >= 0; j--) {
                for (var k = tmpTags.length - 1; k >= 0; k--) {
                    if (tmpTags[k].body === currentTags[j].body) {
                        rs.o[currentTags[j].body] += oRec[i].sum;
                        break;
                    }
                }
            }
        }
        for (var i = iRec.length - 1; i >= 0; i--) {
            var tmpTags = iRec[i].tags;
            for (var j = currentTags.length - 1; j >= 0; j--) {
                for (var k = tmpTags.length - 1; k >= 0; k--) {
                    if (tmpTags[k].body === currentTags[j].body) {
                        rs.i[currentTags[j].body] += iRec[i].sum;
                        break;
                    }
                }
            }
        }

        return rs;
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
        } else if (category === "tags") {
            del_method = localRecordFactory.delFromTags;
            pop_msg = lang.rmFac.tagPop(msg);
            toast_msg = lang.rmFac.tagToast;
        } else {
            console.log("Error, doDel not implemented with " + category + " !");
        }

        var confirmPopup = $ionicPopup.confirm({
            template: '<p style="text-align:center;">' + pop_msg + "</p>"
        });
        confirmPopup.then(function (res) {
            if (res) {
                del_method(id);
                next();
                notificationFactory.genNotification("pe-7s-check", "success", toast_msg)
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
            err_msg += lang.rmFac.err_msg("unit_price") + lang.rmFac.err_type(type) + "!";
        }

        if (!err_flag) {
            next(info);
            notificationFactory.genNotification("pe-7s-check", "success", lang.rmFac.toast("success", msg, err_msg));
        } else
            notificationFactory.genNotification("pe-7s-attention", "danger", lang.rmFac.toast("failed", msg, err_msg));

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
            err_msg += lang.rmFac.err_msg("unit_price") + lang.rmFac.err_type(type) + "!";
        }

        if (!err_flag) {
            next(info);
            notificationFactory.genNotification("pe-7s-check", "success", lang.rmFac.toast("success", "record", err_msg));
        } else
            notificationFactory.genNotification("pe-7s-attention", "danger", lang.rmFac.toast("failed", "record", err_msg));

    };

    return rmFac;
})

.factory('graphManageFactory', ['formatFactory', 'languageFactory', 'userFactory', function(fFac, lFac, uFac) {
    var gFac = {};

    var get_line_graph = function(records, type) {
        var graph = {};
        graph.data = [];
        graph.labels = [];
        if (type === "day") {
            graph.labels = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
            graph.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = records.length - 1; i >= 0; i--) {
                var rec = records[i];
                graph.data[graph.labels.indexOf(fFac.hour(rec.date))] += rec.sum;
            }
        } else if (type === "week") {
            graph.labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            graph.data = [0, 0, 0, 0, 0, 0, 0];
            for (var i = records.length - 1; i >= 0; i--) {
                var rec = records[i];
                graph.data[graph.labels.indexOf(fFac.day(rec.date))] += rec.sum;
            }
        } else if (type === "month") {
            graph.labels = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
            graph.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = records.length - 1; i >= 0; i--) {
                var rec = records[i];
                graph.data[graph.labels.indexOf(fFac.date(rec.date))] += rec.sum;
            }
        } else if (type === "year") {
            graph.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            graph.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = records.length - 1; i >= 0; i--) {
                var rec = records[i];
                graph.data[graph.labels.indexOf(fFac.month(rec.date))] += rec.sum;
            }
        }
        fFac.formatListNumber(graph.data, 2);
        return graph;
    };

    gFac.init_line_data = function(oRecords, iRecords, type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        var data = {
            labels: [],
            datasets: [
                {
                    label: lang.gmFac.oTitle,
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
                    label: lang.gmFac.iTitle,
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

        var oGraph = get_line_graph(oRecords, type);
        var iGraph = get_line_graph(iRecords, type);;

        if (oGraph.labels.length >= iGraph.labels)
            data.labels = oGraph.labels;
        else
            data.labels = iGraph.labels;

        data.datasets[0].data = oGraph.data;
        data.datasets[1].data = iGraph.data;
        return data;
    };
    gFac.init_bar_data = function(records, currentTags, type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        var title, backgroundColor, borderColor;
        if (type === "output") {
            title = lang.gmFac.oTitle;
            backgroundColor = "rgba(255, 177, 165, 0.5)";
            borderColor = "rgba(255, 143, 125, 1)";
        } else {
            title = lang.gmFac.iTitle;
            backgroundColor = "rgba(156, 241, 178, 0.5)";
            borderColor = "rgba(111, 227, 142, 1)";
        }

        var data = {
            labels: [],
            datasets: [{
                label: title,
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
                data: [],
            }]
        };
        for (var i = currentTags.length - 1; i >= 0; i--) {
            var tagBody = currentTags[i].body;
            data.labels.push(tagBody);
            data.datasets[0].backgroundColor.push(backgroundColor); data.datasets[0].borderColor.push(borderColor);
            data.datasets[0].data.push(records[tagBody]);
        }

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
    };

    fFac.sortByMilli = function(x, y) {
        return x.milli - y.milli;
    };

    fFac.full_date = function(date) {
        return $filter('date') (date, 'yyyy-MM-dd');
    };
    fFac.time = function(date) {
        return $filter('date') (date, 'HH:mm');
    };
    fFac.showDateAndTime = function(milli) {
        var date = new Date();
        date.setTime(milli);
        return $filter('date') (date, 'yyyy-MM-dd HH:mm:ss');
    };

    fFac.month = function(date) {
        return $filter('date') (date, 'MMM');
    };
    fFac.date = function(date) {
        return $filter('date') (date, 'dd');
    };
    fFac.day = function(date) {
        return $filter('date') (date, 'EEE');
    };
    fFac.hour = function(date) {
        return $filter('date') (date, 'HH');
    };

    return fFac;
})

.factory('userFactory', function($resource, $localStorage, default_lang) {
    var userFac = {};

    var localInfo = $localStorage.getObject('localInfo', '{}');
    var loginData = $localStorage.getObject('loginData', '{}');

    if (!localInfo.lang)
        localInfo.lang = default_lang;

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
                "title": lang.mForm.outputTitle,
                "contents": [
                    {
                        "title": lang.mForm.outputContent1,
                        "body": ""
                    },
                    {
                        "title": lang.mForm.outputContent2,
                        "body": "1"
                    },
                    {
                        "title": lang.mForm.outputContent3,
                        "body": ""
                    }
                ]
            },
            {
                "type": "income",
                "title": lang.mForm.incomeTitle,
                "contents": [
                    {
                        "title": lang.mForm.incomeContent1,
                        "body": ""
                    },
                    {
                        "title": lang.mForm.incomeContent2,
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
                "title": lang.tForm.taskTitle,
                "contents": [
                    {
                        "title": lang.tForm.taskContent1,
                        "body": ""
                    },
                    {
                        "title": lang.tForm.taskContent2,
                        "body": ""
                    }
                ]
            },
            {
                "type": "desire",
                "title": lang.tForm.desireTitle,
                "contents": [
                    {
                        "title": lang.tForm.desireContent1,
                        "body": ""
                    },
                    {
                        "title": lang.tForm.desireContent2,
                        "body": ""
                    }
                ]
            },
            {
                "type": "memo",
                "title": lang.tForm.memoTitle,
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

.factory('authFactory', function($resource, $http, $localStorage, $rootScope, baseURL, userFactory, languageFactory, notificationFactory) {

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
            var localInfo = userFactory.getLocalInfo();
            localInfo.username = loginData.username;
            $rootScope.$broadcast('login:Successful');
        }, function(res){
            isAuthenticated = false;
            var lang = languageFactory.lang(userFactory.getLocalInfo().lang);
            notificationFactory.genNotification("pe-7s-attention", "danger", res.data.err.message);
        });
    };
    authFac.logout = function() {
        $resource(baseURL + "users/logout").get(function(response) {});
        destroyUserCredentials();
    };
    authFac.register = function(registerData) {
        $resource(baseURL + "users/register").save(registerData, function(res) {
            authFac.login({username: registerData.username, password: registerData.password});
            var localInfo = userFactory.getLocalInfo();
            localInfo.username = loginData.username;
            localInfo.firstName = registerData.firstName;
            localInfo.lastName = registerData.lastName;
            $rootScope.$broadcast('registration:Successful');
        }, function(res){
            var lang = languageFactory.lang(userFactory.getLocalInfo().lang);
            notificationFactory.genNotification("pe-7s-attention", "danger", res.data.err.message);
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
            "outputTitle": "记录支出",
            "outputContent1": "单价",
            "outputContent2": "数量",
            "outputContent3": "事件描述",
            "incomeTitle": "记录收入",
            "incomeContent1": "数额",
            "incomeContent2": "事件描述"
        },
        "tForm": {
            "taskTitle": "新任务",
            "taskContent1": "描述",
            "taskContent2": "得点",
            "desireTitle": "新欲望",
            "desireContent1": "描述",
            "desireContent2": "失点",
            "memoTitle": "新备忘"
        },

        "ma": {
            "viewTitle": "增添财务记录",
            "output": "记录支出",
            "income": "记录收入",
            "placeholder1": "暂无标签...",
            "save": "保存模板",
            "load": "加载模板",
            "placeholder2": "输入一个标签...",
            "placeholder3": "选择一个标签..."
        },
        "mc": {
            "viewTitle": "财务记录查询",
            "focus": "当日记录",
            "all": "全部记录",
            "output": "支出",
            "income": "收入",
            "filter": "过滤器",
            "tag": "标签",
            "date": "日期",
            "event": "事件描述",
            "amount": "数额",
            "time": "具体时间",
            "delete": "删除"
        },
        "mce": {
            "viewTitle": "编辑记录",
            "date": "日期",
            "time": "时间",
            "event": "事件",
            "amount": "数量",
            "placeholder1": "暂无标签...",
            "placeholder2": "输入一个标签...",
            "placeholder3": "选择一个标签..."
        },
        "mg": {
            "viewTitle": "统计记录",
            "focus": "聚焦",
            "addUp": "加总",
            "filter": "过滤器",
            "date": "日期",
            "placeholder1": "暂无标签限制...",
            "placeholder2": "选择标签...",
            "dType": function(tab) {
                if (tab === 1)
                    return "当日记录统计";
                return "每日记录加总";
            },
            "wType": function(tab) {
                if (tab === 1)
                    return "当周记录统计";
                return "每周记录加总";
            },
            "mType": function(tab) {
                if (tab === 1)
                    return "当月记录统计";
                return "每月记录加总";
            },
            "yType": function(tab) {
                if (tab === 1)
                    return "当年记录统计";
                return "每年记录加总";
            }
        },
        "mt": {
            "viewTitle": "记录模板查询",
            "type": "类型",
            "all": "全部",
            "output": "支出",
            "income": "收入",
            "filter": "过滤器",
            "tag": "标签",
            "event": "事件描述",
            "amount": "数额",
            "delete": "删除"
        },
        "mte": {
            "viewTitle": "编辑模板",
            "amount": "数量",
            "event": "事件",
            "placeholder1": "暂无标签...",
            "apply": "应用",
            "placeholder2": "输入一个标签...",
            "placeholder3": "选择一个标签..."
        },
        "mtd": {
            "viewTitle": "增添财务记录",
            "recOutput": "记录支出",
            "unitPrice": "单价",
            "quantity": "数量",
            "oEvent": "事件描述",
            "placeholder1": "暂无标签...",
            "recIncome": "记录收入",
            "amount": "数额",
            "iEvent": "事件描述",
            "placeholder2": "输入一个标签...",
            "placeholder3": "选择一个标签..."
        },

        "ta": {
            "viewTitle": "增添事件",
            "task": "新任务",
            "desire": "新欲望",
            "memo": "新备忘"
        },
        "tc": {
            "viewTitle": "事件查询",
            "task": "任务",
            "desire": "欲望",
            "time": "次数",
            "updateTime": "更新时间",
            "delete": "删除"
        },
        "tce": {
            "viewTitle": "详情",
            "event": "事件",
            "time": "次数"
        },
        "tm": {
            "viewTitle": "备忘查询",
            "time": "更新时间",
            "delete": "删除"
        },
        "tme": {
            "viewTitle": "编辑备忘"
        },
        "ts": {
            "viewTitle": "归档事件",
            "task": "任务",
            "desire": "欲望",
            "time": "次数",
            "archiveTime": "归档时间",
            "delete": "删除"
        },
        "tsd": {
            "viewTitle": "详情",
            "event": "事件",
            "time": "次数",
            "doneTimes": "时间"
        },

        "home": {
            "viewTitle": "主页",
            "sTitle": "综述",
            "expenditure": "支出金额",
            "income": "收入金额",
            "ptLeft": "剩余点数",
            "latestMemo": "最近备忘",
            "userInfo": "记账者信息",
            "username": "用户名",
            "yIncome": "年收入"
        },
        "login": {
            "title": "登录",
            "username": "用户名",
            "password": "密码"
        },
        "recent": {
            "viewTitle": "今日账本",
            "mAccount": "财务账本",
            "tAccount": "事件账本",
            "mTitle": "今日财务统计",
            "sumOutput": "总支出数额",
            "sumIncome": "总收入数额",
            "output": "支出",
            "income": "收入",
            "amount": "数额",
            "mDetail": "今日财务记录",
            "tTitle": "今日事件统计",
            "sumPtGet": "总得点",
            "sumPtLost": "总失点",
            "tDetail": "今日事件记录",
            "time": "具体时间",
            "today": "今日",
            "todayAmount": "次数",
            "todayTime": "时间"
        },
        "register": {
            "title": "注册",
            "username": "用户名",
            "password": "密码"
        },
        "setting": {
            "title": "设置",
            "lang": "语言",
            "avatar": "头像",
            "username": "用户名",
            "yIncome": "年收入"
        },
        "sidebar": {
            "title": "导航",
            "home": "主页",
            "today": "今日账本",
            "mAccount": "财务账本",
            "ma": "记一笔",
            "mc": "查询记录",
            "mt": "查询模板",
            "mg": "统计记录",
            "tAccount": "事件账本",
            "ta": "增添事件",
            "tc": "查看事件",
            "tm": "查看备忘",
            "ts": "归档事件",
            "services": "服务",
            "login": "登录",
            "register": "注册",
            "setting": "设置",
            "sync": "同步"
        },
        "sync": {
            "upload": "上传数据",
            "download": "下载数据"
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
            "success": "注册成功!",
            "failed": "注册失败!"
        },
        "loginToastType": {
            "success": "登录成功!",
            "failed": "登录失败!"
        },
        "settingToastType": {
            "success": "设置成功!",
            "failed": "设置失败!"
        },
        "uploadToastType": {
            "success": "上传成功!",
            "failed": "上传失败!"
        },
        "downloadToastType": {
            "success": "下载成功!",
            "failed": "下载失败!"
        },

        "addToastType": {
            "success": "添加成功!",
            "failed": "添加失败!"
        },
        "modifyToastType": {
            "success": "修改成功!",
            "failed": "修改失败!"
        },

        "meErrMsg": {
            "amount": "\n请输入正确的数量!",
            "unit_price": "\n请输入正确的"
        },
        "teErrMsg": {
            "points": "\n请输入正确的点数!"
        },
        "tceErrMsg": {
            "points": "\n请输入正确的点数!",
            "amount": "\n请输入正确的次数!"
        },

        "tceDoneText": {
            "task": "记录成功! 点数 + ",
            "desire": "记录成功! 点数 - "
        },

        "rmFac": {

            "moneyPop": "你确定要删除这条记录吗?",
            "moneyToast": "删除成功!",
            "taskPop": function(msg, type) {
                var taskType = "";
                if (type === "task")
                    taskType = "任务";
                else if (type === "desire")
                    taskType = "欲望";
                else
                    taskType = "备忘";
                if (msg === "delete")
                    msg = "删除";
                else
                    msg = "归档";
                return "你确定要" + msg + "这个" + taskType + "吗?";
            },
            "taskToast": function(msg) {
                if (msg === "delete")
                    msg = "删除";
                else
                    msg = "归档";
                return msg + "成功!";
            },
            "aTaskPop": "确认删除?",
            "aTaskToast": "删除成功!",
            "templatesPop": "你确定要删除这个模板吗?",
            "templatesToast": "删除成功!",
            "tagPop": function(msg) {
                return "确认删除 '" + msg + "' 这个标签?";
            },
            "tagToast": "删除成功!",

            "err_type": function(type) {
                if (type === "output")
                    return "单价";
                return "数额";
            },
            "err_msg": function(type) {
                if (type === "amount")
                    return "\n请输入正确的数量!";
                return "\n请输入正确的";
            },
            "toast": function(type, msg, err_msg) {
                if (msg === "save")
                    msg = "保存";
                else
                    msg = "记录";
                if (type === "success")
                    return msg + "成功!";
                return msg + "失败!" + err_msg;
            }

        },
        "gmFac": {
            "oTitle": "支出",
            "iTitle": "收入"
        },

        "loading": {
            "loading": "加载中"
        },
        "exit": {
            "exit": "再按一次退出"
        }

    };
    langFac.en = {

        "mForm": {
            "outputTitle": "Expenditure",
            "outputContent1": "Unit-Price",
            "outputContent2": "Quantity",
            "outputContent3": "Description",
            "incomeTitle": "Income",
            "incomeContent1": "Amount",
            "incomeContent2": "Description"
        },
        "tForm": {
            "taskTitle": "New Task",
            "taskContent1": "Description",
            "taskContent2": "pt. +",
            "desireTitle": "New Desire",
            "desireContent1": "Description",
            "desireContent2": "pt. -",
            "memoTitle": "New Memo"
        },

        "ma": {
            "viewTitle": "Add Financial Record",
            "output": "Expenditure Record",
            "income": "Income Record",
            "placeholder1": "No tags yet...",
            "save": "Save Template",
            "load": "Load Template",
            "placeholder2": "Enter a tag...",
            "placeholder3": "Select a tag..."
        },
        "mc": {
            "viewTitle": "Check Financial Records",
            "focus": "Focus",
            "all": "All",
            "output": "Expenditure",
            "income": "Income",
            "filter": "Filter",
            "tag": "Tag",
            "date": "Date",
            "event": "Description",
            "amount": "Amount",
            "time": "Time",
            "delete": "Delete"
        },
        "mce": {
            "viewTitle": "Edit Record",
            "date": "Date",
            "time": "Time",
            "event": "Description",
            "amount": "Quantity",
            "placeholder1": "No tags yet...",
            "placeholder2": "Enter a tag...",
            "placeholder3": "Select a tag..."
        },
        "mg": {
            "viewTitle": "Analytics",
            "focus": "Focus",
            "addUp": "Adding Up",
            "filter": "Filter",
            "date": "Date",
            "placeholder1": "No tags specified yet...",
            "placeholder2": "Select a tag...",
            "dType": function(tab) {
                if (tab === 1)
                    return "Analytics for that Day";
                return "Adding up each Day's Records";
            },
            "wType": function(tab) {
                if (tab === 1)
                    return "Analytics for that Week";
                return "Adding up each Week's Records";
            },
            "mType": function(tab) {
                if (tab === 1)
                    return "Analytics for that Month";
                return "Adding up each Month's Records";
            },
            "yType": function(tab) {
                if (tab === 1)
                    return "Analytics for that Year";
                return "Adding up each Year's Records";
            }
        },
        "mt": {
            "viewTitle": "Check Templates",
            "type": "Type",
            "all": "All",
            "output": "Expenditure",
            "income": "Income",
            "filter": "Filter",
            "tag": "Tag",
            "event": "Description",
            "amount": "Amount",
            "delete": "Delete"
        },
        "mte": {
            "viewTitle": "Edit Template",
            "amount": "Quantity",
            "event": "Description",
            "placeholder1": "No tags yet...",
            "apply": "Apply",
            "placeholder2": "Enter a tag...",
            "placeholder3": "Select a tag..."
        },
        "mtd": {
            "viewTitle": "Add Financial Record",
            "recOutput": "Expenditure Record",
            "unitPrice": "Unit-Price",
            "quantity": "Quantity",
            "oEvent": "Description",
            "placeholder1": "No tags yet...",
            "recIncome": "Income Record",
            "amount": "Amount",
            "iEvent": "Description",
            "placeholder2": "Enter a tag...",
            "placeholder3": "Select a tag..."
        },

        "ta": {
            "viewTitle": "Add Event",
            "task": "New Task",
            "desire": "New Desire",
            "memo": "New Memo"
        },
        "tc": {
            "viewTitle": "Check Events",
            "task": "Tasks",
            "desire": "Desires",
            "time": "",
            "updateTime": "Update Time",
            "delete": "Delete"
        },
        "tce": {
            "viewTitle": "Detail",
            "event": "Description",
            "time": ""
        },
        "tm": {
            "viewTitle": "Check Memo",
            "time": "Update Time",
            "delete": "Delete"
        },
        "tme": {
            "viewTitle": "Edit Memo"
        },
        "ts": {
            "viewTitle": "Archived Events",
            "task": "Task",
            "desire": "Desire",
            "time": "",
            "archiveTime": "Archive Time",
            "delete": "Delete"
        },
        "tsd": {
            "viewTitle": "Detail",
            "event": "Description",
            "time": "",
            "doneTimes": " Time(s)"
        },

        "home": {
            "viewTitle": "Home",
            "sTitle": "Summary",
            "expenditure": "Expenditure",
            "income": "Income",
            "ptLeft": "pt. Left",
            "latestMemo": "Latest Memo",
            "userInfo": "User Info",
            "username": "Username",
            "yIncome": "Income"
        },
        "login": {
            "title": "Log In",
            "username": "Username",
            "password": "Password"
        },
        "recent": {
            "viewTitle": "Today's Account",
            "mAccount": "Finance",
            "tAccount": "Event",
            "mTitle": "Today's Financial Summary",
            "sumOutput": "Total Expenditure",
            "sumIncome": "Total Income",
            "output": "Expenditure",
            "income": "Income",
            "amount": "Amount",
            "mDetail": "Details",
            "tTitle": "Today's Event Summary",
            "sumPtGet": "Total pt. Gained",
            "sumPtLost": "Total pt. Lost",
            "tDetail": "Details",
            "time": "Time",
            "today": "",
            "todayAmount": "",
            "todayTime": "Time(s)"
        },
        "register": {
            "title": "Register",
            "username": "Username",
            "password": "Password"
        },
        "setting": {
            "title": "Setting",
            "lang": "Language",
            "avatar": "Avatar",
            "username": "Username",
            "yIncome": "Income"
        },
        "sidebar": {
            "title": "Navigation",
            "home": "Home",
            "today": "Today's Account",
            "mAccount": "Financial Account",
            "ma": "Add Record",
            "mc": "Check Records",
            "mt": "Check Templates",
            "mg": "Analytics",
            "tAccount": "Event Account",
            "ta": "Add Event",
            "tc": "Check Events",
            "tm": "Check Memo",
            "ts": "Archived",
            "services": "Services",
            "login": "Log in",
            "register": "Register",
            "setting": "Settings",
            "sync": "Sync"
        },
        "sync": {
            "upload": "Upload",
            "download": "Download"
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
            "success": "Registration Succeeded!",
            "failed": "Registration Failed!"
        },
        "loginToastType": {
            "success": "Log In Successfully!",
            "failed": "Log In Failed!"
        },
        "settingToastType": {
            "success": "Updated!",
            "failed": "Failed!"
        },
        "uploadToastType": {
            "success": "Upload Completed!",
            "failed": "Upload Failed!"
        },
        "downloadToastType": {
            "success": "Download Completed!",
            "failed": "Download Failed!"
        },

        "addToastType": {
            "success": "Added!",
            "failed": "Failed!"
        },
        "modifyToastType": {
            "success": "Modified!",
            "failed": "Failed!"
        },

        "meErrMsg": {
            "amount": "\nPlease provide a validate number for Quantity!",
            "unit_price": "\nPlease provide a validate number for "
        },
        "teErrMsg": {
            "points": "\nPlease provide a validate number for pt.!"
        },
        "tceErrMsg": {
            "points": "\nPlease provide a validate number for Points!",
            "amount": "\nPlease provide a validate number for Achieved!"
        },

        "tceDoneText": {
            "task": "pt. + ",
            "desire": "pt. - "
        },

        "rmFac": {
            "moneyPop": "Confirm Deletion?",
            "moneyToast": "Deleted Successfully!",
            "taskPop": function(msg, type) {
                var taskType = "";
                if (type === "task")
                    taskType = "Task";
                else if (type === "desire")
                    taskType = "Desire";
                else
                    taskType = "Memo";
                if (msg === "delete")
                    msg = "Deleting";
                else
                    msg = "Archiving";
                return "Confirm " + msg + " this " + taskType + "?";
            },
            "taskToast": function(msg) {
                if (msg === "delete")
                    msg = "Deleted";
                else
                    msg = "Archived";
                return msg + " Successfully!";
            },
            "aTaskPop": "Confirm Deletion?",
            "aTaskToast": "Deleted Successfully!",
            "templatesPop": "Confirm Deletion?",
            "templatesToast": "Deleted Successfully!",
            "tagPop": function(msg) {
                return "Confirm Deleting tag '" + msg + "'?";
            },
            "tagToast": "Deleted Successfully!",

            "err_type": function(type) {
                if (type === "output")
                    return "Unit-Price";
                return "Amount";
            },
            "err_msg": function(type) {
                if (type === "amount")
                    return "\nPlease provide a validate number for Quantity!";
                return "\nPlease provide a validate number for ";
            },
            "toast": function(type, msg, err_msg) {
                var sMsg, fMsg;
                if (msg === "save") {
                    sMsg = "Saved Successfully!";
                    fMsg = "Saved Failed!"
                } else {
                    sMsg = "Recorded!";
                    fMsg = "Failed!";
                }
                if (type === "success")
                    return sMsg;
                return fMsg + err_msg;
            }
        },
        "gmFac": {
            "oTitle": "Expenditure",
            "iTitle": "Income"
        },

        "loading": {
            "loading": "Loading"
        },
        "exit": {
            "exit": "Press again to Exit"
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