class BoughtItemBehavior extends Sup.Behavior {
  start() {
    if (!Game.state.boughtItems[ this.actor.getName() ]) {
      this.actor.destroy()
    }
  }
}
Sup.registerBehavior(BoughtItemBehavior);
