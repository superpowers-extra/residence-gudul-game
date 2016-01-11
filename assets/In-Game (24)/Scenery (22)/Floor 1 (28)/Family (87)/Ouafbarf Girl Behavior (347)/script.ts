class OuafbarfGirlBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  start() {
    this.actor.getBehavior(ItemBehavior).type = "bubble";
  }
  activate() {
    Game.dialogBehavior.show("Chienfille", "Chienfille_Happy", null, null);
  }
}
Sup.registerBehavior(OuafbarfGirlBehavior);
