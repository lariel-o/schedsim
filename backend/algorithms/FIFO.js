const FIFO = ({ readyList, runningProcess, chooseProcess }) => {
    if(!runningProcess)
        chooseProcess(0)
}

export default FIFO

