var ControllerCenter = require("./controller_center");
var Scanner = require("./scanner");
var Privilege = require('./model/privilege');
var scannedData = Scanner(require('path').join(__dirname, './data/input2.txt'));
var controllerCenter = new ControllerCenter();
var privilege = [
    new Privilege('discount_of_95', '95折', 2, ['ITEM000002', 'ITEM000000']),
    new Privilege('two_gift_one', '买二赠一', 1, ['ITEM000000', 'ITEM000001'])];

var bill = controllerCenter.autoExecute(scannedData, privilege);

console.log(bill);