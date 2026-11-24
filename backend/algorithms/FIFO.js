const FIFO = ({ readyList, runningProcess, chooseProcess }) => {
    let log = []

    log.push("Checking if exist a process running")
    if(!runningProcess) {
        log.push("There's no process running, choosing the first element from readyList if exists")

        chooseProcess(0)
    } else {
        log.push("There's a process running, jumping")
    }

    return log
}

export default FIFO

