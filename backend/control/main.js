class Status {
    readyList = []

    addProcessToReadyList = (process) => {
        this.readyList.push(process)
    }

    removeProcessFromReadyList = (indice) => {
        this.readyList.splice(indice, 1)
    }
}

const pseudoKernelStatus = new Status()

export { pseudoKernelStatus }


