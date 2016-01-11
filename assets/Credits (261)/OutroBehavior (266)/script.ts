class OutroBehavior extends Sup.Behavior {
  position: Sup.Math.Vector3;
  
  start() {
    this.position = this.actor.getLocalPosition();
    
    var names = ["Credits" , "" , "Elisée Maurer" , "Thomas Frick" , "Rosalie Klein" , "Florent Poujol" , "Nicolas Gauthier" , 
                 "Bruno de Chazelles" , "Romain Schlienger" , "Victor Nardin"  ,"Rémy Maetz ", "Robin Dussart", "", "", "THANKS FOR PLAYING!" ];
    
    names.forEach((name, nameIndex) => {
      var textBehavior = new Sup.Actor("Text", this.actor).addBehavior(TextBehavior);
      textBehavior.actor.setLocalPosition(new Sup.Math.Vector3(0, -4-nameIndex, 0));
      textBehavior.setText(name);
    })
  }
      
  update() {
    this.position.y = this.position.y + 0.01;
    this.actor.setLocalPosition(this.position);
  }
}
Sup.registerBehavior(OutroBehavior);
