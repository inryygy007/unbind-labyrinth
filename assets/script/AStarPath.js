

/**
 * 块
 * F 值, G+H 的和
 * G 值, 当前的点距离起点的一个准备的距离
 * H 值, 当前的点距离终点的一个估算的距离
 * 
 * 方法:
 * 获取估算值的方法
 * 
*/

//块的类型
const BlockType = {
    Blank: 0, //空格
    Wall: 1 //墙壁
};

// 方向数组
const direction_vec = [
    //向上一步的增量,就是行减1
    [-1, 0],//第一个代表行,第二个代表列
    //向下一步的增量,就是行加1
    [1, 0],
    //向左一步的增量,就是列减1
    [0, -1],
    //向右一步的增量,就是列加1
    [0, 1]

];

function Block(hang, lie, value) {
    this.G = 0;
    this.H = 0;
    this.F = 0;

    //从0 开始
    this.hang = hang;
    this.lie = lie;
    this.value = value;//0,1
    this.previous = null;//前继
    this.block_order = 0;//加入的顺序

    this.getF = function () {
        return this.F;
    }
}


/**
 * 算两个块之间的距离
 * 
 * 传入点1, 和点2 , 自动算出两点的距离 
*/

function calculate_distance(dot1, dot2) {
    return Math.abs(dot1.hang - dot2.hang) + Math.abs(dot1.lie - dot2.lie);
}

/**
 * 找到
 * S相邻的每一块可通行的方块T
*/
function find_adjcent_block(S, block_map) {
    let res = [];
    //上,下,左,右
    for (let i of direction_vec) {
        let new_hang = S.hang + i[0];
        let new_lie = S.lie + i[1];
        //如果不是墙壁就是可通行的块
        if (block_map[new_hang][new_lie].value != BlockType.Wall) {
            res.push(block_map[new_hang][new_lie]);//这
        }
    }
    return res;
}


/**
 * 计算一个块的和值
 * 输入当前点,起点,终点,地图,
*/
function calculate_sumof_F(current, start, end) {
    //距离起点 ///必须要通过它的前继来算的
    let s1 = current.previous.G + 1;
    //calculate_distance(current, start);
    //距离终点
    let s2 = calculate_distance(current, end);
    current.G = s1;
    current.H = s2;
    current.F = s1 + s2;
}

/**
 * 
 * 看一个数组里是否包含指定的块
*/
function is_contains(arr, block) {
    for (let i of arr) {
        if (i.hang == block.hang && i.lie == block.lie) {
            return true;
        }
    }

    return false;
}


/**
 * 在一个列中找到F 值最小的块 
*/

function find_lowest_F_block(arr) {
    if (!arr || arr.length === 0) {
        return null;
    }
    // 1. F值
    // 2. 如果F值相同, 就按照进入的顺序排序
    arr.sort((a, b) => {
        if (a.F == b.F) {
            return b.block_order - a.block_order;
        } else {
            return a.F - b.F;
        }
    });

    return arr[0];
}

let test_arr = [
    { F: 100, block_order: 0 },
    { F: 200, block_order: 1 },
    { F: 3, block_order: 100 },
    { F: 3, block_order: 6 },
    { F: 3, block_order: 3 },
    { F: 3, block_order: 5 },
]

/**
 * 地图
 * 起点
 * 终点
 * => 输出一条最短路径
*/
const map_arr = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1]
]

/**
 * 从close 列表中按照每个块的前继找到路径 
*/

function find_finalpath_inclose(start_block, close, final_path) {
    let ts = close[close.length - 1];//从最后一个开始
    do {
        final_path.unshift({ hang: ts.hang, lie: ts.lie });
        if (ts == start_block) {
            break;
        }

        ts = ts.previous;
    } while (true);
}

/**
 * 判定一个块在不在列表中 
*/
function is_block_in_list(block, list) {
    for (let x of list) {
        if (x.hang === block.hang && x.lie === block.lie) {
            return true;
        }
    }
    return false;
}


function find_path(start, end, map_arr) {
    //起点位置和终点的位置不能为墙壁
    let map_block = [];
    for (let i = 0; i < map_arr.length; i++) {
        map_block[i] = [];
        for (let j = 0; j < map_arr[i].length; j++) {
            map_block[i].push(new Block(i, j, map_arr[i][j]));
        }
    }
    let open = [];//open 列表
    let close = [];//close 列表


    let start_block = map_block[start.hang][start.lie];
    let end_block = map_block[end.hang][end.lie];

    let order = 0;
    open.push(start_block);
    let final_path = [];
    do {


        //重复以下步骤来找到最短路径
        //open 列表中F值最小的一个作为当前块
        let S = find_lowest_F_block(open);
        //map_block[start.hang][start.lie];
        //1. 将方块添加到open列表中，该列表有最小的和值。且将这个方块称为S吧。
        //
        let remove_eles = open.splice(0, 1);

        //2. 将S从open列表移除，然后添加S到closed列表中。
        let ts = remove_eles[0];
        close.push(ts);

        //如果close列表中包含了终点
        if (is_contains(close, end_block)) {
            //找到路径了 按照前继回退就是路
            find_finalpath_inclose(start_block, close, final_path);
            break;
        }

        //3. 对于与S相邻的每一块可通行的方块T：
        let ajacent_arr = find_adjcent_block(ts, map_block);
        if (ajacent_arr.length > 0) {
            for (let T of ajacent_arr) {
                //如果T在close列表中：不管它。
                if (is_block_in_list(T, close)) {//T in close
                    continue;
                }
                //如果T不在open列表中：添加它然后计算出它的和值。
                else if (!is_block_in_list(T, open)) {
                    T.previous = ts;//更新它的前继块
                    calculate_sumof_F(T, start_block, end_block);

                    T.block_order = order++;
                    open.push(T);//这里没进来
                }
                //如果T已经在open列表中：当我们使用当前生成的路径到达那里时，检查F 和值是否更小。如果是，更新它的和值和它的前继
                else if (is_block_in_list(T, open)) {
                    // 
                    let a = 100;
                    let b = a;
                }
            }
        }
    } while (open.length > 0);

    // let end_block = map_block[end.hang][end.lie];
    return final_path;
}


module.exports.find_path = find_path;
