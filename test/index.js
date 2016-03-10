var should = require('should');
var Item = require('../src/model/item');
var Privilege = require('../src/model/privilege');
var controllerCenter = require('../src/controller_center');
var scanner = require('../src/scanner');
var AllItem = [
    new Item('ITEM000000', '可口可乐', '瓶', 3.00),
    new Item('ITEM000001', '羽毛球', '个', 1.00),
    new Item('ITEM000002', '苹果', '斤', 5.50)
];


describe('ThoughtWorks homework', function () {
    var result1 = '***<没钱赚商店>购物清单***\n' +
        '名称：可口可乐，数量：3瓶，单价：3.00(元)，小计：9.00(元)\n' +
        '名称：羽毛球，数量：5个，单价：1.00(元)，小计：5.00(元)\n' +
        '名称：苹果，数量：2斤，单价：5.50(元)，小计：11.00(元)\n' +
        '----------------------\n' +
        '总计：25.00(元)\n' +
        '**********************\n';

    var result2 = '***<没钱赚商店>购物清单***\n' +
        '名称：可口可乐，数量：3瓶，单价：3.00(元)，小计：6.00(元)\n' +
        '名称：羽毛球，数量：5个，单价：1.00(元)，小计：4.00(元)\n' +
        '名称：苹果，数量：2斤，单价：5.50(元)，小计：11.00(元)\n' +
        '----------------------\n' +
        '买二赠一商品：\n' +
        '名称：可口可乐，数量：1瓶\n' +
        '名称：羽毛球，数量：1个\n' +
        '----------------------\n' +
        '总计：21.00(元)\n' +
        '节省：4.00(元)\n' +
        '**********************\n';

    var result3 = '***<没钱赚商店>购物清单***\n' +
        '名称：可口可乐，数量：3瓶，单价：3.00(元)，小计：9.00(元)\n' +
        '名称：羽毛球，数量：5个，单价：1.00(元)，小计：5.00(元)\n' +
        '名称：苹果，数量：2斤，单价：5.50(元)，小计：10.45(元)，节省0.55(元)\n' +
        '----------------------\n' +
        '总计：24.45(元)\n' +
        '节省：0.55(元)\n' +
        '**********************\n';

    var result4 = '***<没钱赚商店>购物清单***\n' +
        '名称：可口可乐，数量：3瓶，单价：3.00(元)，小计：6.00(元)\n' +
        '名称：羽毛球，数量：6个，单价：1.00(元)，小计：4.00(元)\n' +
        '名称：苹果，数量：2斤，单价：5.50(元)，小计：10.45(元)，节省0.55(元)\n' +
        '----------------------\n' +
        '买二赠一商品：\n' +
        '名称：可口可乐，数量：1瓶\n' +
        '名称：羽毛球，数量：2个\n' +
        '----------------------\n' +
        '总计：20.45(元)\n' +
        '节省：5.55(元)\n' +
        '**********************\n';

    it('1 结果等于结果，初始化测试', function (done) {
        should(result1).eql(result1);
        done();
    });


    it('2 控制中心用作打印的模块，无优惠商品', function (done) {
        var box = {
            items: [
                {name: '可口可乐', count: 3, unit: '瓶', price: 3.00, subtotal: 9.00},
                {name: '羽毛球', count: 5, unit: '个', price: 1.00, subtotal: 5.00},
                {name: '苹果', count: 2, unit: '斤', price: 5.50, subtotal: 11.00}
            ],
            total: 25.00
        };

        var printResult = controllerCenter.print(box);
        should(printResult).eql(result1);
        done()
    });

    it('3 控制中心用作打印的模块，有符合“买二赠一”优惠条件商品', function (done) {
        var box = {
            items: [
                {name: '可口可乐', count: 3, unit: '瓶', price: 3.00, subtotal: 6.00},
                {name: '羽毛球', count: 5, unit: '个', price: 1.00, subtotal: 4.00},
                {name: '苹果', count: 2, unit: '斤', price: 5.50, subtotal: 11.00}
            ],
            present: [{
                name: '买二赠一',
                items: [
                    {name: '可口可乐', count: 1, unit: '瓶'},
                    {name: '羽毛球', count: 1, unit: '个'}]
            }],
            total: 21.00,
            economy: 4.00
        };

        var printResult = controllerCenter.print(box);
        should(printResult).eql(result2);
        done()
    });

    it('4 控制中心用作打印的模块，有符合“95折”优惠条件商品', function (done) {
        var box = {
            items: [
                {name: '可口可乐', count: 3, unit: '瓶', price: 3.00, subtotal: 9.00},
                {name: '羽毛球', count: 5, unit: '个', price: 1.00, subtotal: 5.00},
                {name: '苹果', count: 2, unit: '斤', price: 5.50, subtotal: 10.45, economize: 0.55}
            ],
            total: 24.45,
            economy: 0.55
        };

        var printResult = controllerCenter.print(box);
        should(printResult).eql(result3);
        done()
    });

    it('5 控制中心用作打印的模块，有符合“95折”优惠条件的商品，又有符合“买二赠一”优惠条件商品', function (done) {
        var box = {
            items: [
                {name: '可口可乐', count: 3, unit: '瓶', price: 3.00, subtotal: 6.00},
                {name: '羽毛球', count: 6, unit: '个', price: 1.00, subtotal: 4.00},
                {name: '苹果', count: 2, unit: '斤', price: 5.50, subtotal: 10.45, economize: 0.55}
            ],
            present: [{
                name: '买二赠一',
                items: [
                    {name: '可口可乐', count: 1, unit: '瓶'},
                    {name: '羽毛球', count: 2, unit: '个'}]
            }],
            total: 20.45,
            economy: 5.55
        };

        var printResult = controllerCenter.print(box);
        should(printResult).eql(result4);
        done()
    });


    it('6 控制中心的计价模块, 没有符合“买二赠一”优惠条件的商品', function (done) {
        var box = [
            {name: '可口可乐', count: 3, unit: '瓶', price: 3.00},
            {name: '羽毛球', count: 6, unit: '个', price: 1.00},
            {name: '苹果', count: 2, unit: '斤', price: 5.50}
        ];
        var expireBox = {
            items: [
                {name: '可口可乐', count: 3, unit: '瓶', price: 3.00, subtotal: 9.00},
                {name: '羽毛球', count: 6, unit: '个', price: 1.00, subtotal: 6.00},
                {name: '苹果', count: 2, unit: '斤', price: 5.50, subtotal: 11.00}
            ],
            total: 26.00
        };
        var calculatedBox = controllerCenter.calculator(box);
        should(calculatedBox).eql(expireBox);
        done();
    });


    it('7 控制中心的计价模块, 有符合“买二赠一”优惠条件的商品', function (done) {
        var box = [
            {name: '可口可乐', count: 3, unit: '瓶', price: 3.00, barcode: 'ITEM000000'},
            {name: '羽毛球', count: 5, unit: '个', price: 1.00, barcode: 'ITEM000001'},
            {name: '苹果', count: 2, unit: '斤', price: 5.50, barcode: 'ITEM000002'}
        ];
        var privilege = [new Privilege('two_gift_one', '买二赠一', 1, ['ITEM000000', 'ITEM000001'])];
        var expireBox = {
            items: [
                {name: '可口可乐', count: 3, unit: '瓶', price: 3.00, subtotal: 6.00},
                {name: '羽毛球', count: 5, unit: '个', price: 1.00, subtotal: 4.00},
                {name: '苹果', count: 2, unit: '斤', price: 5.50, subtotal: 11.00}
            ],
            present: [{
                name: '买二赠一',
                items: [
                    {name: '可口可乐', count: 1, unit: '瓶'},
                    {name: '羽毛球', count: 1, unit: '个'}]
            }],
            total: 21.00,
            economy: 4.00
        };
        var calculatedBox = controllerCenter.calculator(box, privilege);
        should(calculatedBox).eql(expireBox);
        done();
    });


    it('8 控制中心的计价模块, 有符合“95折”优惠条件的商品', function (done) {
        var box = [
            {name: '可口可乐', count: 3, unit: '瓶', price: 3.00, barcode: 'ITEM000000'},
            {name: '羽毛球', count: 5, unit: '个', price: 1.00, barcode: 'ITEM000001'},
            {name: '苹果', count: 2, unit: '斤', price: 5.50, barcode: 'ITEM000002'}
        ];
        var privilege = [new Privilege('discount_of_95', '95折', 1, ['ITEM000002'])];
        var expireBox = {
            items: [
                {name: '可口可乐', count: 3, unit: '瓶', price: 3.00, subtotal: 9.00},
                {name: '羽毛球', count: 5, unit: '个', price: 1.00, subtotal: 5.00},
                {name: '苹果', count: 2, unit: '斤', price: 5.50, subtotal: 10.45, economize: 0.55}
            ],
            total: 24.45,
            economy: 0.55
        };
        var calculatedBox = controllerCenter.calculator(box, privilege);
        should(calculatedBox).eql(expireBox);
        done();
    });


    it('9 控制中心的计价模块, 有符合“买二赠一”优惠条件，又有符合“95折”优惠条件的商品，不冲突', function (done) {
        var box = [
            {name: '可口可乐', count: 3, unit: '瓶', price: 3.00, barcode: 'ITEM000000'},
            {name: '羽毛球', count: 6, unit: '个', price: 1.00, barcode: 'ITEM000001'},
            {name: '苹果', count: 2, unit: '斤', price: 5.50, barcode: 'ITEM000002'}
        ];
        var privilege = [
            new Privilege('discount_of_95', '95折', 2, ['ITEM000002']),
            new Privilege('two_gift_one', '买二赠一', 1, ['ITEM000000', 'ITEM000001'])];
        var expireBox = {
            items: [
                {name: '可口可乐', count: 3, unit: '瓶', price: 3.00, subtotal: 6.00},
                {name: '羽毛球', count: 6, unit: '个', price: 1.00, subtotal: 4.00},
                {name: '苹果', count: 2, unit: '斤', price: 5.50, subtotal: 10.45, economize: 0.55}
            ],
            present: [{
                name: '买二赠一',
                items: [
                    {name: '可口可乐', count: 1, unit: '瓶'},
                    {name: '羽毛球', count: 2, unit: '个'}]
            }],
            total: 20.45,
            economy: 5.55
        };
        var calculatedBox = controllerCenter.calculator(box, privilege);
        should(calculatedBox).eql(expireBox);
        done();
    });


    it('10 控制中心的计价模块, 有符合“买二赠一”优惠条件，又有符合“95折”优惠条件的商品，冲突，以“买二赠一”优惠条件优先', function (done) {
        var box = [
            {name: '可口可乐', count: 3, unit: '瓶', price: 3.00, barcode: 'ITEM000000'},
            {name: '羽毛球', count: 6, unit: '个', price: 1.00, barcode: 'ITEM000001'},
            {name: '苹果', count: 2, unit: '斤', price: 5.50, barcode: 'ITEM000002'}
        ];
        var privilege = [
            new Privilege('discount_of_95', '95折', 2, ['ITEM000002', 'ITEM000000']),
            new Privilege('two_gift_one', '买二赠一', 1, ['ITEM000000', 'ITEM000001'])];
        var expireBox = {
            items: [
                {name: '可口可乐', count: 3, unit: '瓶', price: 3.00, subtotal: 6.00},
                {name: '羽毛球', count: 6, unit: '个', price: 1.00, subtotal: 4.00},
                {name: '苹果', count: 2, unit: '斤', price: 5.50, subtotal: 10.45, economize: 0.55}
            ],
            present: [{
                name: '买二赠一',
                items: [
                    {name: '可口可乐', count: 1, unit: '瓶'},
                    {name: '羽毛球', count: 2, unit: '个'}]
            }],
            total: 20.45,
            economy: 5.55
        };
        var calculatedBox = controllerCenter.calculator(box, privilege);
        should(calculatedBox).eql(expireBox);
        done();
    });


    it('11 收银机扫描仪模块，将文本数据转化为JSON数据', function (done) {
        var expireData = ['ITEM000001', 'ITEM000001', 'ITEM000001', 'ITEM000001', 'ITEM000001',
            'ITEM000003-2', 'ITEM000005', 'ITEM000005', 'ITEM000005'];
        var scannedData = scanner(require('path').join(__dirname, '../src/data/input.txt'));
        should(scannedData).eql(expireData);
        done();
    });


    it('12 控制中心购物车模块，将收银机传入的数据转化为可用于计算的数据（附带count）', function (done) {
        var originalData = ['ITEM000001', 'ITEM000001', 'ITEM000001', 'ITEM000001', 'ITEM000001',
            'ITEM000002-2', 'ITEM000000', 'ITEM000000', 'ITEM000000'];
        var expireData = [{name: '羽毛球', count: 5, unit: '个', price: 1.00, barcode: 'ITEM000001'},
            {name: '苹果', count: 2, unit: '斤', price: 5.50, barcode: 'ITEM000002'},
            {name: '可口可乐', count: 3, unit: '瓶', price: 3.00, barcode: 'ITEM000000'}];
        var cartData = controllerCenter.shoppingCart(originalData);
        should(cartData).eql(expireData);
        done();
    });

});