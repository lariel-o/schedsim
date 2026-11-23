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

    logs        = []
    currentLog  = null


    tickerPointer


    constructor(unitOfTime) {
        if(!unitOfTime)
            this.unitOfTime = 1000
        else
            this.unitOfTime = unitOfTime
    }

    // ================= Methods that deal with logs
    // Put currentLog in logs list
    addCurrentLogToLogList() {
        logs.push(this.currentLog)

        this.currentLog = null
    }

    // Add a new line to currentLog
    addNewLogLine(label, msg) {
        if(length(this.logs) != 0)
            this.currentLog + "\n"

        this.currentLog += `[${label}]\n`
        this.currentLog += msg
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
        this.addNewLogLine("CHECKING IF THERE IS ANY PROCESS WATING TO JOIN READY LIST", 
            "> start looking at scheduled list")
        for(let i in this.scheduledList) {
            this.addNewLogLine("CHECKING IF THERE IS ANY PROCESS WATING TO JOIN READY LIST", 
                `> looking at the process with PID ${this.scheduledList[i].PID}`)

            if(this.scheduledList[i].startsAt == this.currentTime) {
            this.addNewLogLine("CHECKING IF THERE IS ANY PROCESS WATING TO JOIN READY LIST", 
                `> ${this.scheduledList[i].PID} want to join! Adding process with PID ${this.scheduledList[i].PID} to readyList`)
                const process = this.scheduledList.splice(i, 1)[0]
                this.addProcessToReadyList(process)
            }
        }
    }

    // Check if a runningProcess have timedout
    checkRunningProcess() {
        if(!this.runningProcess) {
            this.addNewLogLine("CHECKING IF PROCESS HAVE TIMEDOUT", "> THERE ISN'T ANY RUNNING PROCESS")
            return
        } 

        this.addNewLogLine("CHECKING IF PROCESS HAVE TIMEDOUT",
        `> PROCESS ${this.runningProcess.PID} with ${this.runningProcess} times at CPU, it need a total of ${this.runningProcess.finishAfter} times to finish!`)

        if(this.runningProcess.timeAtCPU == this.runningProcess.finishAfter) {
            this.addNewLogLine("CHECKING IF PROCESS HAVE TIMEDOUT",
            `> process finished its execution, leaving cpu`)

            this.runningProcess = null
            return
        }

        this.addNewLogLine("CHECKING IF PROCESS HAVE TIMEDOUT",
        `> process still executing, leave it alone`)
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
            this.addNewLogLine("STARTING TICK", `current at ${this.currentTime}`)
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


            this.addNewLogLine("EXECUTING PROCESS", 
                `> process ${this.runningProcess} is executing now!`)


            this.addNewLogLine("FINISHING TICK", 
                `current at ${this.currentTime}`)
            // ========================== Final section
            // Increments currentTime by 1
            this.addNewLogLine("FINISHING TICK", 
                `> updating uptime by one, before: ${this.currentTime}, now: ${this.currentTime + 1}`)
            this.currentTime++

            // If exists a process running now, increments timeAtCPU by 1
            this.addNewLogLine("FINISHING TICK", 
                `> updating current process executing time by one, before: ${this.runningProcess.timeAtCPU}, now: ${this.runningProcess.timeAtCPU + 1} \n`)
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


