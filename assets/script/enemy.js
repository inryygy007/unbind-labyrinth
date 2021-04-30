
cc.Class({
    extends: cc.Component,

    properties: {
        hpLabel: cc.Label,
        enmeyAtk: 1
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.animation = this.node.getComponent(cc.Animation);
    },
    //怪物血量初始化
    init(hp) {
        this.setHp(hp);
        this.node.active = true;
    },
    //怪物血量初始化
    setHp(hp) {
        this.hp = hp;
        this.updateHp();
    },
    //怪物血量显示
    updateHp() {
        this.hpLabel.string = `${this.hp}hp`;
    },
    //怪物受伤函数
    hurt(num) {
        this.hp -= num;
        if (this.hp <= 0) {
            // this.node.active = false;
            // this.game.map_node.active = true;
            // this.game.conflict_node.active = false;
            this.game.shua_xin_zhan_dou_hou_hp();
            return;
        }
        this.updateHp();

        this.animation.play("hurt");
    },
    //玩家行动点数还有没有，怪物还击
    onHurtEnd() {
        this.game.checkEnmeyAction();
    },
    //怪物攻击，玩家血量减少
    onAttackEnd() {
        this.game.isAction = false;
        this.game.player.hurt(this.enmeyAtk);
    },
    //怪物攻击
    attack() {
        this.animation.play("attack");
    },
    //接受game脚本
    jie_shou_game_js(game) {
        this.game = game;
    },
    start() {

    },

    // update (dt) {},
});
