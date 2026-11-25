const logs = {
    "#1": {
        0: ["FINISHING TICK", "Increments by one the uptime"],
        1: ["FINISHING TICK", "Increments by one the running process time at cpu"],
        
    },

    "#2": {
        0: ["ERROR CHOOSING SCHEDULE ALGORITHM!", "Provided algorithm name doesen't exists"],
    },

    "#3": {
        0: ["LOOKING INTO SCHEDULE LIST",  "looking for a process waiting to join readyList"],
        1: ["LOOKING INTO SCHEDULE LIST",  "FOUND! There is a process waiting to join CPU"],
        2: ["LOOKING INTO SCHEDULE LIST",  "Trying to add the new process to readyList"],
        3: ["LOOKING INTO SCHEDULE LIST",  "A new process have been added to readyList"],

    },

    "#4": {
        0: ["CHECKING IF A RUNNING PROCESS FINISHED", "The current running process have finished, removing it from CPU"],
        1: ["CHECKING IF A RUNNING PROCESS FINISHED", "There isn't any process running now, skipping"],
        2: ["CHECKING IF A RUNNING PROCESS FINISHED", "The current running process still executing"],
    },

    "#5": {
        0: ["ALGORITHM LOG", "Starting to execute the schedule algorithm"],
        1: ["ALGORITHM LOG", "Finished executing schedule algorithm"],
    },

    "#6": {
        0: ["FINISHING TICK", "Increments by one the uptime"],
        1: ["FINISHING TICK", "Increments by one the current running process uptime"],
    }


}

export default logs

