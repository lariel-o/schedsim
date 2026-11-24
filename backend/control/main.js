import { avaiableAlgorithms } from "../algorithms/main.js"

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

    logs                = []
    currentLog          = []

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
        this.logs.push(this.currentLog)

        this.currentLog = []
    }

    // Add a new line to currentLog
    addNewLogLine(obj) {
        let found = false
        for(let i in this.currentLog) {
            if(this.currentLog[i][0] == obj.blockName) {
                found = true
                this.currentLog[i].push(obj.msg)
                break;
            }
        }

        if(!found) {
            this.currentLog.push([obj.blockName])
            this.currentLog[this.currentLog.length - 1].push(obj.msg)
        }
    }

    appendLogMsg(blockName, msgArray) {
        for(let i in this.currentLog) {
            if(this.currentLog[i][0] == blockName) {
                this.currentLog[i] = this.currentLog[i].concat(msgArray)
                break;
            }
        }
    }

    addNewLogBlockName(name) {
        // search if the block already exists
        for(let i in this.currentLog) {
            if(this.currentLog[i][0] == name) {
                return
            }
        }

        // If not found, add the blockName
        this.currentLog.push([name])
    }

    // ================= Methods that deal with process
    
    // Add a process to the end of the ready list
    addProcessToReadyList(process){ this.readyList.push(process) }

    changeAlgorithm(algorithmName) {
        if(!avaiableAlgorithms[algorithmName]) {
            this.addNewLogLine({
                blockName: "ERROR CHOOSING ALGORITHM!!!!!!",
                msg: "Provided name doesen't exists"
            })

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
        this.addNewLogLine({
            blockName: "LOOKING INTO SCHEDULE LIST",
            msg: "looking for a process waiting to join readyList"
        })

        for(let i = 0; i < this.scheduledList.length; i++) {
            const seeing = this.scheduledList[i]
            if(seeing.startsAt == this.currentTime) {
                this.addNewLogLine({
                    blockName: "LOOKING INTO SCHEDULE LIST",
                    msg: `FOUND! Process with PID ${seeing.PID} wants to join ready list`
                })

                this.addNewLogLine({
                    blockName: "LOOKING INTO SCHEDULE LIST",
                    msg: `Adding process with PID ${seeing.PID} to ready list`
                })

                const process = this.scheduledList.splice(i, 1)[0]
                this.addProcessToReadyList(process)
                i--

                this.addNewLogLine({
                    blockName: "LOOKING INTO SCHEDULE LIST",
                    msg: `Added`
                })
            }
        }
    }

    // Check if a runningProcess have timedout
    checkRunningProcess() {
        this.addNewLogBlockName("CHECKING IF A RUNNING PROCESS HAVE TIMEDOUT")
        if(!this.runningProcess) {
            this.addNewLogLine({
                blockName: "CHECKING IF A RUNNING PROCESS HAVE TIMEDOUT",
                msg: "there isn't any process running now. Jumping"
            })

            return
        } 

        if(this.runningProcess.timeAtCPU == this.runningProcess.finishAfter) {
            this.addNewLogLine({
                blockName: "CHECKING IF A RUNNING PROCESS HAVE TIMEDOUT",
                msg: `process with PID ${this.runningProcess.timeAtCPU} finished.
                Removing from CPU`
            })

            this.runningProcess = null
            return
        }

        this.addNewLogLine({
            blockName: "CHECKING IF A RUNNING PROCESS HAVE TIMEDOUT",
            msg: `process with PID ${this.runningProcess.timeAtCPU} still executing.`
        })
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

            this.addNewLogLine({
                blockName: "EXECUTING SCHEDULE ALGORITHM",
                msg: "starting now"
            })

            const algorithmMsgLog = this.algorithm({
                readyList: this.readyList,
                runningProcess: this.runningProcess,
                chooseProcess: this.chooseProcess
            })
            this.appendLogMsg("EXECUTING SCHEDULE ALGORITHM", algorithmMsgLog)


            // ========================== Final section
            this.addNewLogLine({
                blockName: "FINISHING TICK",
                msg: "Increments by one the uptime"
            })

            // Increments currentTime by 1
            this.currentTime++

            this.addNewLogLine({
                blockName: "FINISHING TICK",
                msg: "Increments by one the running process time at cpu"
            })

            // If exists a process running now, increments timeAtCPU by 1
            if(this.runningProcess) {
                this.runningProcess.timeAtCPU++
            }

            this.addCurrentLogToLogList()

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


