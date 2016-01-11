class DowieIntroBehavior extends Sup.Behavior {
  start() {
    if (Game.state.activeQuest === "intro") {
      Game.state.activeQuest = "goToJanitor";
      Game.playerBehavior.actor.spriteRenderer.setAnimation("Shoked", false);
      Game.dialogBehavior.show("Dowie", "firstTextIntro", null, null);
    }
  }
}
Sup.registerBehavior(DowieIntroBehavior);