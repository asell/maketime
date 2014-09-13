/**
 * 
 */


var filterGoogleEvents = function(startByDateTime, endByDateTime, googleCalEventList){
	var filteredEventList = [];
	for (event in googleCalEventList){
		if ((event.start.dateTime >= startByDateTime) && (event.start.dateTime <= endByDateTime) || ((event.end.dateTime >= startByTime) && (event.end.dateTime <= endByTime))){
			filteredEventList.push(event);
		}
	}
	return filteredEventList;
};

//returns the event with all fields properly filled out, throws error if can't create
//schedules in earliest available slot after the startBy dateTime
var scheduleEventFirstAvailable = function(ourEvent, filteredGoogleCalEventList){
	var prevEvent = filteredGoogleCalEventList[0];
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
	return null;
};
