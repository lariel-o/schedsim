const roundRobin = ({ runningProcess, chooseProcess, quantumReached }) => {
    if(!runningProcess || quantumReached) {
        chooseProcess(0)
    }
}

export default roundRobin
