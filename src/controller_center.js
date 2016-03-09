function ControllerCenter() {


}


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