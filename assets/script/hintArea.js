
cc.Class({
    extends: cc.Component,

    properties: {
        hintLabel: {
            type: cc.Label,
            default: null
        },
        attackBtnNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.attackBtnNode.on("mousemove", this.setAtkHint, this);
        this.attackBtnNode.on("mouseleave", this.removeHint, this);
    },
    onDestroy() {
        this.attackBtnNode.off("mousemove", this.setAtkHint, this);
        this.attackBtnNode.off("mouseleave", this.removeHint, this);
    },
    setAtkHint() {
        this.setHint(`攻击，对敌人造成${this.game.playerAtk}点伤害`);
    },
    setHint(hint) {
        this.hintLabel.string = hint || "";
    },
    removeHint() {
        this.setHint("");
    },
    //接受game脚本
    jie_shou_game_js(game) {
        this.game = game;
    },
    start() {

    },

    // update (dt) {},
});
