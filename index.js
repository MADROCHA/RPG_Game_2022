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

class Boundary {
    static width = 48
    static height = 48
    constructor({
        position,
    }){
        this.position = position
        this.width = 48 
        this.height = 48
    }
    draw(){
        c.fillStyle = ' rgb(0, 0, 255, 0.2)'
        c.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height,
        )
    }
}
const boundaries = []
const offset = {
    x:-735,
    y:-650
} 
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

c.fillStyle = 'azure'
c.fillRect(0,0,canvas.width,canvas.height)

const image = new Image()
const playerImage = new Image()
playerImage.src = './img/player/playerDown.png'
image.src = './img/maps/PelletTown1.png'

class Sprite {
    constructor({
        position,
        velocity,
        image,
        frames = {
            max:1,
        }
    }){
        this.position = position
        this.image = image
        this.frames = frames 

        this.image.onload = ()=> {
            this.width = this.image.width / frames.max
            this.height = this.image.height 
        }

    }
    draw(){
        /* c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            
        ) */
        c.drawImage(
            this.image,
            0,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            
            this.position.x,
            this.position.y,

            this.image.width / this.frames.max,
            this.image.height,
            )
    }
    update(){

    }
}
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
    image: playerImage,

})
const background = new Sprite({
    position:{
        x: offset.x,
        y: offset.y,
    },
    image: image
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
    

    const movables = [background, ...boundaries]
    function rectCollision({rect1,rect2}){
        return (
            rect1.position.x + rect1.width >= rect2.position.x
            &&  rect1.position.x <= rect2.position.x + rect2.width
            &&  rect1.position.y <= rect2.position.y + rect2.height
            &&  rect1.position.y + rect1.height >= rect2.position.y
        )
    }
    function animate(){
        window.requestAnimationFrame(animate)
        background.draw()
        
        player.draw()
        //c.drawImage(image1, -735,-600)
        boundaries.forEach(boundary => {
            boundary.draw()

        }) 

            //if (playerImage.position.x + playerImage.width)
        //collisions
        //controls
        let moving = true
        if (keys.w.pressed
            && lastKey === 'w'){
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

