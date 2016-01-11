class OuafbarfMomBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  start() {
    this.actor.getBehavior(ItemBehavior).type = "bubble";
  }
  activate() {
    Game.dialogBehavior.show("Chienmere", "Chienmere_Happy", null, null);
  }
}
Sup.registerBehavior(OuafbarfMomBehavior);
