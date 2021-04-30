
cc.Class({
    extends: cc.Component,

    properties: {
        Hp: 2,
        // speed: 1
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.num = 1;
    },

    //速度初始化
    set_Speed(number) {
        this.speed = number;
    },
    //速度增加
    add_Speed() {
        if (this.speed <= 0.1) {
            return this.num;
        }
        this.speed /= 2;
        this.num++;
        return this.num;
    },
    add_hp() {
        this.Hp++;
    }
    // update (dt) {},
});
