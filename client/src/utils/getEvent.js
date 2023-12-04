/**
 * Get a random event of a random type
 * @returns {object} event object {characterHP, enemyHP, currentEvent}
 */
const getEvent = (data) => {
  // options for the event type
  let eventOptions = ['combat', 'interaction', 'movement'];
  // get the event type
  const eventType =
    eventOptions[Math.floor(Math.random() * eventOptions.length)];
  // get the event
  const event =
    data[eventType][Math.floor(Math.random() * data[eventType].length)];
  // return the event
  return event;
};

export default getEvent;
