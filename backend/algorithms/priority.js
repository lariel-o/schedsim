const priority = ({ readyList, runningProcess, chooseProcess }) => {
    if(runningProcess)
        runningProcess.priority--

    if(readyList.length === 0)
        return

    let highestPriorityIndice = readyList.length - 1

    for(let i = highestPriorityIndice; i >= 0; i--) {
        if(readyList[highestPriorityIndice].priority < readyList[i].priority)
            highestPriorityIndice = i
    }

    if(!runningProcess || runningProcess.priority < readyList[highestPriorityIndice].priority)
        chooseProcess(highestPriorityIndice)
}

export default priority
