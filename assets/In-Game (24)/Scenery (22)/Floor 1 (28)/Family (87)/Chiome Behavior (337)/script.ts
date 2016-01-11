class ChiomeBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }

  start() {
    this.actor.getBehavior(ItemBehavior).type = "bubble";
  }

  activate() {
    Game.dialogBehavior.show("Chiome", "OuafOuaf", null, null);
  }
}
Sup.registerBehavior(ChiomeBehavior);
