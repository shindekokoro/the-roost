export const setLocalStorageData = (currentPlayer, combat, interaction, movement) => {
    if (!currentPlayer || !combat || !interaction || !movement) {
        return {message:"no valid data received"}
    }

    localStorage.setItem('roostPlayer', JSON.stringify(currentPlayer));
    localStorage.setItem('roostCombat', JSON.stringify(combat));
    localStorage.setItem('roostInteraction', JSON.stringify(interaction));
    localStorage.setItem('roostMovement', JSON.stringify(movement));

    return {message:"items saved to storage"};
}

export const getLocalStorageData = () => {
    const currentPlayer = JSON.parse(localStorage.getItem('roostPlayer'));
    const combat = JSON.parse(localStorage.getItem('roostCombat'));
    const interaction = JSON.parse(localStorage.getItem('roostInteraction'));
    const movement = JSON.parse(localStorage.getItem('roostMovement'));

    // if any of the data is missing, return false
    if (!currentPlayer || !combat || !interaction || !movement) {
        return false;
    }

    return {
        currentPlayer,
        combat,
        interaction,
        movement
    }
}

export const setEventContext = (data) => {
    localStorage.setItem('eventContext', JSON.stringify(data));
}

export const getEventContext = () => {
    let eventContext = JSON.parse(localStorage.getItem('eventContext'));
    if (!eventContext) {
        eventContext = false;
    }
    return eventContext;
}

// when the player dies, the death screen will clear the local storage, so that the player can start a new game
export const clearLocalStorage = () => {
    localStorage.removeItem('roostPlayer');
    localStorage.removeItem('roostCombat');
    localStorage.removeItem('roostInteraction');
    localStorage.removeItem('roostMovement');
    localStorage.removeItem('eventContext');
}