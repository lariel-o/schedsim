import FIFO from "./FIFO.js"
import SJF from "./SJF.js"
import priority from "./priority.js"
import roundRobin from "./roundRobin.js"

const avaiableAlgorithms = {
    "FIFO": FIFO,
    "SJF":  SJF,
    "round robin":  roundRobin,
    "priority":  priority,
}

export { avaiableAlgorithms }

