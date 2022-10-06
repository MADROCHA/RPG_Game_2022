const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576
//console.log(c)
const collisionsMap = []
for (let i = 0; i< collisions.length; i+=70){
    collisionsMap.push(collisions.slice(i, 70 + i))
}
//console.log(collisionsMap)
const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i+=70){
    battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}


c.fillStyle = 'azure'
c.fillRect(0,0,canvas.width,canvas.height)

const image = new Image()
image.src = './img/maps/PelletTown1.png'
const foregroundImage = new Image()
foregroundImage.src = './img/maps/PelletTownForeground.png'
const playerUpImage = new Image()
playerUpImage.src = './img/player/playerUp.png'
const playerLeftImage = new Image()
playerLeftImage.src = './img/player/playerLeft.png'
const playerDownImage = new Image()
playerDownImage.src = './img/player/playerDown.png'
const playerRightImage = new Image()
playerRightImage.src = './img/player/playerRight.png'

collisionsMap.forEach((row, i) =>{
    row.forEach((symbol, j) => {
        if (symbol === 1025)
        //console.log(symbol)
        boundaries.push(
            new Boundary({
                position:{
                    x:j * Boundary.width +offset.x,
                    y:i * Boundary.height +offset.y
                }
            })
        )
    })
})
const battleZones = []
battleZonesMap.forEach((row, i) =>{
    row.forEach((symbol, j) => {
        if (symbol === 1025)
        //console.log(symbol)
        battleZones.push(
            new Boundary({
                position:{
                    x:j * Boundary.width +offset.x,
                    y:i * Boundary.height +offset.y
                }
            })
            )
        })
    })
    console.log(battleZones)
let debugDev = false
const player = new Sprite({
    position: {
        x: canvas.width * 0.5 -192 *0.25 * 0.5,
        y: canvas.height * 0.5 -68 * 0.5, 
        /* x: canvas.width * 0.5 -(this.image.width * 0.25) * 0.5,
        y: canvas.height * 0.5 -this.image.height * 0.5, */ 
    },
    frames:{
        max: 4
    },
    image: playerDownImage,
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        down: playerDownImage,
        right: playerRightImage,
    }

})
const background = new Sprite({
    position:{
        x: offset.x,
        y: offset.y,
    },
    image: image
})
const foreground = new Sprite({
    position:{
        x: offset.x,
        y: offset.y,
    },
    image: foregroundImage
})

const keys = {
    w:{
        pressed: false
    },
    a:{
        pressed: false
    },
    s:{
        pressed: false
    },
    d:{
        pressed: false
    },
}
    

    const movables = [background, ...boundaries, foreground, ...battleZones]
    function rectCollision({rect1,rect2}){
        return (
            rect1.position.x + rect1.width >= rect2.position.x
            &&  rect1.position.x <= rect2.position.x + rect2.width
            &&  rect1.position.y <= rect2.position.y + rect2.height
            &&  rect1.position.y + rect1.height >= rect2.position.y
            )
        }
        const battle = {
            initiated: false,
            
        }
        function animate(){
            window.requestAnimationFrame(animate)
        
        background.draw()
        boundaries.forEach(boundary => {
            boundary.draw()
        }) 
        battleZones.forEach(battleZone => {
            battleZone.draw()
        }) 
        player.draw()
        foreground.draw()
        //c.drawImage(image1, -735,-600)
        
        
        let moving = true
        player.moving = false
            //if (playerImage.position.x + playerImage.width)
            if ( battle.initiated) return
            // activate battle & collision croped
            if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
                for (let i = 0; i < battleZones.length; i++){
                const battleZone = battleZones[i]
                const overlappingArea = 
                (Math.min(
                    player.position.x + player.width,
                    battleZone.position.x + battleZone.width
                ) -
                Math.max(
                    player.position.x, 
                    battleZone.position.x
                )) *
                (Math.min(
                    player.position.y * player.height, 
                    battleZone.position.y + battleZone.height
                ) -
                Math.max(player.position.y, battleZone.position.y
                ))
                    
                if(
                    rectCollision({
                        rect1: player,
                        rect2: battleZone
                }) &&
                overlappingArea > player.width * player.height * 0.5
                && Math.random() < 0.01
                ) {
                    battle.initiated = true
                    console.log('battle')
                    break
                }
            }
        }
        //collisions
        //controls

        
        if (keys.w.pressed
            && lastKey === 'w'){
                player.moving = true
                player.image = player.sprites.up

                for (let i = 0; i < boundaries.length; i++){
                    const boundary = boundaries[i]
                    if(
                        rectCollision({
                            rect1: player,
                            rect2: {...boundary, position:{
                                x: boundary.position.x,
                                y: boundary.position.y + 3,
                            }}
                    })
                    ) {
                        console.log('boundaries')
                        moving = false
                        break
                    }
                }

                if(moving)
                    movables.forEach(movable =>{
                        movable.position.y += 3
                    })
                
        } else if(keys.a.pressed
            && lastKey === 'a'){
                player.moving = true
                player.image = player.sprites.left
                for (let i = 0; i < boundaries.length; i++){
                    const boundary = boundaries[i]
                    if(
                        rectCollision({
                            rect1: player,
                            rect2: {...boundary, position:{
                                x: boundary.position.x + 3,
                                y: boundary.position.y,
                            }}
                    })
                    ) {
                        console.log('boundaries')
                        moving = false
                        break
                    }
                }
                if(moving)
                movables.forEach(movable =>{
                    movable.position.x += 3
                })
        } else if(keys.s.pressed
            && lastKey === 's'){
                player.moving = true
                player.image = player.sprites.down
                player.moving = true
                for (let i = 0; i < boundaries.length; i++){
                    const boundary = boundaries[i]
                    if(
                        rectCollision({
                            rect1: player,
                            rect2: {...boundary, position:{
                                x: boundary.position.x,
                                y: boundary.position.y - 3,
                            }}
                    })
                    ) {
                        console.log('boundaries')
                        moving = false
                        break
                    }
                }
                if(moving)
                movables.forEach(movable =>{
                    movable.position.y -= 3
                })
        } else if(keys.d.pressed
            && lastKey === 'd'){
                player.moving = true
                player.image = player.sprites.right
                for (let i = 0; i < boundaries.length; i++){
                    const boundary = boundaries[i]
                    if(
                        rectCollision({
                            rect1: player,
                            rect2: {...boundary, position:{
                                x: boundary.position.x -3,
                                y: boundary.position.y,
                            }}
                    })
                    ) {
                        console.log('boundaries')
                        moving = false
                        break
                    }
                }
                if(moving)
                movables.forEach(movable =>{
                    movable.position.x -= 3
                })
        }
    }
    animate()

    let lastKey = ''
window.addEventListener('keydown', (e)=>{
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
                lastKey = 'd'
            break
        case 'º':
            debugDev = !debugDev
                lastKey = 'º'
            break
    }
})
window.addEventListener('keyup', (e)=>{
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})

