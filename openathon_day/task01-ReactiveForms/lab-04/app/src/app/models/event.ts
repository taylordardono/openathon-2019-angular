export interface Event {
  id: string;
  title: string;
  location: string;
  date: Date;
  description: string;
  addedBy: string;
}

export function initializeEvent(eventForm?): Event {
  let newEvent: Event = {
    id: "",
    title: eventForm ? eventForm.get("title").value : "",
    location: eventForm ? eventForm.get("location").value : "",
    description: eventForm ? eventForm.get("description").value : "",
    addedBy: eventForm ? eventForm.get("addedBy").value : "",
    date: eventForm ? eventForm.get("date").value : new Date(),
  };
  return newEvent;
}
