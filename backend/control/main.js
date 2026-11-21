let readyList = []

const addProcessToReadyList = (process) => {
    readyList.push(process)
}

const removeProcessFromReadyList = (indice) => {
    readyList.splice(indice, 1)
}

export {
    addProcessToReadyList,
    removeProcessFromReadyList,
}

