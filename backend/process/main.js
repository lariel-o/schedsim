let lastPID = 0

// Process is a constructor that returns an object that represent a process.
// Notice that the lastPID is a counter that increments each time a new
// process is build
class Process {
    constructor(startsAt, finishAfter, deadlineAfter, priority) {
        this.PID            = lastPID
        this.startsAt       = startsAt
        this.finishAfter    = finishAfter
        this.deadlineAfter  = deadlineAfter
        this.priority       = priority

        lastPID++
    }
}

export {
    Process
}

