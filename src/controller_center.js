function ControllerCenter() {


}


ControllerCenter.print = function (box) {
    function getStrOfPrice(price) {
        var mark = Math.ceil(price) > price;
        return mark ? price + '0' : price + '.00';
    }

    var head = '***<没钱赚商店>购物清单***\n';
    var middle = '';
    box.items.forEach(ele => {
        middle += '名称：' + ele.name + '，数量：' + ele.count + ele.unit + '，单价：' + getStrOfPrice(ele.price) + '(元)，小计：' + getStrOfPrice(ele.subtotal) + '(元)\n';
    });
    var tail = '----------------------\n' +
        '总计：' + getStrOfPrice(box.total) + '(元)\n' +
        '**********************\n';
    return head + middle + tail;
};


module.exports = ControllerCenter;