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
    const currentPlayer = JSON.parse(currentPlayer = localStorage.getItem('roostPlayer'));
    const combat = JSON.parse(localStorage.getItem('roostCombat'));
    const interaction = JSON.parse(localStorage.getItem('roostInteraction'));
    const movement = JSON.parse(localStorage.getItem('roostMovement'));

    return {
        currentPlayer,
        combat,
        interaction,
        movement
    }
}





