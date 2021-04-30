
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    Set_Hp(hp) {
        // let hp_txt = cc.find('hp_txt', this.node);
        // hp_txt.getComponent("cc.Label").string = `HP:${1000}`;
        for (let i = 0; i < 5; i++) {
            let a = cc.find("hp_" + (i + 1), this.node)
            a.active = i < hp;
        }

    }
    // update (dt) {},
});
