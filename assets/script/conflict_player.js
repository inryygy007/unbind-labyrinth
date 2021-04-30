
cc.Class({
    extends: cc.Component,

    properties: {
        //血量
        hpLabel: {
            type: cc.Label,
            default: null
        },
        //行动点
        apLabel: {
            type: cc.Label,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    init(hp, ap) {
        this.setHp(hp); //血量初始化
        this.setAp(ap); //行动点数初始化
    },
    //血量初始化
    setHp(hp) {
        this.hp = hp;
        this.updateHp();
    },
    //行动点初始化
    setAp(ap) {
        this.ap = ap;
        this.updateAp();
    },
    //行动点显示
    updateAp() {
        this.apLabel.string = `AP\n${this.ap}`;
    },
    //行动点消耗
    constAp(num) {
        this.ap -= num;
        this.updateAp();
    },
    //血量消耗
    hurt(num) {
        this.hp -= num;
        if (this.hp <= 0) {

        }
        this.updateHp();
    },
    //血量显示
    updateHp() {
        let hp = this.hpLabel;
        hp.getComponent("cc.Label").string = `HP\n${this.hp}`;
    },
    //导出玩家战斗后的血量
    derive() {
        return this.hp;
    }
    // update (dt) {},
});
