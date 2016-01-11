module Game {
  export let playerBehavior: PlayerBehavior;
  export let cameraBehavior: CameraBehavior;
  
  export let mainDialog: Sup.Actor;
  export let dialogBehavior: DialogBehavior;
  
  export let inventory = { "Sucker": false, "Oil": false, "Card": false, "Flower": false, "Skin": false };
  export let state = {
    // Intro
    boughtItems: { "Crisps": false, "Chicken": false, "Chiome": false, "Apple": false, "Swing": false, "Axe": false },
    
    // Quests: intro, goToJanitor, pickUpPass, goToBasement, plantTheCop, askBeautyOil
    // meetMusclor, giveFlower, pickUpOil, useOil, finish
    activeQuest: "intro",
    currentFloor: 3,
    
    // Floor 0
    janitorDoorKnocked: false,
    janitorCalledForHelp: false,
    mustRepairJanitorPortrait: false,
    janitorPortraitOpen: false,
    janitorDoorOpen: false,
    suckerPickedUp: false,
    skinPickedUp: false,
    mammouthSeen: false,
    
    // Floor 1
    wearingSkin: false,
    flowerPickedUp: false,
    detectiveMet: false,
    
    // Floor 3
    oilPickedUp: false,
    
    // Elevator
    isInElevator: false, // used not to hide the dialog when the player is in the elevator
  };
  
  export let music: Sup.Audio.SoundPlayer = null;
  export let musicVolume = 0;
  export let targetMusicVolume = 1;
  export let musicAsset = null;
  
  export let TextData: any;
  
  export let hoverSound: Sup.Sound;
  export let selectSound: Sup.Sound;
  
  export let itemBehaviors: ItemBehavior[] = [];
  
  export function initialize() {
    Game.hoverSound = Sup.get("SFX/Hover", Sup.Sound);
    Game.selectSound = Sup.get("SFX/Select", Sup.Sound);
  
    if (Game.TextData == null) {
      let textData = TextDataFr;
      Game.TextData = textData;
    }
  }
    
  export function start() {
    Sup.loadScene(Sup.get("In-Game/Scene", Sup.Scene));
    Game.playerBehavior = Sup.getActor("Player").getBehavior(PlayerBehavior);
    
    for (let item in Game.inventory) {
      Sup.getActor("Inventory").getChild(item).spriteRenderer.setOpacity(0);
    }
    
    Game.switchToScene("In-Game/Scenery/Floor 3/Dowie/Prefab", "Start");
  }
  
  export function switchToScene(sceneName: string, target: string) {
    Game.itemBehaviors.length = 0;
    
    // Play correct music
    let musicName = sceneName.substring(16, sceneName.length - 7);
    if (musicName === "Floor 3/Dowie") {
      musicName = "Floor 3/Hall";
    } else if (musicName === "Floor 0/Janitor/Bathroom") {
      musicName = "Floor 0/Janitor";
    }
    
    let newMusic = Sup.get("Music/" + musicName);
    if (newMusic == null) {
      Sup.log("NO MUSIC SET FOR: " + sceneName)
    } else {
      if (newMusic !== Game.musicAsset) {
        if (Game.music != null) {
          Game.music.stop();
          Game.music = null;
        }
        
        Game.musicAsset = newMusic;
        if (Game.musicAsset != null) {
          Game.music = new Sup.Audio.SoundPlayer(Game.musicAsset, 1.0, { loop: true });
          
          Game.musicVolume = 0;
          Game.targetMusicVolume = 1;
          Game.music.setVolume(Game.musicVolume);
          
          Game.music.play();
        }
      }
    }
    
    let sceneRoot = Sup.appendScene(Sup.get(sceneName , Sup.Scene))[0];
    Game.playerBehavior.leftLimit = sceneRoot.getChild("Limits").getChild("Left").getLocalPosition().x;
    Game.playerBehavior.rightLimit = sceneRoot.getChild("Limits").getChild("Right").getLocalPosition().x;
    
    let targetActor = sceneRoot.getChild(target);
    if (targetActor == null) {
      Sup.log(`Game.switchToScene(): no actor named "${target}" found`);
    }
    
    Game.playerBehavior.position.x = targetActor.getLocalPosition().x;
    Game.cameraBehavior.position.x = Game.playerBehavior.position.x;
    
    if (sceneName == "In-Game/Scenery/Elevator/Prefab") {
      Game.playerBehavior.position.y = targetActor.getLocalPosition().y;
      Game.cameraBehavior.position.x -= 2;
    } else {
      Game.playerBehavior.position.y = -1.2;
    }
    
    Game.playerBehavior.actor.setLocalPosition(Game.playerBehavior.position);
  }
    
  export function createText(text: string, position: Sup.Math.Vector3, alignment: string, parent: Sup.Actor) {
    let textActor = new Sup.Actor("Text");
    
    if (parent != null) {
      textActor.setParent(parent);
    }
    
    if (position == null) {
      position = new Sup.Math.Vector3(0,0,0);
    }
    
    textActor.setLocalPosition(position);
    let textActorBehavior = new TextBehavior(textActor);
    textActorBehavior.text = text;
    if (alignment != null) {
      textActorBehavior.alignment = alignment;
    }
    
    return textActor;
  }
  
  export function getItem(item: string) {
    Sup.Audio.playSound("SFX/Pick Up");
    Game.inventory[item] = true;
    Sup.getActor("Inventory").getChild(item).spriteRenderer.setOpacity(1);
  }
    
  export function useItem(item: string) {
    Game.inventory[item] = false;
    Sup.getActor("Inventory").getChild(item).spriteRenderer.setOpacity(0);
  }
}

Game.initialize();
