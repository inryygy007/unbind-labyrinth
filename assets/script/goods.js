// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        //道具
        goods_prefab: {
            type: cc.SpriteFrame,
            default: []
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    post(hang, lie) {
        this.hang = hang;
        this.lie = lie;
    },
    //设置道具是什么
    setType(number) {
        let tupian = cc.find("goods_picture", this.node);
        let sf = this.goods_prefab[number - 1];//这里如果传进来是个0会怎么样
        //设置类型 首先只设置一下相应 的图片就行
        //这里是node 上放的是Sprite 组件而不是SpriteFrame组件
        tupian.getComponent(cc.Sprite).spriteFrame = sf;
    },
    len() {
        return this.goods_prefab.length;
    }
    // update (dt) {},
});
