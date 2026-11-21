// Represents the Status of the pseudo-kernel
class Status {
    currentTime = 0
    unitOfTime = 0

    tickerPointer

    // Ready list save the processes that are able to be send to execution
    readyList = []

    constructor(unitOfTime) {
        if(!unitOfTime)
            this.unitOfTime = 1000
        else
            this.unitOfTime = unitOfTime
    }

    // Add a process to the end of the ready list
    addProcessToReadyList(process){ this.readyList.push(process) }

    // Remove the process at the given indice from ready list
    removeProcessFromReadyList(indice) { this.readyList.splice(indice, 1) }

    // Start the simulator
    startSimulator(factor = 1) {
        // Stop the last Ticker if it exists
        clearInterval(this.tickerPointer)

        // Start the new ticker
        this.tickerPointer = setInterval(()=>{
            this.currentTime++
        }, this.unitOfTime / factor)
    }

    // Stop the simulator
    stopSimulator() {
        clearInterval(this.tickerPointer)
    }

    // Speed up the simulator ticker interval
    speedUpSimulator(factor) {
        this.startSimulator(factor)
    }

    // Reset simulator speed by a factor of 1
    resetSimulatorSpeed() {
        this.startSimulator()
    }
}

const pseudoKernelStatus = new Status()

export { pseudoKernelStatus }


