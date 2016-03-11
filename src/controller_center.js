var _ = require('lodash');
var Item = require('./model/item');


function ControllerCenter() {
    this.allItems = [
        new Item('ITEM000000', '可口可乐', '瓶', 3.00),
        new Item('ITEM000001', '羽毛球', '个', 1.00),
        new Item('ITEM000002', '苹果', '斤', 5.50)
    ];
}

/**
 * @method shoppingCart
 * @description 控制中心购物车模块，用于将扫描仪扫描的json数据结合商品库丰富为可用于计算的数据
 * @param input
 * @returns {*}
 */
ControllerCenter.prototype.shoppingCart = function (input) {
    var self = this;
    return _.chain(input).groupBy(function (o) {
        return o;
    }).map(function (value, key) {
        var bar = key, count = value.length;
        if (key.indexOf('-') > -1) {
            var barAndCount = key.split('-');
            bar = barAndCount[0];
            count = +barAndCount[1];
        }
        return {barcode: bar, count: count};
    }).map(function (ele) {
        var item = _.find(self.allItems, function (item) {
            return item.barcode === ele.barcode;
        });
        if (item) return {barcode: item.barcode, count: ele.count, unit: item.unit, price: item.price, name: item.name};
    }).compact().value();
};

/**
 * @method _getCurrentUsePrivilegeForHandlePrivilege
 * @description 根据打折优惠条件的数组，返回优惠登记priority优先级较高的对象
 * @param arr
 * @returns {*}
 * @private
 */
ControllerCenter.prototype._getCurrentUsePrivilegeForHandlePrivilege = function (arr) {
    var rules = _.clone(arr);
    rules = _.sortBy(rules, function (rule) {
        return rule.priority;
    });
    return rules[0];
};


/**
 * @method _addPrivilegeToItemForCalculator
 * @description 遍历购买商品，判定添加privilege对象
 * @param box
 * @param privilege
 * @private
 */
ControllerCenter.prototype._addPrivilegeToItemForCalculator = function (box, privilege) {
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
};


/**
 * @method _handlePrivilegeItemForCalculator
 * @description 计价模块处理带有优惠属性的商品
 * @param item
 * @param gift
 * @param closingData
 * @private
 */
ControllerCenter.prototype._handlePrivilegeItemForCalculator = function (item, gift, closingData) {
    var currentUsePrivilege = this._getCurrentUsePrivilegeForHandlePrivilege(item.privilege);
    if (currentUsePrivilege.name === 'two_gift_one') {
        var giftCount = Math.floor(item.count / 3);
        if (giftCount >= 1) {
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
};

/**
 * @method _calculateForCalculator
 * @description 商品计价主流程
 * @param box
 * @param closingData
 * @private
 */
ControllerCenter.prototype._calculateForCalculator = function (box, closingData) {
    var gift = {}, total = 0, self = this;
    box.forEach(ele => {
        if (ele.privilege) self._handlePrivilegeItemForCalculator(ele, gift, closingData);
        else ele.subtotal = ele.count * ele.price;
        if (ele.barcode) delete ele.barcode;
        if (ele.privilege) delete ele.privilege;
        closingData.items.push(ele);
        total += ele.subtotal;
    });
    if (gift.name) closingData.present = [gift];
    closingData.total = total;
};

/**
 * @method calculator
 * @description 计价模块
 * @param box
 * @param privilege
 * @returns {{items: Array}}
 */
ControllerCenter.prototype.calculator = function (box, privilege) {
    var self = this, closingData = {items: []};
    if (privilege) self._addPrivilegeToItemForCalculator(box, privilege);
    self._calculateForCalculator(box, closingData);
    return closingData;
};

/**
 * @method print
 * @description 控制中心打印模块，用于将计算好的数据进行控制台打印输出
 * @param box
 * @returns {string}
 */
ControllerCenter.prototype.print = function (box) {
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