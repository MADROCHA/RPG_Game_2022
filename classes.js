class Sprite {
    constructor({
        position,
        velocity,
        image,
        frames = {
            max:1,
            hold: 10,
        },
        sprites,
        animate = false,
        //health,

        //
        rotation = 0,
    }){
        this.position = position
        this.image = new Image()
        this.frames = {...frames, val:0, elapsed:0} 

        this.image.onload = ()=> {
            this.width = this.image.width / frames.max
            this.height = this.image.height 
        }
        this.image.src = image.src
        
        this.animate = animate
        this.sprites = sprites
        this.opacity = 1
        //this.health = this.health
        
        this.rotation = rotation
    }
    draw(){
        /* c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            
            ) */
        //
        c.save()
        c.translate(
            this.position.x + this.width * 0.5,
            this.position.y + this.height * 0.5,
            )
            c.rotate(this.rotation)
            c.translate(
            -this.position.x - this.width * 0.5,
            -this.position.y - this.height * 0.5,
                )
        c.globalAlpha = this.opacity
        c.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            
            this.position.x,
            this.position.y,

            this.image.width / this.frames.max,
            this.image.height,
            )
        c.restore()
        //
            if(!this.animate) return
                if(this.frames.max >1){
                    this.frames.elapsed++
                }
                if(this.frames.elapsed % this.frames.hold === 0)
                if(this.frames.val < this.frames.max -1){
                    this.frames.val++
                } else this.frames.val = 0
            
    }
    
    update(){

    }
}
class Monster extends Sprite{
    constructor({
        position,
        velocity,
        image,
        frames = {
            max:1,
            hold: 10,
        },
        sprites,
        animate = false,
        //health,

        //
        rotation = 0,
        isEnemy = false,
        name,
        // new MONSTER
        attacks,
    }) {
        super({
            position,
            velocity,
            image,
            frames,
            sprites,
            animate,
            rotation,
        })
        this.health = 100
        this.isEnemy = isEnemy
        this.name = name
        // new MONTER
        this.attacks = attacks

    }
    faint(){
        //console.log('fainted')
        document.querySelector('#dialogueBox').innerHTML = 
        this.name + ' fainted!'
        gsap.to(this.position, {
            y: this.position.y + 20
        })
        gsap.to(this, {
            opacity:0,

            // added to fix position after fainted
            onComplete:()=>{
            
                gsap.to(this.position, {
                    y: this.position.y - 20
                })
            }
            //
        })
        audio.battle.stop()
        audio.victory.play()

    }
    attack({attack,recipient, renderedSprites}){
        document.querySelector('#dialogueBox').style.display = 'block'
        document.querySelector('#dialogueBox').innerHTML = 
        this.name + ' used ' + attack.name;

        let healthBar = '#recipientHealthBar'
        if(this.isEnemy) healthBar = '#playerHealthBar'

        let rotation = 1
        if(this.isEnemy) rotation = -2.2

        recipient.health -= attack.damage

        switch (attack.name){
            case 'Fireball':
                //
                audio.initFireball.play()
                //
                const fireballImage = new Image();
                fireballImage.src = './img/battle/fireball.png'
                const fireball = new Sprite({
                    position:{
                        x:this.position.x,
                        y:this.position.y,
                    },
                    image: fireballImage,
                    frames:{
                        max:4,
                        hold:10,

                    },
                    animate:true,
                    rotation,
                })
                
                renderedSprites.splice(1, 0, fireball)

                gsap.to(fireball.position,{
                    x:recipient.position.x,
                    y:recipient.position.y,
                    onComplete:()=>{
                        // get hit
                        //
                        audio.fireballHit.play()
                        //
                        gsap.to(healthBar, {
                            width: recipient.health + '%',
                        })
                        //
                        gsap.to(recipient.position, {
                            x: recipient.position.x - 10,
                            yoyo: true,
                            repeat: 7,
                            duration: 0.08,
                            
                        })
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08,
                        })
                        renderedSprites.splice(1, 1)
                    }
                })
            break;
        case 'Tackle':
            const tl = gsap.timeline()
                
            let movementDistance = 20
        
            if(this.isEnemy) movementDistance = -20
            tl.to(this.position,{
                x:this.position.x - movementDistance
            }).to(this.position, {
                x:this.position.x + movementDistance * 2,
                duration: 0.1,
                onComplete: ()=>{
                    // get hit
                    //
                    audio.tackleHit.play()
                    //
                    gsap.to(healthBar, {
                        width: recipient.health + '%',
                    })
                    //
                    gsap.to(recipient.position, {
                        x: recipient.position.x - 10,
                        yoyo: true,
                        repeat: 7,
                        duration: 0.08,
                        
                    })
                    gsap.to(recipient, {
                        opacity: 0,
                        repeat: 5,
                        yoyo: true,
                        duration: 0.08,
                    })
                }
            }).to(this.position, {
                x:this.position.x 
            })    
            break;
        case 'IceSpike':
            const iceSpikeImage = new Image();
            iceSpikeImage.src = 'img/battle/icespike1.png'
            const icespike = new Sprite({
                position:{
                    x:recipient.position.x,
                    y:recipient.position.y + recipient.height *0.5
                },
                image: iceSpikeImage,
                frames:{
                    max: 9,
                    hold:13,
                },
                animate:true,

            })
            renderedSprites.splice(1, 0, icespike)
            
            
            gsap.to(icespike.position,{
                    x:icespike.position.x,
                    y:icespike.position.y -30,
                    onComplete:()=>{
                        
                        /* repeat:1,
                        yoyo:1, */
                        //getHit
                    audio.icespikeHit.play()
                    gsap.to(healthBar, {
                        width: recipient.health + '%',
                    })
                    gsap.to(recipient.position, {
                        x: recipient.position.x - 10,
                        yoyo: true,
                        repeat: 7,
                        duration: 0.20,
                        
                    })
                    gsap.to(recipient, {
                        opacity: 0,
                        repeat: 5,
                        yoyo: true,
                        duration: 0.20,
                        onComplete:()=>{

                            renderedSprites.splice(1, 1)
                        } 
                    })
                    //renderedSprites.splice(1, 1)

                }
            })
            break;
            /* case 'Waterblast':
                //
                //
                const waterblastImage = new Image()
                waterblastImage.src = './img/battle/waterblast.png'
                const waterblast = new Sprite ({
                    position:{
                        x:this.position.x,
                        y:this.position.y
                    },
                    image: waterblastImage,
                    frames: {
                        max:4,
                        hold:10
                    },
                    animate: true,
                    rotation,
                })
                renderedSprites.splice(1, 0, waterblast)
                audio.waterblastInit.play()

                gsap.to(waterblast.position,{
                    x:recipient.position.x,
                    y:recipient.position.y,
                    onComplete:()=>{
                        // get hit
                        //
                        //audio.waterblastHit.play()
                        //
                        gsap.to(healthBar, {
                            width: recipient.health + '%',
                        })
                        //
                        gsap.to(recipient.position, {
                            x: recipient.position.x - 10,
                            yoyo: true,
                            repeat: 7,
                            duration: 0.08,
                            
                        })
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08,
                        })
                        renderedSprites.splice(1, 1)
                    }
                })
                */
                case 'Waterblast':
                    //
                    //
                    const waterblastImage = new Image()
                    waterblastImage.src = './img/battle/waterblast.png'
                    const waterblast = new Sprite ({
                        position:{
                            //x:recipient.position.x + this.width *0.10,
                            //y:recipient.position.y -30
                            x: recipient.position.x,
                            y: recipient.position.y
                        },
                        image: waterblastImage,
                        frames: {
                            max:4,
                            hold:15
                        },
                        animate: true,
                        //rotation,
                    })
                    renderedSprites.splice(1, 0, waterblast)
                    audio.waterblastInit.play()
                    

                    gsap.to(healthBar, {
                        width: recipient.health + '%',
                    })
                    gsap.to(recipient.position, {
                        x: recipient.position.x - 10,
                        yoyo: true,
                        repeat: 7,
                        duration: 0.20,
                        
                    })
                    gsap.to(recipient, {
                        opacity: 0,
                        repeat: 5,
                        yoyo: true,
                        duration: 0.20,
                    })
                    gsap.to(waterblast,{
                        duration:0.9,
                        onComplete:()=>{
    
                            renderedSprites.splice(1, 1)
                        }, 
                    })

    
        }
    } 
}
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
        if(!debugDev){
            c.fillStyle = ' rgb(0, 0, 255, 0.2)'
            c.fillRect(
                this.position.x,
                this.position.y,
                this.width,
                this.height,
                )
            }
    }
}
const boundaries = []
const offset = {
    x:-735,
    y:-650
} 

