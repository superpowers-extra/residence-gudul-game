class SelfiboyBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  start() {
    this.actor.getBehavior(ItemBehavior).type = "bubble";
  }
  
  activate() {
    Game.dialogBehavior.show("Selfiboy", "Floor2_selfiboy", null, null);
  }

}
Sup.registerBehavior(SelfiboyBehavior);