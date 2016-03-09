var should = require('should');
var Item = require('../src/model/item');
var privilege = require('../src/model/privilege');
var controllerCenter = require('../src/controller_center');


var AllItem = [
    new Item('ITEM000000', '可口可乐', '瓶', 3.00),
    new Item('ITEM000001', '羽毛球', '个', 1.00),
    new Item('ITEM000002', '苹果', '斤', 5.50)
];


describe('ThoughtWorks homework', function () {
    var result = '***<没钱赚商店>购物清单***\n' +
        '名称：可口可乐，数量：3瓶，单价：3.00(元)，小计：9.00(元)\n' +
        '名称：羽毛球，数量：5个，单价：1.00(元)，小计：5.00(元)\n' +
        '名称：苹果，数量：2斤，单价：5.50(元)，小计：11.00(元)\n' +
        '----------------------\n' +
        '总计：25.00(元)\n' +
        '**********************\n';

    it('结果等于结果，初始化测试', function (done) {
        should(result).eql(result);
        done();
    });


    it('抽出控制中心用作打印的模块', function (done) {
        var box = {
            items: [
                {name: '可口可乐', count: 3, unit: '瓶', price: 3.00, subtotal: 9.00},
                {name: '羽毛球', count: 5, unit: '个', price: 1.00, subtotal: 5.00},
                {name: '苹果', count: 2, unit: '斤', price: 5.50, subtotal: 11.00}
            ],
            total: 25.00
        };

        var printResult = controllerCenter.print(box);
        console.log(printResult);
        should(printResult).eql(result);
        done()
    });






});