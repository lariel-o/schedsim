// Represents the Status of the pseudo-kernel
class Status {
    currentTime     = 0
    unitOfTime      = 0

    runningProcess = null

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

    // ================= Methods that deal with process
    
    // Add a process to the end of the ready list
    addProcessToReadyList(process){ this.readyList.push(process) }

    // Remove the process at the given indice from ready list
    removeProcessFromReadyList(indice) { this.readyList.splice(indice, 1) }

    // Schedule a process to be added in ready list
    scheduleProcess(process) { this.scheduledList.push(process) }

    // Check if have any process in scheduled list to be added in ready list. If have, do it
    checkScheduleList() {
        for(let i in this.scheduledList) {
            if(this.scheduledList[i].startsAt == this.currentTime) {
                const process = this.scheduledList.splice(i, 1)
                this.addProcessToReadyList(process)
            }
        }
    }

    checkRunningProcess() {
        if(this.runningProcess.timeAtCPU == this.runningProcess.finishAfter)
            this.runningProcess = null
        else
            this.runningProcess.timeAtCPU++
    }

    chooseProcess(indice) {
        const sendToRunningProcess = this.readyList.splice(indice, 1)
        const currentRunningProcess = this.runningProcess

        if(currentRunningProcess)
            this.addProcessToReadyList(currentRunningProcess)

        this.runningProcess = sendToRunningProcess
    }
    // ================= Methods that deal with simulator execution

    // Start the simulator
    startSimulator(factor = 1) {
        // Stop the last Ticker if it exists
        clearInterval(this.tickerPointer)

        // Start the new ticker
        this.tickerPointer = setInterval(()=>{
            this.checkRunningProcess()

            // Check if have any scheduled process to be added in ready list
            this.checkScheduleList()

            // Increments currentTime by 1
            this.currentTime++

            // If exists a process running now, increments timeAtCPU by 1
            if(this.runningProcess) {
                this.runningProcess.timeAtCPU++
            }
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


