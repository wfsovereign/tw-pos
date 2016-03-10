var _ = require('lodash');

function ControllerCenter() {


}




ControllerCenter.calculator = function (box, privilege) {
    console.log('privilege: ', privilege);


    var closingData = {items: []}, total = 0, present = [], gift = {};
    if (privilege) {
        box.forEach(ele => {
            if (ele.barcode) {
                privilege.forEach(p => {
                    if (p.barcodes.indexOf(ele.barcode) > -1) {
                        ele.privilege = ele.privilege || [];
                        ele.privilege.push({name: p.name, showName: p.showName, priority: p.priority});
                    }
                });
            }
        });
    }
    function handlePrivilegeItem(item) {
        var currentUsePrivilege = getCurrentUsePrivilege(item.privilege);
        if (currentUsePrivilege.name === 'two_gift_one') {
            var giftCount = Math.floor(item.count / 3);
            if (giftCount >= 1) {
                console.log('gift count: ', giftCount);
                item.subtotal = (item.count - giftCount) * item.price;
                closingData.economy = closingData.economy || 0;
                closingData.economy += giftCount * item.price;
                gift.name = currentUsePrivilege.showName;
                gift.items = gift.items || [];
                gift.items.push({name: item.name, unit: item.unit, count: giftCount});
            }
        } else if (currentUsePrivilege.name = 'discount_of_95') {
            var subtotal = item.count * item.price;
            item.subtotal = subtotal * 0.95;
            item.economize = subtotal * 0.05;
            closingData.economy = closingData.economy || 0;
            closingData.economy += item.economize;
        }

        present = [gift];

        function getCurrentUsePrivilege(arr) {
            var rules = _.clone(arr);
            rules = _.sortBy(rules, function (rule) {
                return rule.priority;
            });
            return rules[0];
        }
    }

    //console.log('boxxxxxx', JSON.stringify(box));
    box.forEach(ele => {
        if (ele.privilege) handlePrivilegeItem(ele);
        else ele.subtotal = ele.count * ele.price;
        if (ele.barcode) delete ele.barcode;
        if (ele.privilege) delete ele.privilege;
        closingData.items.push(ele);
        total += ele.subtotal;
    });
    closingData.total = total;
    if (present[0] && present[0].name) closingData.present = present;
    console.log('-------------------------');

    console.log('closing data: ', JSON.stringify(closingData));
    return closingData;
};


ControllerCenter.print = function (box) {
    function getStrOfPrice(price) {
        return price.toFixed(2);
    }

    function economizeStr(price) {
        if (price) return '，节省' + getStrOfPrice(price) + '(元)';
        return '';
    }

    var head = '***<没钱赚商店>购物清单***\n', splitLine = '----------------------\n';
    var middle = '';
    box.items.forEach(ele => {
        middle += '名称：' + ele.name + '，数量：' + ele.count + ele.unit + '，单价：' + getStrOfPrice(ele.price) + '(元)，小计：' + getStrOfPrice(ele.subtotal) + '(元)' + economizeStr(ele.economize) + '\n';
    });
    var additionMiddle = '';
    if (box.present) {
        additionMiddle += splitLine;
        box.present.forEach((ele) => {
            additionMiddle += ele.name + '商品：\n';
            ele.items.forEach((l) => {
                additionMiddle += '名称：' + l.name + '，数量：' + l.count + l.unit + '\n';
            });
        });
    }
    var tail = splitLine +
        '总计：' + getStrOfPrice(box.total) + '(元)\n';
    var additionTail = '';
    if (box.economy) additionTail += '节省：' + getStrOfPrice(box.economy) + '(元)\n';
    var end = '**********************\n';

    return head + middle + additionMiddle + tail + additionTail + end;
};


module.exports = ControllerCenter;