import FIFO from "./FIFO.js"
import SJF from "./SJF.js"
import roundRobin from "./roundrobin.js"

const avaiableAlgorithms = {
    "FIFO": FIFO,
    "SJF":  SJF,
    "round robin":  roundRobin,
}

export { avaiableAlgorithms }

