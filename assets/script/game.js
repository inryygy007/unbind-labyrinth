const Stack = require("./stack");
const AStarPath = require("./AStarPath");//A星寻路
//保持命名风格
const NormalPath = require("./path");//普通寻路
const gap = 10;
//键对值
const colour1 = {
    0: [100, 100, 100],
    1: [255, 255, 255],
    2: [255, 0, 0],
    3: [255, 255, 0],
}
cc.Class({
    extends: cc.Component,

    properties: {
        //砖块预制物
        brick_prefab: {
            type: cc.Prefab,
            default: null
        },
        //光点预制物
        game_character_prefab: {
            type: cc.Prefab,
            default: null
        },
        game_node: {
            type: cc.Node,
            default: null
        },
        //道具
        goods_prefab: {
            type: cc.Prefab,
            default: null
        },
        map_node: {
            type: cc.Node,
            default: null
        },
        conflict_node: {
            type: cc.Node,
            default: null
        },
        player_hp: 3,
        enemy_hp: 15,
        apCost: 1,
        playerAtk: 5,
        playerMaxAp: 3,

    },
    // LIFE-CYCLE CALLBACKS:
    //被点击的块
    bei_dian_Ji_kuai(brick_js) {

        this.qidong_xiaoqiu(this.hang, this.lie, brick_js.hang, brick_js.lie);
        this.hang = brick_js.hang;
        this.lie = brick_js.lie;

    },
    onLoad() {
        let player_node = cc.find("conflict/bg/playerStatus", this.node);
        this.player = player_node.getComponent("conflict_player");
        let enemy = cc.find("conflict/bg/enemyArea", this.node);
        this.enemy = enemy.getComponent("enemy");
        this.enemy.jie_shou_game_js(this);
        let hintArea = cc.find("conflict/bg/hintArea", this.node);
        hintArea.getComponent("hintArea").jie_shou_game_js(this);
    },
    //接收起点和终点, 有一个路径点被点中了
    you_lujing_beidianjile(brick_js) {
        //初始状态 点了一个块, 这个块设置为起点块
        if (this.m_blockState == 0) {
            this.m_startBlockJs = brick_js;//保存这个块为起始块
            this.m_blockState = 1;//设置状态为有起点

            brick_js.setState('qidian');//把这个块设置成起点的颜色
            return;
        }
        //处理有点的状态, 分2种情况
        //1. 点击的是原来的起始块, 那么就取消起始块
        //2. 点击的是别的块, 那么就设置终点块
        if (this.m_blockState == 1) {
            if (brick_js == this.m_startBlockJs) {//点击的是原来的起始块, 那么就取消起始块
                this.m_startBlockJs = null;
                this.m_blockState = 0;
                brick_js.setState('moren');//把这个块设置成默认的颜色
            } else {// 点击的是别的块, 那么就设置终点块
                this.m_endBlockJs = brick_js;
                this.m_blockState = 2;
                brick_js.setState('zhongdian');//把这个块设置成终点的颜色
                //需要划线或者做起点到终点的动作
                let qiian_hang = this.m_startBlockJs.hang;
                let qidian_lie = this.m_startBlockJs.lie;
                let zhong_dian_hang = this.m_endBlockJs.hang;
                let zhong_dian_lie = this.m_endBlockJs.lie;
                this.qidong_xiaoqiu(qiian_hang, qidian_lie, zhong_dian_hang, zhong_dian_lie);
            }
            return;
        }

        //如果有终点块了, 但还点了块, 看这个块是不是终点块
        if (this.m_blockState == 2) {
            if (this.m_endBlockJs != brick_js) {
                // 1. 停掉之前的 划线或者做起点到终点的动作
                this.m_endBlockJs.setState('moren');//把这个块设置成终点的颜色
                //2. 设置这个块为终点块
                this.m_endBlockJs = brick_js;
                this.m_blockState = 2;
                brick_js.setState('zhongdian');//把这个块设置成终点的颜色

                //需要划线或者做起点到终点的动作 m_startBlockJs这个就是那个js脚本
                let qiian_hang = this.m_startBlockJs.hang;
                let qidian_lie = this.m_startBlockJs.lie;
                let zhong_dian_hang = this.m_endBlockJs.hang;
                let zhong_dian_lie = this.m_endBlockJs.lie;
                this.qidong_xiaoqiu(qiian_hang, qidian_lie, zhong_dian_hang, zhong_dian_lie);
            }
            return;
        }
        //另外,不是写在这里, 如果那个 划线或者做起点到终点的动作 完成了, 把状态再重新设置初始状态, 这样就是一个闭合的逻辑了
        //又可以重新设置起点和终点了
    },
    //启动小球
    qidong_xiaoqiu_huaxian(qiian_hang, qidian_lie, zhong_dian_hang, zhong_dian_lie) {
        // 1. 停掉之前的 划线或者做起点到终点的动作
        for (let i in this.act_arr) {
            //同样还是this.node 去停止这个十个动作
            this.node.stopAction(this.act_arr[i]);
            this.act_arr[i] = null;
        }
        this.act_arr = [];

        this.path = this.look_for_exit(this.di_tu_arr[qiian_hang][qidian_lie], this.di_tu_arr[zhong_dian_hang][zhong_dian_lie], this.di_tu_arr);
        if (this.xing_jie_dian) {
            this.xing_jie_dian.destroy();
            this.xing_jie_dian = null;
        }
        this.xing_jie_dian = new cc.Node();
        this.xing_jie_dian.parent = this.game_node;
        for (let i = this.path.length - 1; i >= 0; i--) {
            this.game_character[i] = cc.instantiate(this.game_character_prefab);
            this.game_character[i].active = false;
            this.xing_jie_dian.addChild(this.game_character[i]);
            let ta = this.node.runAction(cc.sequence(cc.delayTime(0.5 + (this.path.length - i) / 5), cc.callFunc(function () {
                this.game_character[i].position = this.path[i].position;
                this.game_character[i].active = true;
            }.bind(this))));
            this.act_arr.push(ta);
        }
    },
    qidong_xiaoqiu(qiian_hang, qidian_lie, zhong_dian_hang, zhong_dian_lie) {
        // 1. 停掉之前的 划线或者做起点到终点的动作
        for (let i in this.act_arr) {
            //同样还是this.node 去停止这个十个动作
            this.person.stopAction(this.act_arr[i]);
            this.act_arr[i] = null;
        }
        this.act_arr = [];

        this.path = this.look_for_exit(this.di_tu_arr[qiian_hang][qidian_lie], this.di_tu_arr[zhong_dian_hang][zhong_dian_lie], this.di_tu_arr);
        let seqs = [];

        for (let i = this.path.length - 1; i >= 0; i--) {
            //所以这里的执行就是
            //移动->回调->移动->回调->移动->回调->移动->回调->移动->回调->移动->回调->移动->回调->移动->回调->移动->回调
            //明白了吗
            let speed = this.person.getComponent("player").speed;
            seqs.push(cc.moveTo(speed, this.path[i].position));//这个理解吗0.3秒移动一下
            seqs.push(cc.callFunc(function () {
                this.Player_Is_goods(this.path[i]);
            }.bind(this)))
        }
        let ta = this.person.runAction(cc.sequence(seqs));//谁启动的动作谁停止
        this.act_arr.push(ta);
    },
    //创建玩家
    creation_player() {
        let person = cc.instantiate(this.game_character_prefab);
        // person.getComponent("player").jie_shou_game(this);
        this.person = person;
        this.person.getComponent("player").set_Speed(this.speed_txt);//设置玩家的移动速度
        this.speed_node = cc.find("map/speed/speed_txt", this.node);
        this.speed_node.getComponent("cc.Label").string = `速度:X${this.speed_txt}`;
        this.person.position = this.di_tu_arr[this.hang][this.lie].position;
        this.game_node.addChild(person);

        var anim = person.getComponent(cc.Animation);

        // 如果没有指定播放哪个动画，并且有设置 defaultClip 的话，则会播放 defaultClip 动画
        anim.play("clip2");

        // // 指定播放 test 动画
        // anim.play('test');

        // // 指定从 1s 开始播放 test 动画
        // anim.play('test', 1);

        // // 使用 play 接口播放一个动画时，如果还有其他的动画正在播放，则会先停止其他动画
        // anim.play('test2');
    },
    checkEnmeyAction() {
        if (this.player.ap <= 0) {
            this.enemy.attack();
            this.player.setAp(this.playerMaxAp);
        } else {
            this.isAction = false;
        }
    },
    //攻击函数
    playerAttack() {
        if (this.player.ap >= this.apCost) {
            this.player.constAp(this.apCost);
            this.enemy.hurt(this.playerAtk);
        } else {
            cc.log("没有行动点数了");
        }
    },
    //攻击按钮
    attack_button(event, type) {
        if (this.isAction)
            return;
        this.isAction = true;
        switch (type) {
            case "attack": {
                this.playerAttack();
                break;
            }
            default:
                break;
        }
    },
    //创建道具
    creation_goods() {
        let index = Math.floor((Math.random() * this.goods_arr.length));
        if (this.goods) {
            this.goods.destroy();
            this.goods = null;
        }

        this.goods = new cc.Node();
        this.goods.parent = this.goods_arr[index];
        let hang = this.goods_arr[index].getComponent("brick").hang;
        let lie = this.goods_arr[index].getComponent("brick").lie;
        this.dao_ju = cc.instantiate(this.goods_prefab);
        this.dao_ju.getComponent("goods").post(hang, lie);
        this.goods.addChild(this.dao_ju);
        let len = this.dao_ju.getComponent("goods").len();
        this.number = Math.floor((Math.random() * len) + 1);
        this.dao_ju.getComponent('goods').setType(this.number);
    },
    //判断玩家的位置是不是等于道具的位置
    Player_Is_goods(post) {
        let lu_jin_post = {
            hang: post.getComponent("brick").hang,
            lie: post.getComponent("brick").lie
        }
        let dao_ju_post = {
            hang: this.dao_ju.getComponent("goods").hang,
            lie: this.dao_ju.getComponent("goods").lie
        }
        if (lu_jin_post.hang === dao_ju_post.hang && lu_jin_post.lie === dao_ju_post.lie) {
            if (this.number === 1) {
                this.person.getComponent("player").add_hp();
                if (this.person.getComponent("player").Hp >= 5) {
                    this.person.getComponent("player").Hp = 5;
                }
                let hp = this.person.getComponent("player").Hp;
                this.hp_comp.Set_Hp(hp);
                this.creation_goods();
            } else if (this.number === 2) {
                this.speed_txt = this.person.getComponent("player").add_Speed();
                this.speed_node.getComponent("cc.Label").string = `速度:X${this.speed_txt}`;
                this.creation_goods();
            } else if (this.number === 3) {
                let hp1 = this.person.getComponent("player").Hp;
                this.map_node.active = false;
                this.conflict_node.active = true;
                this.isAction = false;
                this.enemy.init(25);//怪物血量
                this.player.init(hp1, 3);//玩家的行动值，和血量
            }

        }
    },
    //刷新玩家战斗后血量
    shua_xin_zhan_dou_hou_hp() {
        this.person.getComponent("player").Hp = this.player.derive();
        let hp = this.person.getComponent("player").Hp;
        this.map_node.active = true;
        this.conflict_node.active = false;
        this.hp_comp.Set_Hp(hp);
        this.creation_goods();
    },
    start() {
        //初始移动速度
        this.speed_txt = 1;
        this.location = [];
        //可画物品的数组
        this.goods_arr = [];
        this.rule = 1;
        this.map = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
            [1, 0, 0, 1, 1, 0, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 1, 0, 0, 1],
            [1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 1, 0, 0, 0, 1, 0, 1],
            [1, 1, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
        this.hang = 8;
        this.lie = 7;
        this.Stack = new Stack.Stack();
        this.Stack1 = new Stack.Stack();
        this.add_brick(this.map);
        this.creation_player();
        this.creation_goods();
        //动作数组
        this.act_arr = [];
        //点数组
        this.game_character = [];
        //一个区分当前是点击进行到哪一阶段的状态变量
        //0: 初始状态也就是没有起点, 没有终点
        //1: 有起点
        //2: 有终点

        this.m_blockState = 0;//
        let hp_node = cc.find('map/HP', this.node);
        this.hp_comp = hp_node.addComponent("HP");
        //给玩家设置一个血量
        this.person.getComponent("player").Hp = 3;

        this.Refresh_player_hp();
        let a = 100;
    },
    //刷新玩家血量
    Refresh_player_hp() {
        let hp = this.person.getComponent("player").Hp;
        this.hp_comp.Set_Hp(hp);
    },
    //刷新玩家速度
    Refresh_player_speed() {

    },
    //在map node 的二维数组中找到指定的块
    find_blocknode_inmapnods(block, ditu) {
        for (let x of ditu) {
            for (let y of x) {
                let t_hang = y.getComponent('brick').hang;
                let t_lie = y.getComponent('brick').lie;
                if (t_hang == block.hang && t_lie == block.lie) {
                    return y;
                }
            }
        }
        return null;
    },
    //寻路方法按钮
    precept_button(value, data) {
        this.rule = data;
    },
    //找出口 传入起点,终点, 地图, 知道要做
    look_for_exit(start, end, ditu) {
        let res = [];
        let start1 = {
            hang: start.getComponent('brick').hang,
            lie: start.getComponent('brick').lie
        };
        let end1 = {
            hang: end.getComponent('brick').hang,
            lie: end.getComponent('brick').lie
        };

        //更精简的
        let path_module = null;
        if (this.rule == 1) {//要减少相同的代码
            path_module = AStarPath;
        } else if (this.rule == 2) {
            path_module = NormalPath;
        }

        let final_path = path_module.find_path(start1, end1, this.map);
        //这里会一个从终点开始一个从起点开始,那就要保证这两个算法返回出来的数据都是相同的
        for (let i = final_path.length - 1; i >= 0; i--) {
            let x = final_path[i]
            res.push(this.find_blocknode_inmapnods(x, ditu));
        }
        return res;
    },
    //根据地图添加砖块和通道
    add_brick(map) {
        this.di_tu_arr = [];
        for (let i = 0; i < map.length; i++) {
            this.di_tu_arr[i] = [];
            for (let j = 0; j < map[i].length; j++) {
                let brick = cc.instantiate(this.brick_prefab);
                let colour = colour1[map[i][j]];
                let B = colour[2];
                let G = colour[1];
                let R = colour[0];
                brick.getComponent('brick').brick_colour(R, G, B);
                brick.getComponent('brick').Name(map[i][j], i, j);
                this.di_tu_arr[i][j] = brick;
                this.di_tu_arr[i][j].getComponent('brick').receive_game_script(this);
                if (map[i][j] != 0) {
                    this.di_tu_arr[i][j].getComponent('brick').forbid_click(false);
                } else {
                    this.goods_arr.push(this.di_tu_arr[i][j]);
                }

                this.game_node.addChild(brick);
            }
        }
        this.describe_map();
    },
    //画地图
    describe_map() {
        let beginning = 100;//上面的起点
        let destination = 340;//下面的终点
        let m_width = this.di_tu_arr[0][0].getChildByName('brick_sprite').width;//110
        let m_heigth = this.di_tu_arr[0][0].getChildByName('brick_sprite').height;//110
        let right_interval = 10;//往右的间隔
        let down_interval = 10;//往下的间隔
        for (let i = 0; i < this.di_tu_arr.length; i++) {
            for (let j = 0; j < this.di_tu_arr[i].length; j++) {
                let x = beginning + j * (m_width + right_interval);
                let y = destination - i * (m_heigth + down_interval);
                this.di_tu_arr[i][j].position = cc.v2(x, y);
            }
        }
    },

    // update (dt) {},
});
