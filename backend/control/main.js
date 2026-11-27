import { avaiableAlgorithms } from "../algorithms/main.js"
import logs from './logs/logs.js'

// Represents the Status of the pseudo-kernel
class Status {
    currentTime         = 0
    unitOfTime          = 0

    runningProcess      = null

    quantum             = 0
    runningQuantum      = 0

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

    // Set quantum value before starting simulation
    setQuantum(quantum) {
        this.quantum = quantum
        this.runningQuantum = 0
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

            return false
        } 

        if(this.runningProcess.timeAtCPU == this.runningProcess.finishAfter) {
            this.addToCurrentLog(logs["#4"][0])

            this.runningProcess = null

            return true
        }

        this.addToCurrentLog(logs["#4"][2])
        return false
    }

    chooseProcess = (indice) => {
        if(indice < 0 || indice >= this.readyList.length)
            return

        const sendToRunningProcess = this.readyList.splice(indice, 1)[0]
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
            console.log([...this.readyList], [...this.scheduledList], this.currentTime, this.runningProcess)
            // ========================== Start section
            // Check if a running process have timedout
            const processFinished = this.checkRunningProcess()

            // Check if have any scheduled process to be added in ready list
            this.checkScheduleList()

            const quantumReached = this.runningQuantum === this.quantum
            if(processFinished || quantumReached || this.runningQuantum === 0) {
                if(quantumReached && this.quantum > 0) {
                    this.addToCurrentLog(logs["#7"][0])
                }

                this.addToCurrentLog(logs["#5"][0])
                this.algorithm({
                    readyList: this.readyList,
                    runningProcess: this.runningProcess,
                    chooseProcess: this.chooseProcess
                })
                this.addToCurrentLog(logs["#5"][1])
            }

            if(quantumReached)
                this.runningQuantum = 0

            // ========================== Final section
            // If exists a process running now, increments timeAtCPU by 1
            if(this.runningProcess) {
                this.addToCurrentLog(logs["#6"][1])
                this.runningProcess.timeAtCPU++

                if(this.quantum > 0) {
                    this.addToCurrentLog(logs["#7"][1])
                    this.runningQuantum++
                }
            }

            // Increments currentTime by 1
            this.addToCurrentLog(logs["#6"][0])
            this.currentTime++

            this.clearCurrentLog()
            // this.addCurrentLogToLogList()

            console.log([...this.readyList], [...this.scheduledList], this.currentTime, this.runningProcess)
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
