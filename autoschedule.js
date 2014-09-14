/**
 * 
 */
//creates a moment from a date string
var createMoment = function(dateString){
    return moment(dateString);
}

//returns -1 if x is before y in minutes, 0 if same, 1 if after
var sortOnStartDate = function(firstEvent, secondEvent){
	var firstDateTime = firstEvent.start.dateTime;
	var firstDateEndTime = firstEvent.end.dateTime;
	var secondDateTime = secondEvent.start.dateTime;
	var secondDateEndTime = secondEvent.end.dateTime;
	if(!firstDateTime){
		firstDateTime = firstEvent.start.date;
	}
	if(!firstDateEndTime){
		firstDateEndTime = firstEvent.end.date;
	}
	if(!secondDateTime){
		secondDateTime = secondEvent.start.date;
	}
	if (!secondDateEndTime){
		secondDateEndTime = secondEvent.end.date;
	}
	var x = createMoment(firstDateTime);
    var y = createMoment(secondDateTime);
    return (x.isBefore(y, 'minute') ? -1 : x.isSame(y, 'minute') ? 0 : 1)
}

//returns a list of all calendar events from google overlapping at all with startBy-endBy range
//does not need to be sorted
var filterGoogleEvents = function(startByDateTime, endByDateTime, eList){
	var filteredEventList = [];
	var startBy = createMoment(startByDateTime);
	var endBy = createMoment(endByDateTime)
	for (index in eList){
		var eventStartDateTime = eList[index].start.dateTime;
		var eventEndDateTime = eList[index].end.dateTime;
		if (!eventStartDateTime){
			eventStartDateTime = eList[index].start.date;
		}
		if (!eventEndDateTime){
			eventEndDateTime = eList[index].end.date;
		}
		var eventStart = createMoment(eventStartDateTime);
		var eventEnd = createMoment(eventEndDateTime);
		
		//does currentEvent overlap with the range at all
		//if so, add it to the list of events in the range
		if (((eventStart.isAfter(startBy, 'minute') || eventStart.isSame(startBy, 'minute')) && (eventStart.isBefore(endBy, 'minute'))) 
			  || ((eventEnd.isAfter(startBy, 'minute') || eventEnd.isSame(startBy, 'minute')) && (eventEnd.isBefore(endBy, 'minute'))))
		{
			filteredEventList.push(eList[index]);
		}
	}
	return filteredEventList;
};

/*************************************** code above here tested and works **********************/

var taskToEvent = function(task){
	var event = {
		  	"kind": "calendar#event",
  			"status": task.status,
  			"summary": task.title, // title
  			"description": task.descript, // description
  			"location": 'Engineering', // location
  			"start": {
    			dateTime: task.date.actual,
       			timeZone: 'America/New_York'
  			},
  			"end": {
    			dateTime: moment(task.date.actual).add(task.duration, 'minutes').format(),
       			timeZone: 'America/New_York'
  			},
		};
	return event;
};

/*
 * "tasks": [{
			"id": 1,
			"title": "My first task",
			"type": "general",
			"date": {
				"set": {
					"start": "9/13/14",
					"end": "9/15/14"
					},
				"actual": "9/14/14 8:50 PM"
				},
			"length": "60",
			"descript": "this is a description about the first task.",
			"status": "scheduled"
		},{
			"id": 2,
			"title": "My second task",
			"type": "general",
			"date": {
				"set": {
					"start": "9/15/14",
					"end": "9/19/14"
					},
				"actual": "9/16/14 10:50 AM"
				},
			"length": "30",
			"descript": "this is a description about the second task.",
			"status": "scheduled"
		}]
 */



var createSlot = function(startDateTime, endDateTime){
	return {"start": startDateTime, "end": endDateTime};
}

//TODO: finish implementing, this is not necessary, more important to finish scheduleEventFirstAvailable
//to finish, all we need to do is insert moment compares
//calculates all available slots to schedule the task
//filteredGoogleCalEventList must be sorted by startTime ascending, e.g. earliest events first
/*
 * will return list of open time slots in JSON {start: dateTime, end: dateTime}
 */
var calculateAvailableSlots = function(ourTask, filteredGoogleCalEventList){
	//if undefined, null, or empty
	var availableSlots = [];
	var slot = {};
	//set our start by to be make of now, start by
	var ourStartBy = createMoment(ourTask.date.set.start);
	if (moment().isAfter(ourStartBy)){
		ourStartBy = moment();
	}
	var ourEndBy = createMoment(ourTask.date.set.end);
	//if no events in range, set slot to whole range
	if (!filteredGoogleCalEventList || !filteredGoogleCalEventList.length){
		slot = createSlot(ourStartBy.format(), ourEndBy.format());
		availableSlots.push(slot);
		return availableSlots;
	}
	var pastEventEnd = ourStartBy;
	//see if any slots before each event and the prior event, if so add to slot list
	for (var i = 0; i < filteredGoogleCalEventList.length; i++){
		var event = filteredGoogleCalEventList[i];
		var eventStartDateTime = event.start.dateTime;
		var eventEndDateTime = event.end.dateTime;
		if (!eventStartDateTime){
			eventStartDateTime = event.start.date;
		}
		if (!eventEndDateTime){
			eventEndDateTime = event.end.date;
		}
		var eventStart = createMoment(eventStartDateTime);
		var eventEnd = createMoment(eventEndDateTime);
		//if we can fit our task between events, add the slot
		if ((eventStart.diff(pastEventEnd, 'minutes') >= ourTask.length)){
			slot = createSlot(pastEventEnd.format(), eventStart.format());
			availableSlots.push(slot);
		}
		pastEventEnd = eventEnd;
	}
	
	//see if any slots available at the end
	if (ourEndBy.diff(pastEventEnd, 'minutes') >= ourTask.length){
		slot = createSlot(pastEventEnd.format(), ourEndBy.format());
		availableSlots.push(slot);
	}
	return availableSlots;
};

//uses new logic, testing currently, sets task actual and returns a json object with task to store in db and event to push to google cal
//slotPicker is a function to pass in that takes in a list of slots and returns which to use
var scheduleNewTask = function(ourTask, availableSlots, slotPicker){
	var slot = slotPicker(availableSlots);
    ourTask.actual = slot.start;
    return {"task": ourTask, "event": taskToEvent(ourTask)};
}

var autoSchedule = function(ourTask, googleCalendarEventList, schedulingAlgorithm){
	googleCalendarEventList.sort(sortOnStartDate);
	filtered = filterGoogleEvents(ourTask.date.set.start, ourTask.date.set.end, googleCalendarEventList);
	availableSlots = calculateAvailableSlots(ourTask, filtered);
	map = scheduleNewTask()
}

//chooses first available slot to schedule event
var pickFirstAvailable = function(availableSlots){
	return availableSlots[0];
}

var pickLastAvailable
