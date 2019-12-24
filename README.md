# HTML-to-game

This utility can create PIXIJS game objects from HTML elements.

## Project setup
```
npm install
```
## DEMO
Later...

## How to use

### Initiaize
1. In your project import default from index.js (e.g. as DomToPixi):
  ```import DomToPixi from '../node_modules/dom-to-pixi-engine/src/index';```
2. Create scene controller:
  ```const sceneController = new DomToPixi.SceneController(scene, container);```
  where: 'scene' - HTML element that includes game scene objects, 'container' - HTML element where PIXI canvas will be placed.
3. Now sceneController to restart or stop game:
  ```sceneController.restartGame();```
  ```sceneController.stopGame();```

### Listening events
To listen game event you can subscribe on internal events:
  ```DomToPixi.EventSystem.on(EVENT).subscribe(callback(event));```

Available events:
| event               | payload       | desc                                         |
|---------------------|---------------|----------------------------------------------|
| 'game.collectables' | { amount: 0 } | emitted when all Collectables were collected |
| 'object.destroy'    | GameObject    | emitted when GameObject was destroyed        |

### Configure game scene
To configure game scene and objects you should add some data attributes to HTML elements.
| data attribute     | value                                                                                                              | optional | desc                                                                                                                                                                                                                                                                                                                                                                                         |
|--------------------|--------------------------------------------------------------------------------------------------------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| data-scene-object  | none                                                                                                               | false    | This attr is necessary for all game objects except player. Elements with this attr will be used for PIXI GameObjects.                                                                                                                                                                                                                                                                        |
| data-scene-trigger | none                                                                                                               | true     | Defines an object that a player can interact with.                                                                                                                                                                                                                                                                                                                                           |
| data-texture-name  | 'TEXTURE_NAME.png'                                                                                                 | true     | Path to texture image or tileset.                                                                                                                                                                                                                                                                                                                                                            |
| data-texture-frame | 'x,y,w,h'                                                                                                          | true     | Defines rectangle for texture in tileset. **x** & **y** - top left corner, **w** - width, **h** - height. If not specified then texture will be created from whole image.                                                                                                                                                                                                                                    |
| data-options       | '{     "hasHitbox": bool,     "isHazard": bool,     "tiles": bool,     "animate": bool,     "collectable": bool }' | true     | Additional options for game objects. **hasHitbox** is necessary for player. **isHazard** specifies if player can be killed by this game object. **tiles** if true then texture is repeated on object. **animate** if your element has animation (e.g. CSS) you can set this option to **true** and game object will be constantly updated. **collectable** specifies if object can be collected by user. |
| data-scene-player  | none                                                                                                               | false    | Attr for player element. Only one element should be marked with it.                                                                                                                                                                                                                                                                                                                          |

#### Examples:
**Player**
```
<div
  id="player"
  data-scene-player
  data-texture-name="images/alex.png"
  data-options='{ "hasHitbox": true }'
></div>
```
**Wall**
```
<div
  id="world-border-right"
  data-scene-object
  data-texture-name="images/tileset.png"
  data-texture-frame="240,144,16,16"
></div>
```
**Enemy**
```
<div
  id="moving-block"
  class="move-left-right-repeat"
  data-scene-trigger
  data-texture-name="images/tileset.png"
  data-texture-frame="272,288,16,16"
  data-options='{ "isHazard": true, "tiles": true, "animate": true }'
></div>
```
**Collectable**
```
<div
  id="vue"
  class="object rotate-z"
  style="grid-area: 34 / 14 / 35 / 15;"
  data-scene-trigger
  data-texture-name="images/vue.png"
  data-options='{ "collectable": true, "animate": true }'
></div>
```

### Limitations
1. Gravity always on and directed down.
2. Player can move left, right and jump.
3. After changing window size scene should be recreated.