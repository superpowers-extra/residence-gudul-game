class OuafbarfDadBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  start() {
    this.actor.getBehavior(ItemBehavior).type = "bubble";
  }
  activate() {
    Game.dialogBehavior.show("Chienpere", "Chienpere_Happy", null, null);
  }
}
Sup.registerBehavior(OuafbarfDadBehavior);