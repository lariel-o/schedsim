import { avaiableAlgorithms } from "../algorithms/main.js"
import logs from './logs/logs.js'

// Represents the Status of the pseudo-kernel
class Status {
    currentTime         = 0
    unitOfTime          = 0

    runningProcess      = null

    // Fifo is the default algorithm in the simulator.
    avaiableAlgorithms      = avaiableAlgorithms
    algorithm               = this.avaiableAlgorithms["FIFO"]

    // Ready list save processes that are able to be send to execution
    readyList = []

    // Scheduled list save process that are waiting to go to CPU
    scheduledList = []

    currentLog          = []

    tickerPointer

    constructor(unitOfTime) {
        if(!unitOfTime)
            this.unitOfTime = 1000
        else
            this.unitOfTime = unitOfTime
    }


    // ================= Methods that deal with logs
    clearCurrentLog() { this.currentLog = [] }

    addToCurrentLog(logArr) {
        if (this.currentLog.length === 0) {
            this.currentLog.push([...logArr])
            return
        }

        const lastIndice = this.currentLog.length - 1
        const lastLog = this.currentLog[lastIndice]

        if (lastLog[0] === logArr[0]) {
            if (logArr.length > 1) {
                lastLog.push(logArr[1])
            }
            return
        }

        this.currentLog.push([...logArr])
    }

    printPrettyLog() {
        let blockString = ""

        for(let i of this.currentLog) {
            for(let j in i) {
                if(j == 0)
                    blockString += `[${i[0]}]\n`

                else {
                    blockString += `    > ${i[j]}\n`
                }
            }
        }

        console.log("\n========= ============")
        console.log(blockString)
        this.clearCurrentLog()
    }


    // ================= Methods that deal with process
    // Add a process to the end of the ready list
    addProcessToReadyList(process){ this.readyList.push(process) }

    changeAlgorithm(algorithmName) {
        if(!avaiableAlgorithms[algorithmName]) {
            this.addToCurrentLog(logs["#2"][0])

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
        this.addToCurrentLog(logs["#3"][0])

        for(let i = 0; i < this.scheduledList.length; i++) {
            const seeing = this.scheduledList[i]
            if(seeing.startsAt == this.currentTime) {
                this.addToCurrentLog(logs["#3"][1])
                this.addToCurrentLog(logs["#3"][2])

                const process = this.scheduledList.splice(i, 1)[0]
                this.addProcessToReadyList(process)
                i--

                this.addToCurrentLog(logs["#3"][3])
            }
        }
    }

    // Check if a runningProcess have timedout
    checkRunningProcess() {
        if(!this.runningProcess) {
            this.addToCurrentLog(logs["#4"][1])

            return
        } 

        if(this.runningProcess.timeAtCPU == this.runningProcess.finishAfter) {
            this.addToCurrentLog(logs["#4"][0])

            this.runningProcess = null
            return
        }

        this.addToCurrentLog(logs["#4"][2])
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

            this.addToCurrentLog(logs["#5"][0])
            const algorithmMsgLog = this.algorithm({
                readyList: this.readyList,
                runningProcess: this.runningProcess,
                chooseProcess: this.chooseProcess
            })
            this.addToCurrentLog(logs["#5"][1])

            // ========================== Final section
            // Increments currentTime by 1
            this.addToCurrentLog(logs["#6"][0])
            this.currentTime++

            // If exists a process running now, increments timeAtCPU by 1
            if(this.runningProcess) {
                this.addToCurrentLog(logs["#6"][1])
                this.runningProcess.timeAtCPU++
            }

            this.clearCurrentLog()
            // this.addCurrentLogToLogList()

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


