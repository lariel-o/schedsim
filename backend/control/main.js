// Represents the Status of the pseudo-kernel
class Status {
    currentTime = 0
    unitOfTime = 0

    tickerPointer

    // Ready list save processes that are able to be send to execution
    readyList = []

    // Scheduled list save process that are waiting to go to CPU
    scheduledList = []

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

    scheduleProcess(process) { this.scheduledList.push(process) }

    checkScheduleList() {
        for(let i in this.scheduledList) {
            if(this.scheduledList[i].startsAt == this.currentTime) {
                const process = this.scheduledList.splice(i, 1)
                this.addProcessToReadyList(process)
            }
        }
    }

    // Start the simulator
    startSimulator(factor = 1) {
        // Stop the last Ticker if it exists
        clearInterval(this.tickerPointer)

        // Start the new ticker
        this.tickerPointer = setInterval(()=>{
            // Check if have any scheduled process to be added in ready list
            this.checkScheduleList()

            // Increments currentTime by 1
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


