import { avaiableAlgorithms } from "../algorithms/main.js"

// Represents the Status of the pseudo-kernel
class Status {
    currentTime         = 0
    unitOfTime          = 0

    runningProcess      = null

    // Fifo is the default algorithm in the simulator.
    avaiableAlgorithms     = avaiableAlgorithms
    algorithm               = this.avaiableAlgorithms["FIFO"]

    // Ready list save processes that are able to be send to execution
    readyList = []

    // Scheduled list save process that are waiting to go to CPU
    scheduledList = []


    tickerPointer


    constructor(unitOfTime) {
        if(!unitOfTime)
            this.unitOfTime = 1000
        else
            this.unitOfTime = unitOfTime
    }

    // ================= Methods that deal with process
    
    // Add a process to the end of the ready list
    addProcessToReadyList(process){ this.readyList.push(process) }

    changeAlgorithm(algorithmName) {
        if(!avaiableAlgorithms[algorithmName]) {
            console.log(`Error, algorithm with name ${algorithmName} does not exists. Aborting`)
            return
        }
        
        this.algorithm = avaiableAlgorithms[algorithmName]
    }

    // Remove the process at the given indice from ready list
    removeProcessFromReadyList(indice) { this.readyList.splice(indice, 1) }

    // Schedule a process to be added in ready list
    scheduleProcess(process) { this.scheduledList.push(process) }

    // Check if have any process in scheduled list to be added in ready list. If have, do it
    checkScheduleList() {
        for(let i in this.scheduledList) {
            if(this.scheduledList[i].startsAt == this.currentTime) {
                const process = this.scheduledList.splice(i, 1)[0]
                this.addProcessToReadyList(process)
            }
        }
    }

    checkRunningProcess() {
        if(!this.runningProcess)
            return

        if(this.runningProcess.timeAtCPU == this.runningProcess.finishAfter)
            this.runningProcess = null
    }

    chooseProcess = (indice) => {
        const sendToRunningProcess = this.readyList.splice(indice, 1)[0]
        const currentRunningProcess = this.runningProcess

        if(currentRunningProcess)
            this.addProcessToReadyList(currentRunningProcess)

        this.sendToRunningProcess = null
        if(sendToRunningProcess)
            this.runningProcess = sendToRunningProcess
    }
    // ================= Methods that deal with simulator execution

    // Start the simulator
    startSimulator(factor = 1) {
        // Stop the last Ticker if it exists
        clearInterval(this.tickerPointer)

        // Start the new ticker
        this.tickerPointer = setInterval(()=>{
            // ========================== Start section
            // Check if a running process have timedout
            this.checkRunningProcess()

            // Check if have any scheduled process to be added in ready list
            this.checkScheduleList()

            this.algorithm({
                readyList: this.readyList,
                runningProcess: this.runningProcess,
                chooseProcess: this.chooseProcess
            })



            // ========================== Final section
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


