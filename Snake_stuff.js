// Constants
const SOFT = 5
const HARD = 2
const NUM_SEGMENTS = 50
const HEAD_COLOR = "hsla(318, 100%, 5%, 1.00)"
const TAIL_COLOR = "hsla(0, 0%, 100%, 1.00)"

// Global variables
let i = 0
let mouse_pos = [0, 0]
const svg = document.getElementById("main")
var redball = document.getElementById("redball");
let clones = []
let count = 0

const mix = (n) => `color-mix(in hsl decreasing hue, ${HEAD_COLOR} ${100 * (1 - n)}%, ${TAIL_COLOR} ${100 * n}%)`
redball.style.fill = mix(0)

// Functions
function cloneBall() { // creating 1 ball clone for snake segments
    const newball = redball.cloneNode()
    newball.removeAttribute("id")
    newball.style.fill = mix((count + 1) / (NUM_SEGMENTS + 1))
    svg.appendChild(newball)
    return newball
}
while (count <= NUM_SEGMENTS){ // Creating multiple ball clones
    clones.push(cloneBall())
    count += 1
}



function moveball(target, pElement){ // Actually moving 1 segment
    i += 1
    let ballx = Number(pElement.getAttribute("cx"))
    let bally = Number(pElement.getAttribute("cy"))
    let ball_pos = [ballx, bally]

    // if (i % 100 == 0){
    //     console.log(ballx + "," + bally)
    //     console.log(target[0] + "," + target[1])
    // }

    // random math stuff (vectors) start
    let target_dir = [target[0] - ball_pos[0], target[1] - ball_pos[1]]
    let target_len = Math.sqrt(target_dir[0] ** 2 + target_dir[1] ** 2)
    if (target_len < HARD) return

    let speed = 0.3
    const frac = (target_len - HARD) / (SOFT - HARD);
    speed *= Math.min(Math.max(frac, 0), 1)

    target_dir[0] /= Math.max(target_len, 0.01)
    target_dir[1] /= Math.max(target_len, 0.01)
    target_dir[0] *= speed
    target_dir[1] *= speed
    // random math stuff end

    pElement.setAttribute("cx", ball_pos[0] + target_dir[0]) // moving the ball
    pElement.setAttribute("cy", ball_pos[1] + target_dir[1])
}
    
function all_move(){ // moving all the balls
    moveball(mouse_pos, redball)
    let target = [
        redball.getAttribute("cx"),
        redball.getAttribute("cy"),
    ]
    for(let i = 0; i < clones.length; i += 1) { // iterating through cone list to move clones
        moveball(target, clones[i])
        target = [
            clones[i].getAttribute("cx"),
            clones[i].getAttribute("cy"),
        ]
    }
}

document.addEventListener("mousemove", function update_mouse(e) { // Find mouse position on move
    let point = svg.createSVGPoint()
    point.x = e.clientX
    point.y = e.clientY
    point = point.matrixTransform(svg.getScreenCTM().inverse()) // convert it to svg position (something actually useful)

    mouse_pos[0] = point.x
    mouse_pos[1] = point.y
})

// Main program

timer = setInterval(all_move, 2) // Move every 2 milliseconds

  

