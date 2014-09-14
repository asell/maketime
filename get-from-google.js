/**
 * 
 */
//creates a moment from a date string
var createMoment = function(dateString){
	return moment(dateString, 'YYYY-MM-DD HH:mm');
}

//returns -1 if x is before y in minutes, 0 if same, 1 if after
var sortOnStartDate = function(firstEvent, secondEvent){
	var firstDateTime = firstEvent.start.dateTime;
	var firstDateEndTime = firstEvent.end.dateTime;
	var secondDateTime = secondEvent.start.dateTime;
	var secondDateEndTime = secondEvent.end.dateTime;
	if(!firstDateTime){
		firstDateTime = String(firstEvent.start.date);
	}
	if(!firstDateEndTime){
		firstDateEndTime = String(firstEvent.end.date);
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
var filterGoogleEvents = function(startByDateTime, endByDateTime, eList){
	var filteredEventList = [];
	var startBy = createMoment(startByDateTime);
	var endBy = createMoment(endByDateTime)
	for (event in eList){
		var curEventStart = createMoment(eList[event].start.dateTime);
		var curEventEnd = createMoment(eList[event].end.dateTime);
		
		//does currentEvent overlap with the range at all
		//if so, add it to the list of events in the range
		if (((curEventStart.isAfter(startBy, 'minute') || curEventStart.isSame(startBy, 'minute')) && (curEventStart.isBefore(endBy, 'minute'))) 
			  || ((curEventEnd.isAfter(startBy, 'minute') || curEventEnd.isSame(startBy, 'minute')) && (curEventEnd.isBefore(endBy, 'minute'))))
		{
			filteredEventList.push(eList[event]);
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
		var eventStart = createMoment(event.start.dateTime);
		var eventEnd = createMoment(event.end.dateTime);
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

//uses new logic, testing currently, sets task actual and returns an event in google cal form to send
var scheduleNewAlgorithm = function(ourTask, availableSlots){
	var slot = availableSlots[0];
	ourTask.actual = slot.start;
	return taskToEvent(ourTask);
}

//returns the event with all fields properly filled out, throws error if can't create
//schedules in earliest available slot after the startBy dateTime
//filtered and sorted list
var scheduleEventFirstAvailable = function(ourEvent, filteredSortedGoogleCalEventList){
	var prevEvent = filteredGoogleCalEventList[0];
	var prevEventStart = createMoment(prevEvent.start.dateTime);
	var prevEventEnd = createMoment(prevEvent.end.dateTime);
	var event;
	//if we can fit before first item in range, or if the list is empty
	//then set the time fields and return the event
	//TODO: add check to take max of (ourEvent.startBy, actual time.now (moment.js now() maybe?))
	if (((prevEvent.start.dateTime >= ourEvent.startBy) && ((prevEvent.start.dateTime - ourEvent.startBy) >= ourEvent.duration)) || filteredGoogleCalEventList.length <= 0){
		event = {"kind": "calendar#event", "id": ourEvent.id, "start": ourEvent.startBy, "end": ourEvent.startBy + ourEvent.duration};
		return event;
	}
	//if length 1
	if (filteredGoogleCalEventList.length === 1){
		//if we can fit after first item
		if ((ourEvent.endBy.dateTime - prevEvent.end.dateTime) >= ourEvent.duration){
			event = {"kind": "calendar#event", "id": ourEvent.id, "start": prevEvent.end, "end": prevEvent.end + ourEvent.duration};
			return event;
		}//can't fit, so return null
		else return null;
	}
	for (var i = 1; i < googleCalEventList.length; i++){
		var currEvent = googleCalEventList[i];
		if (ourEvent.duration <= (currEvent.start.dateTime - prevEvent.end.dateTime)){
			var start;
			var end;
			//TODO: add check to take max of (ourEvent.startBy, actual time.now (moment.js now() maybe?)) needs work for re-schedule
			if (ourEvent.startBy < prevEvent.end.dateTime){
				start = prevEvent.end;
				end = start + duration;
			}
			else {
				start = ourEvent.startBy;
				end = start;
			}
			event = {"kind": "calendar#event", "id": ourEvent.id, "start": start, "end": end};
			return event;
		}
		prevEvent = currEvent;
	}
	//check to see if can add after the last event
	//TODO: add check to take max of (ourEvent.startBy, actual time.now (moment.js now() maybe?))
	if ((ourEvent.endBy.dateTime - lastEndTime) >= ourEvent.duration){
		event = {"kind": "calendar#event", "id": ourEvent.id, "start": prevEvent.end, "end": prevEvent.end + ourEvent.duration};
		return event;
	}
	//can't add it
	return null;
};
