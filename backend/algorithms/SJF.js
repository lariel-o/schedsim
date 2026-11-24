const SJF = ({ readyList, runningProcess, chooseProcess }) => {
    if(!runningProcess) {
        // Verify if exist anything in readyList
        if(readyList.length != 0) {
            let shortestIndice = readyList.length - 1

            for(let i = shortestIndice; i >= 0; i--) {
                const currentProcess = readyList[i]
                const shortestProcess = readyList[shortestIndice]

                if(currentProcess.finishAfter < shortestProcess.finishAfter) {
                    shortestIndice = i
                }
            }

            chooseProcess(shortestIndice)
        }
    }
}

export default SJF

