// Google websockets to make it two player over LAN

// Constants
const SOFT = 5
const HARD = 2
const EAT_DIST = 3
const NUM_SEGMENTS = 10
const HEAD_COLOR = "rgb(0, 10, 26)"
const TAIL_COLOR = "rgb(0, 0, 0)"
const SVG_SCALE = 198
const TAIL_LEN = 50
const SIZE_REDUCTION = 0.02
const SIZE_MIN = 0.1

// Global variables
let i = 0
let mouse_pos = [0, 0]
const svg = document.getElementById("main")
var head = document.getElementById("head");
let clones = []
let snake_len = 0
let size = 1.95
let food = document.getElementById("food")

const mix = (n) => `color-mix(in hsl decreasing hue, ${HEAD_COLOR} ${100 * (1 - n)}%, ${TAIL_COLOR} ${100 * n}%)`
head.style.fill = mix(0)



// Functions

//===================================================================
// MATH FUNCTIONS
//===================================================================

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
    
//============================================================================
// Less Math Functions
//============================================================================

function cloneBall() { // creating 1 ball clone for snake segments
    const newball = head.cloneNode()
    newball.removeAttribute("id")
    newball.style.fill = mix((snake_len + 1) / (NUM_SEGMENTS + 1))
    svg.appendChild(newball)
    
    if (snake_len <= TAIL_LEN) {
        newball.setAttribute("r", size)
        if (size >= SIZE_MIN){
            size -= SIZE_REDUCTION
        }
        clones.push(newball)
    }
    else {
        clones.unshift(newball)
    }
    snake_len += 1
    
    return newball
}
while (snake_len <= NUM_SEGMENTS){ // Creating multiple ball clones
    cloneBall()
}





function touch_food(pElement, pFood){
    let ballx = Number(pElement.getAttribute("cx"))
    let bally = Number(pElement.getAttribute("cy"))
    let ball_pos = [ballx, bally]

    let foodx = Number(pFood.getAttribute("cx"))
    let foody = Number(pFood.getAttribute("cy"))
    let food_pos = [foodx, foody]

    let food_dir = [food_pos[0] - ball_pos[0], food_pos[1] - ball_pos[1]]
    let food_len = Math.sqrt(food_dir[0] ** 2 + food_dir[1] ** 2)
    if (food_len < EAT_DIST){
        return true
    }
    
}


function collect_food(){

    let randx = Math.random() * SVG_SCALE
    let randy = Math.random() * SVG_SCALE

    if (touch_food(head, food)){
        
        cloneBall()
        food.setAttribute("cx", randx)
        food.setAttribute("cy", randy)

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

//=========================================================================================
// the bit where things happen
//==========================================================================================


function make_it_go(){ // moving all the balls
    moveball(mouse_pos, head)
    collect_food()
    let target = [
        head.getAttribute("cx"),
        head.getAttribute("cy"),
    ]
    for(let i = 0; i < clones.length; i += 1) { // iterating through cone list to move clones
        moveball(target, clones[i])
        target = [
            clones[i].getAttribute("cx"),
            clones[i].getAttribute("cy"),
        ]
    }
}


// Main program

timer = setInterval(make_it_go, 2) // Move every 2 milliseconds

  


