const Stack = require("./Stack");
let Stack1 = new Stack.Stack();
const directions = ['down', 'right', 'up', 'left'];
function Block(hang, lie, value) {
    //从0 开始
    this.hang = hang;
    this.lie = lie;
    this.value = value;//0,1
    this.previous = null;//前继
    this.block_order = 0;//加入的顺序

    this.youmeiyou_beifangwenguo = false
}
function find_path(start, end, ditu) {
    // 初始化，将起点加入堆栈；
    let map_block = [];
    let qi_dian_hang = 0;
    let qi_dian_lie = 0;
    let zhong_dian_hang = 0;
    let zhong_dian_lie = 0;
    for (let i = 0; i < ditu.length; i++) {
        map_block[i] = [];
        for (let j = 0; j < ditu[i].length; j++) {
            if (start.hang === i && start.lie === j) {
                qi_dian_hang = i;
                qi_dian_lie = j;
            } else if ((end.hang === i && end.lie === j)) {
                zhong_dian_hang = i;
                zhong_dian_lie = j;
            }
            map_block[i].push(new Block(i, j, ditu[i][j]));
        }
    }
    Stack1.push(map_block[qi_dian_hang][qi_dian_lie]);
    //map_block[qi_dian_hang][qi_dian_lie].youmeiyou_beifangwenguo = true;
    let res = [];
    while (!Stack1.isEmpty()) {
        let dangqian = Stack1.peek();
        if (tell_isame_position(dangqian, map_block[zhong_dian_hang][zhong_dian_lie])) {
            // 差不多找到路么了, 而且这个路径就是栈里面存的东西

            let x = map_block[zhong_dian_hang][zhong_dian_lie].hang;
            let y = map_block[zhong_dian_hang][zhong_dian_lie].lie;;
            while (!Stack1.isEmpty()) {
                // let temp = Stack1.pop();

                // res.push(temp);
                let cell = Stack1.pop();
                let cell_x = cell.hang;
                let cell_y = cell.lie;
                // 要注意的是，只有和上一次的cell相邻的cell才是路径上的通道
                if (Math.abs(cell_x - x) + Math.abs(cell_y - y) <= 1) {
                    res.unshift(cell);//从头部插入
                }
                x = cell_x;
                y = cell_y;
            }

            return res;
        }
        else {
            // 向四个方向探索
            let isDead = true;
            for (let i in directions) {
                let t_dir = directions[i];
                let next_position = findNextPoint(dangqian, t_dir, map_block);

                if (next_position && next_position.value != 1 && !next_position.youmeiyou_beifangwenguo) {
                    next_position.youmeiyou_beifangwenguo = true;
                    Stack1.push(next_position);
                    console.log(`位置行:${next_position.hang} 列: ${next_position.lie} 入栈`);
                    isDead = false;
                }
            }
            // 四个方向都不能走，则该点为死胡同，出栈
            if (isDead) {
                let k = Stack1.pop();
                console.log(`位置行:${k.hang} 列: ${k.lie} 出栈`);
            }
        }
    }


}
//判断两个点是不是同一个位置 
function tell_isame_position(pos1, pos2) {
    return pos1.hang === pos2.hang && pos1.lie === pos2.lie;
}
//根据传进来的点 找到下一个方向的点 
function findNextPoint(chuanjinliadedain, xiayigefangxiang, ditu) {
    let hang = chuanjinliadedain.hang;
    let lie = chuanjinliadedain.lie;
    let next_hang = hang;
    let next_lie = lie;
    if (xiayigefangxiang == "up") {
        next_hang = hang - 1;
    }
    else if (xiayigefangxiang == "down") {
        next_hang = hang + 1;
    }
    else if (xiayigefangxiang == 'left') {
        next_lie = lie - 1;
    }
    else if (xiayigefangxiang == 'right') {
        next_lie = lie + 1;
    }
    //找出四个边界
    let up_edge = 0;
    let down_edge = ditu.length - 1;
    let left_dege = 0;
    let right_edge = ditu[0].length - 1;

    //行,列跟边界去比较
    if (/*超出边界 直接返回空*/next_hang < up_edge || next_hang > down_edge || next_lie < left_dege || next_lie > right_edge) {
        return null;
    }

    //
    return ditu[next_hang][next_lie]
}

//统一接口名字, 这样别人只用记一个名字
module.exports.find_path = find_path;