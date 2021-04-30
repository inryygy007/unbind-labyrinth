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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        //this.isVisited = false;//一开始初始化为没有被访问过
        this.num = 0;
    },
    //设置禁止点击
    forbid_click(state) {
        this.node.getChildByName("New Button").getComponent('cc.Button').interactable = state;
    },
    //砖块颜色控制
    brick_colour(R, G, B) {
        this.node.getChildByName('brick_sprite').color = new cc.Color(R, G, B);
    },
    //名字
    Name(name, hang, lie) {
        this.ID = name;
        this.hang = hang;
        this.lie = lie;

        this.setState('moren');//一开始设置为默认的状态
    },
    //设置位置为起点还是终点
    set_location(is_Star_end) {
        this.is_Star_end = is_Star_end;
    },
    //点击按钮
    button() {
        this.bei_dianji = this.num % 2 === 0 ? true : false;
        // if (this.bei_dianji) {
        //     this.brick_colour()
        // } else {

        // }
        this.clock = Date.now();
        this.num++
        //cc.log(this.num);
        //把这个块的绑定的脚本传出去
        //this.game.you_lujing_beidianjile(this);//this 代表这个脚本, this.node 代表这个脚本绑的结点
        this.game.bei_dian_Ji_kuai(this);
    },
    //是否这个块被访问过
    isValid() {
        return !this.isVisited;
    },
    //设置这个块被访问过
    setVisited(is_visited) {
        this.isVisited = is_visited;
    },
    //重置按钮状态
    reset_button() {
        this.bei_dianji = false;
    },
    //接受game脚本
    receive_game_script(game) {
        this.game = game;
    },
    //设置状态
    setState(state) {
        if (state == "moren") {
            let colour = colour1[this.ID];
            this.brick_colour(colour[0], colour[1], colour[2]);
        } else if (state == "qidian") {
            let colour = colour1[2];
            this.brick_colour(colour[0], colour[1], colour[2]);
        } else {
            let colour = colour1[3];
            this.brick_colour(colour[0], colour[1], colour[2]);
        }
    }
    // update (dt) {},
});
