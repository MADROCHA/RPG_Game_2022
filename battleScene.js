const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battle/battleBackground.png'
const battleBackground = new Sprite({
    position: {
        x:0,
        y:0
    },
    image: battleBackgroundImage,
})


//const draggle = new Monster(monsters.Draggle)
//const emby = new Monster(monsters.Emby)
//const renderedSprites = [draggle, emby]
//conso/le.log(emby)
//const queue = []
let draggle
let emby
let renderedSprites
let queue 


/*
emby.attacks.forEach(attack =>{

    const button = document.createElement('button')
    button.innerHTML = attack.name
    document.querySelector('#attacksBox').append(button)
}) 
*/

let battleAnimationId
function initBattle(){
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#recipientHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#attacksBox').replaceChildren()



    draggle = new Monster(monsters.Draggle)
    emby = new Monster(monsters.Emby)
    renderedSprites = [draggle, emby]
    queue = []

    emby.attacks.forEach(attack =>{
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attacksBox').append(button)
    })
    // EVENT LISTENER FUN BATTLE BUTTONS
    document.querySelectorAll('button').forEach((button) =>{
        button.addEventListener('click',(e)=>{
            console.log(e.currentTarget.innerHTML)
            const selectedAttack = attacks[e.currentTarget.innerHTML]
    
            emby.attack({
                attack: selectedAttack,
                recipient: draggle,
                renderedSprites
            })
            if(draggle.health <= 0){
                queue.push(() =>{
                    draggle.faint()
                })
                queue.push(() =>{
                    // fade to black
                    gsap.to('#overlappingDiv', {
                        opacity:1,
                        onComplete:()=>{
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#userInterface').style.display =
                            'none';
                            gsap.to('#overlappingDiv',{
                                opacity:0,
                            })
                            battle.initiated = false
                            audio.Map.play()
                        }
                    })
                })
                //return
            }
    
            const randomAttack = draggle.attacks[Math.floor(Math.random()*draggle.attacks.length)]
            queue.push(() => {
                draggle.attack({
                    attack: randomAttack,
                    recipient: emby,
                    renderedSprites
                })
            if(emby.health <= 0){
                queue.push(() =>{
                    emby.faint()
                })
                //return
                queue.push(() =>{
                    // fade to black
                    gsap.to('#overlappingDiv', {
                        opacity:1,
                        onComplete:()=>{
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#userInterface').style.display =
                            'none';
                            gsap.to('#overlappingDiv',{
                                opacity:0,
                            })
                            battle.initiated = false
                            audio.Map.play()
                        }
                    })
                })
            }
            })
        
        })
    
        button.addEventListener('mouseenter', (e)=>{
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#attackType').innerHTML = selectedAttack.type
            document.querySelector('#attackType').style.color = selectedAttack.color
    
        })
    })

}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()
    
    renderedSprites.forEach((sprite) =>{
        sprite.draw()
    })
}
//animate()
initBattle()
animateBattle()
//
document.querySelector('#dialogueBox').addEventListener('click', (e)=>{
    if (queue.length > 0 ){
        queue[0]()
        queue.shift()
    } else {

        e.currentTarget.style.display = 'none'
        console.log('clicked dialogue')
    }
})