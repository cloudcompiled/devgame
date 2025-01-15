// Add event listener for combined roll button
rollButton.addEventListener('click', () => {
    if (diceCount === 2) {
        rollDice(1);
        rollDice(2);
    } else {
        rollDice(1);
    }
    logElement.textContent = '';
    updateUI();
});

reroll1Button.addEventListener('click', () => {
    rollDice(1);
    reroll1Used = true;
    updateUI();
});

use1Button.addEventListener('click', () => {
    handlePlayerAction(1);
});

reroll2Button.addEventListener('click', () => {
    rollDice(2);
    reroll2Used = true;
    updateUI();
});

use2Button.addEventListener('click', () => {
    handlePlayerAction(2);
});

endTurnButton.addEventListener('click', () => {
    turnEnded = true;
    currentRoll1 = null;
    currentRoll2 = null;
    reroll1Used = false;
    reroll2Used = false;
    action1Used = false;
    action2Used = false;
    enemy1.shielded = false;
    logElement.textContent = '';
    if(enemy2)
        enemy2.shielded = false;
    handleEnemyTurn(1);
    if(enemy2)
        handleEnemyTurn(2);
    playerShielded = false
    updateUI();
});

startPopup.addEventListener('click', () => {
    startPopup.style.display = 'none';
    showTypingScreen();
    textSound.play();
    screenMusic.play();
    setLevelInfo();
    updateUI();
});