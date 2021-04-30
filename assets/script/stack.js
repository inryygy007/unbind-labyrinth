//创建栈
function Stack() {
    let items = []
    //添加一个
    this.push = function (element) {
        items.push(element)
    }
    //拿出一个
    this.pop = function () {
        return items.pop()
    }
    //返回最后一个
    this.peek = function () {
        return items[items.length - 1]
    }
    //是不是空的栈
    this.isEmpty = function () {
        return items.length === 0
    }
    //当前数组的长度
    this.size = function () {
        return items.length
    }
    //清除数组
    this.clear = function () {
        items = []
    }
    //打印数组里的数
    this.print = function () {
        console.log(items.toString())
        return items.toString();
    }
    //返回内置的数组
    this.getItem = function () {
        return items;
    }
}
//导出方法
module.exports.Stack = Stack;