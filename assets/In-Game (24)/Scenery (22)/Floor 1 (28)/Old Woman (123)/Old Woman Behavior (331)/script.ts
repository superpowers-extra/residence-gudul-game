class OldWomanBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  start() {
    this.actor.getBehavior(ItemBehavior).type = "bubble";
  }
  activate() {
    Game.dialogBehavior.show("Old Woman", "OldWomanTalk", null, null);
  }
}
Sup.registerBehavior(OldWomanBehavior);