const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battle/battleBackground.png'
const battleBackground = new Sprite({
    position: {
        x:0,
        y:0
    },
    image: battleBackgroundImage,
})


const draggle = new Monster(monsters.Draggle)

const emby = new Monster(monsters.Emby)
//console.log(emby)
const renderedSprites = [draggle, emby]

emby.attacks.forEach(attack =>{

    const button = document.createElement('button')
    button.innerHTML = attack.name
    document.querySelector('#attacksBox').append(button)
})

function animateBattle() {
    window.requestAnimationFrame(animateBattle)
    battleBackground.draw()
    

    renderedSprites.forEach((sprite) =>{
        sprite.draw()
    })
}
animateBattle()
const queue = []
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

        const randomAttack = draggle.attacks[Math.floor(Math.random()*draggle.attacks.length)]
        queue.push(() => {
            draggle.attack({
                attack: randomAttack,
                recipient: emby,
                renderedSprites
            })
        })
    
    })

    button.addEventListener('mouseenter', (e)=>{
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        document.querySelector('#attackType').innerHTML = selectedAttack.type
    })
})
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