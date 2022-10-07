const embyImage = new Image()
embyImage.src = './img/battle/embySprite.png'

const draggleImage = new Image()
draggleImage.src = './img/battle/draggleSprite.png'

const monsters = {
    Emby: {
        position:{
            x:285,
            y:325
        },
        image: embyImage,
        frames: {
            max:4,
            hold: 20,
        },
        animate: true,
        //health: 100,
        isEnemy:false,
        name: 'Emby',
        attacks: [
            attacks.Tackle, 
            attacks.Fireball, 
            attacks.IceSpike,
            attacks.Waterblast, 
        ]
    },
    Draggle: {
        position:{
            x:800,
            y:100
        },
        image: draggleImage,
        frames: {
            max:4,
            hold: 20,
        },
        animate: true,
        //health: 100,
        isEnemy: true,
        name: 'Draggel',
        attacks: [attacks.Tackle, attacks.Fireball]
    }

    
}