const playerHealthElement = document.getElementById('player-health');
let enemyCount = 1; // Parameter to control number of enemies
const playerHealthBar = document.getElementById('player-health-bar');
const enemy1HealthElement = document.getElementById('enemy1-health');
const enemy2HealthElement = document.getElementById('enemy2-health');
const enemy1HealthBar = document.getElementById('enemy1-health-bar');
const enemy2HealthBar = document.getElementById('enemy2-health-bar');
const dice1Element = document.getElementById('dice1');
const dice1Text = document.getElementById('dice1-text');
const dice2Element = document.getElementById('dice2');
const dice2Text = document.getElementById('dice2-text');
const diceContainer = document.getElementById('dice-container');
const logElement = document.getElementById('log');
const logElement2 = document.getElementById('log2');


// Parameter to control number of dice (1 or 2)
let diceCount = 1; // Default to 1 dice (can be set to 2 for two-dice mode)
const enemyNameElement1 = document.getElementById('enemy1-name');
const enemyNameElement2 = document.getElementById('enemy2-name');
const subtext = document.getElementById('subtext');
const diceimg = document.getElementById("dice-img");

const rollButton = document.getElementById('roll-btn');
const reroll1Button = document.getElementById('reroll1-btn');
const use1Button = document.getElementById('use1-btn');

const reroll2Button = document.getElementById('reroll2-btn');
const use2Button = document.getElementById('use2-btn');
const endTurnButton = document.getElementById('end-turn-btn');
const nextLevelButton = document.getElementById('next-level-btn');
const popupOverlay = document.getElementById('popup-overlay');
const victoryPopup = document.getElementById('victory-popup');
const lossPopup = document.getElementById('loss-popup');
const startPopup = document.getElementById('start-popup');
const winMusic = new Audio('sound/Evening_Melodrama.mp3');
const levelUpSound = new Audio('sound/win.wav');
winMusic.volume = 0.3;
const diceSound = new Audio('sound/dice.mp3');
const screenMusic = new Audio('sound/sneaky.mp3');
const battleMusic = new Audio('sound/hidden.mp3');
battleMusic.loop =true;
screenMusic.loop = true;


let playerHealth = 15;
let playerShielded = false;
let currentRoll1 = null;
let currentRoll2 = null;
let reroll1Used = false;
let reroll2Used = false;
let action1Used = false;
let action2Used = false;
let turnEnded = false;
let level = 1;

const diceFaces = ['Attack', 'Shield', 'Heal', 'Attack', 'Attack', 'Heal'];

let enemy1 = null;
let enemy2 = null;
setLevelInfo();

function rollDice(diceNum, playerRoll = true) {
    diceSound.play();
    const randomNumber = Math.floor(Math.random() * diceFaces.length);
    const result = diceFaces[randomNumber];
    if (diceNum === 1) {
        dice1Text.textContent = result;
        if (playerRoll)
            dice1Text.style.color = 'black';
        else
            dice1Text.style.color = 'red';

        currentRoll1 = result;
    } else {
        dice2Text.textContent = result;
        if (playerRoll)
            dice2Text.style.color = 'black';
        else
            dice2Text.style.color = 'red';
        currentRoll2 = result;
    }

    if (currentRoll1) {
        dice1Element.style.backgroundImage = `url(images/${currentRoll1.replace(/[0-9\s]/g, '')}.png)`;
    }
    if (currentRoll2) {
        dice2Element.style.backgroundImage = `url(images/${currentRoll2.replace(/[0-9\s]/g,'')}.png)`;
    }
    return result;
}

function log(message, num = 1) {
    if (num === 1)
        logElement.textContent = message;
    else if (num === 2)
        logElement.textContent = logElement.textContent + message;
}

function updateHealthBars() {
    playerHealthBar.style.width = (playerHealth / 15) * 100 + '%';
    enemy1HealthBar.style.width = (enemy1.health / enemyMaxHealth()) * 100 + '%';
    if (enemy2) {
        enemy2HealthBar.style.width = (enemy2.health / enemyMaxHealth()) * 100 + '%';
        enemy2HealthElement.textContent = enemy2.health;

    }
    enemy1HealthElement.textContent = enemy1.health;
}

function enemyMaxHealth() {
    if (level === 1) return 2;
    if (level === 2) return 5;
    if (level === 3) return 5;
    if (level === 4) return 5;
    return 5; // Default for future levels
}

function setLevelInfo() {
    // level = 3;
    // enemyCount = 2;
    // diceCount =2;
    enemy1 = { name: 'Enemy 1', health: 3 };
    if (level >= 3) {
        enemyCount = 2;
        enemy2 = { name: 'Enemy 2', health: 3 };
    }

    const levelData = {
        1: { name: 'Procrastination Monster', health: 2, text: "" },
        2: { name: 'Analysis Paralysis', health: 5, text: "" },
        3: { name: 'Bug', health: 5, text: '' },
        4: { name: 'IDE Crash', health: 6, text: '' },
        5: { name: 'Feature Creep', health: 7, text: '' }

    };

    const enemy2Data = {
        3: { name: 'Bug 2', health: 5 },
        4: { name: 'Spaghetti Code', health: 6 },
        5: { name: 'TODO Monster', health: 7 }
    }

    const { name, health, text } = levelData[level] || { name: '', health: 10, text: '' };

    enemy1.name = name;
    enemy1.health = health;
    // Show/hide enemies based on enemyCount
    const enemy2Element = document.querySelector('.enemy:nth-child(2)');
    enemyNameElement1.textContent = name;
    enemy1HealthElement.textContent = enemy1.health;

    if (enemyCount === 1) {
        enemy2Element.style.display = 'none';
    } else {
        enemy2Element.style.display = 'block';
        enemy2.name = enemy2Data[level].name;
        enemy2.health = enemy2Data[level].health;
        enemy2HealthElement.textContent = enemy2.health;
        enemyNameElement2.textContent = enemy2.name;
    }

    turnEnded = false;
    currentRoll1 = null;
    currentRoll2 = null;
    reroll1Used = false;
    reroll2Used = false;
    action1Used = false;
    action2Used = false;
    updateUI();
}

function updateUI() {
    playerHealthElement.textContent = playerHealth;
    diceContainer.style.display = 'block';

    // Update shield indicators
    document.getElementById('player-shield').style.display = playerShielded ? 'block' : 'none';
    document.getElementById('enemy1-shield').style.display = enemy1.shielded ? 'block' : 'none';
    if (enemy2) {
        document.getElementById('enemy2-shield').style.display = enemy2.shielded ? 'block' : 'none';
    }

    // Show/hide second dice based on diceCount
    const dice2Container = document.querySelector('.dice-container .actions.two');
    dice2Element.style.display = diceCount === 2 ? 'block' : 'none';
    dice2Text.style.display = diceCount === 2 ? 'block' : 'none';
    dice2Container.style.display = diceCount === 2 ? 'flex' : 'none';

    // Update button states for dice 1
    rollButton.disabled = currentRoll1 !== null || turnEnded;
    reroll1Button.disabled = !currentRoll1 || reroll1Used || action1Used;
    use1Button.disabled = !currentRoll1 || action1Used || turnEnded;

    // Update button states for dice 2
    //roll2Button.disabled = currentRoll2 !== null || turnEnded;
    reroll2Button.disabled = !currentRoll2 || reroll2Used || action2Used;
    use2Button.disabled = !currentRoll2 || action2Used || turnEnded;

    // End turn logic based on diceCount
    if (diceCount === 1) {
        endTurnButton.disabled = !action1Used || turnEnded || !currentRoll1;
    } else {
        endTurnButton.disabled = !(
            (action1Used && action2Used) ||
            ((action1Used || !currentRoll1) && (action2Used || !currentRoll2))
        ) || turnEnded || !currentRoll1;
    }

    updateHealthBars();
}

async function handlePlayerAction(diceNum) {
    const currentRoll = diceNum === 1 ? currentRoll1 : currentRoll2;

    if (currentRoll.startsWith('Attack')) {
        const match = currentRoll.match(/Attack (\d+)/);
        let damageAmount = match ? parseInt(match[1]) : 1;
        let target;

        if (enemy2 && enemy1.health <= 0)
            target = 'enemy2';
        else if (enemy2 && enemy2.health <= 0) {
            target = 'enemy1'
        } else if (!enemy2) {
            target = 'enemy1';
        }

        if (!target && enemy2) {
            // Ask player which enemy to attack
            const options = [
                { text: `Attack ${enemy1.name} (${enemy1.health} HP)`, value: 'enemy1' },
                { text: `Attack ${enemy2.name} (${enemy2.health} HP)`, value: 'enemy2' }
            ];
            target = await showTargetSelection(options);
        }

        if (target === 'enemy1') {
            if (enemy1.shielded) {
                damageAmount = Math.max(0, damageAmount - enemy1.shielded);
                enemy1.shielded = false;
                log(`${enemy1.name}'s shield blocked 1 damage!`);
            }
            enemy1.health -= damageAmount;

            log(`Player attacked ${enemy1.name}! ${enemy1.name} lost ${damageAmount} health.`);
            if (enemy1.health <= 0) {
                enemy1.health = 0
                log(`Player defeated ${enemy1.name}!`);
            }
        } else if (enemy2) {
            if (enemy2.shielded) {
                damageAmount = Math.max(0, damageAmount - enemy2.shielded);
                enemy2.shielded = false;
                log(`${enemy2.name}'s shield blocked 1 damage!`);
            }
            enemy2.health -= damageAmount;
            log(`Player attacked ${enemy2.name}! ${enemy2.name} lost ${damageAmount} health.`);
            if (enemy2.health <= 0) {
                enemy2.health = 0
                log(`Player defeated ${enemy2.name}!`);
            }
        }
    } else if (currentRoll.startsWith('Shield')) {
        const match = currentRoll.match(/Shield (\d+)/);
        const shieldAmount = match ? parseInt(match[1]) : 1;
        playerShielded = shieldAmount;
        log(`Player shielded with dice ${diceNum}! An attack next turn will deal ${shieldAmount} less damage.`);
    } else if (currentRoll.startsWith('Heal')) {
        const match = currentRoll.match(/Heal (\d+)/);
        const healAmount = match ? parseInt(match[1]) : 1;
        playerHealth = Math.min(15, playerHealth + healAmount);
        log(`Player healed with dice ${diceNum}!`);
    }

    if (enemy1.health <= 0) {
        if (!enemy2 || enemy2.health <= 0) {
            log(`Player defeated monstsers! Advancing to level ${level + 1}.`);
            updateHealthBars();
            advanceLevel();
            return;
        }
    }

    if (diceNum === 1) {
        action1Used = true;
    } else {
        action2Used = true;
    }
    updateUI();
}

function advanceLevel() {
    battleMusic.pause();
    levelUpSound.play();
    diceContainer.style.display = 'none';
    if (level === 5) {
        winMusic.play();
        victoryPopup.style.display = 'flex';
    } else if (level === 1) {
        upgradeOverlay.style.display = 'flex';
    } else if (diceCount < 2 ) {
        upgradeOverlay2.style.display = 'flex';
        choiceButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.dataset.upgrade == 'upgrade') {
                    upgradeOverlay2.style.display = 'none';
                    upgradeOverlay.style.display = 'flex';
                    faceSelection.style.display = 'none';
                    upgradeOptions.style.display = 'flex';
                } else {
                    diceCount++;
                    upgradeOverlay2.style.display = 'none';
                    level++;
                    showTypingScreen();
                    setLevelInfo();
                }

            })
        });
    } else {
        upgradeOverlay.style.display = 'flex';
        faceSelection.style.display = 'none';
        upgradeOptions.style.display = 'flex';
    }
}

const upgradeOverlay = document.getElementById('upgrade-overlay');
const upgradeButtons = document.querySelectorAll('.upgrade-btn');
const upgradeOverlay2 = document.getElementById('upgrade2-overlay');
const choiceButtons = document.querySelectorAll('.choice-btn');

// Add event listeners for upgrade buttons
upgradeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const upgrade = button.dataset.upgrade;
        const faceGrid = document.getElementById('face-grid');
        const upgradeOptions = document.getElementById('upgrade-options');
        const faceSelection = document.getElementById('face-selection');

        // Clear previous face options
        faceGrid.innerHTML = '';

        // Create face options
        diceFaces.forEach((face, index) => {
            const faceButton = document.createElement('div');
            faceButton.className = 'face-option';
            faceButton.textContent = face;
            faceButton.addEventListener('click', () => {
                diceFaces[index] = upgrade;
                upgradeOverlay.style.display = 'none';
                level++;
                showTypingScreen();
                setLevelInfo();
            });
            faceGrid.appendChild(faceButton);
        });

        // Show face selection, hide upgrade options
        upgradeOptions.style.display = 'none';
        faceSelection.style.display = 'block';

        // Add cancel button functionality
        document.getElementById('cancel-face-select').addEventListener('click', () => {
            faceSelection.style.display = 'none';
            upgradeOptions.style.display = 'flex';
        });
    });
});

nextLevelButton.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
    level++;
    showTypingScreen();
    setLevelInfo();
});



function handleEnemyTurn(enemy) {
    if (enemy == 1 && enemy1.health > 0) {
        const enemyRoll = rollDice(1, false);  // Using dice 1 for 1st enemy 
        if (enemyRoll === 'Attack') {
            let damage = 1;
            if (playerShielded) {
                damage = Math.max(0, damage - 1);
                playerShielded = false;
                log(`Player's shield blocked 1 damage!`);
            }
            playerHealth -= damage;
            log(`${enemy1.name} attacked! Player lost 1 health.`);
        } else if (enemyRoll === 'Shield') {
            enemy1.shielded = true;
            log(`${enemy1.name} shielded! Next attack will deal 1 less damage.`);
        } else if (enemyRoll === 'Heal') {
            enemy1.health = Math.min(enemyMaxHealth(), enemy1.health + 1);
            log(`${enemy1.name} healed! `);
        }
    }

    if (enemy == 2 && enemy2 && enemy2.health > 0) {
        const enemyRoll = rollDice(2, false);  // Using dice 2 for second enemy

        if (enemyRoll === 'Attack') {
            let damage = 1;
            if (playerShielded) {
                damage = Math.max(0, damage - 1);
                playerShielded = false;
                log(`Player's shield blocked 1 damage!`);
            }
            playerHealth -= damage;
            log(`${enemy2.name} attacked! Player lost ${damage} health.`, 2);
        } else if (enemyRoll === 'Shield') {
            enemy2.shielded = true;
            log(`${enemy2.name} shielded! Next attack will deal 1 less damage.`, 2);
        } else if (enemyRoll === 'Heal') {
            enemy2.health = Math.min(enemyMaxHealth(), enemy2.health + 1);
            log(`${enemy2.name} healed! `);
        }
    }

    if (playerHealth <= 0) {
        log(`Monster wins! Player is defeated!`);
        endGame();
        return;
    }

    // Reset for player's next turn
    turnEnded = false;
    currentRoll1 = null;
    currentRoll2 = null;
    reroll1Used = false;
    reroll2Used = false;
    action1Used = false;
    action2Used = false;
    updateUI();
}

function endGame() {
    rollButton.style.display = 'none';
    reroll1Button.disabled = true;
    use1Button.disabled = true;
    reroll2Button.disabled = true;
    use2Button.disabled = true;
    endTurnButton.disabled = true;
    lossPopup.style.display = 'flex';
    battleMusic.stop();
    level = 1;
    diceCount = 1;
    enemyCount = 1;
    setLevelInfo();
    updateUI();
}


function askQuestion(questionText, optionsArray) {
    return new Promise((resolve) => {
        const typingText = document.getElementById('typingText');
        const optionsDiv = document.getElementById('options');
        typingText.textContent = '';
        optionsDiv.innerHTML = '';
        optionsDiv.style.display = 'none';

        let index = 0;
        let selectedIndex = 0;

        // Typing effect
        const typingInterval = setInterval(() => {
            if (index < questionText.length) {
                typingText.textContent += questionText[index];
                index++;
            } else {
                clearInterval(typingInterval);
                if (optionsArray.length === 0) {
                    waitForClickAnywhere();
                } else {
                    displayOptions();
                }
            }
        }, 50);

        // Wait for click anywhere
        function waitForClickAnywhere() {
            document.body.addEventListener('click', onClickAnywhere, { once: true });
        }

        function onClickAnywhere() {
            resolve(-1);
        }

        // Display options
        function displayOptions() {
            optionsDiv.style.display = 'block';
            optionsArray.forEach((optionText, idx) => {
                const option = document.createElement('div');
                option.textContent = optionText;
                option.classList.add('option');
                option.setAttribute('tabindex', '0');
                if (idx === 0) option.classList.add('selected');
                optionsDiv.appendChild(option);

                // Mouse interaction
                option.addEventListener('click', () => resolve(idx));
                option.addEventListener('mouseover', () => updateSelection(idx));
            });

            document.addEventListener('keydown', handleKeydown);
        }

        // Update selection
        function updateSelection(newIndex) {
            const allOptions = optionsDiv.querySelectorAll('.option');
            allOptions[selectedIndex].classList.remove('selected');
            selectedIndex = newIndex;
            allOptions[selectedIndex].classList.add('selected');
        }

        // Keyboard interaction
        function handleKeydown(e) {
            const allOptions = optionsDiv.querySelectorAll('.option');

            if (e.key === 'ArrowDown') {
                updateSelection((selectedIndex + 1) % allOptions.length);
            } else if (e.key === 'ArrowUp') {
                updateSelection((selectedIndex - 1 + allOptions.length) % allOptions.length);
            } else if (e.key === 'Enter') {
                resolve(allOptions[selectedIndex].textContent);
                cleanup();
            }
        }

        // Cleanup after resolving
        function cleanup() {
            document.removeEventListener('keydown', handleKeydown);
        }
    });
}

async function showTypingScreen() {
    screenMusic.play();
    battleMusic.pause();
    let backgroundImg = "url(images/battle.png)";
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('desk-wrapper').style.display = 'block';
    let answer;
    if (level == 1) {
        await askQuestion("So you want to build a game huh?", []);
        await askQuestion("Fine... the Dev Gods shall allow it... if you can win your battles. ", []);
        await askQuestion("Here comes your first one!", []);
    } else if (level == 2) {
        await askQuestion("So you've finally stopped procrastinating and are ready to start making your game then? ", []);
        answer = await askQuestion("Which game engine will you use? ", ["Godot", "Unity", "Unreal Engine", "Uhh... guess I'll start googling 'Best Game Engine 2025'"]);
        if (answer < 3)
            await askQuestion("Seems like overkill for a web game, but who am I to judge ", []);
        else
            await askQuestion("Don't kid yourself, you'll probably watch all these comparison videos and end up using JavaScript anyway ", []);

        await askQuestion("But what will your game be about? ", ["Ummm...", "Something fun?", "Idk, still thinking..."]);
        backgroundImg = "url(images/analysis.png)";
    } else if (level == 3) {
        await askQuestion("You've finally decided on your concept, time to get to work. Watch out for the bugs! ", []);
        enemyCount = 2;
        backgroundImg = "url(images/bugs.png)";
    } else if (level == 4) {
        await askQuestion("Nice job squashing those bugs, you're making progress! ", []);
        answer = await askQuestion("There's just one error you can't seem to figure out. What do you want to do? ", ['Read the docs', 'StackOverflow', 'Youtube tutorial', 'Take a break']);
        if (answer === 0) {
            await askQuestion("Seriously?! The Dev Gods are impressed. You gain 1 health. ", []);
            playerHealth++;
        } else if (answer === 1) {
            await askQuestion("Fair enough. That took some searching but you finally figured it out. ", []);
        } else if (answer === 2) {
            await askQuestion("Did you just watch a 40 minute video to fix a syntax error instead of just reading the docs?! The Dev Gods are not impressed... ", []);
            if (playerHealth > 1)
                await askQuestion("You lose 1 health", []);
        } else {
            const answer1 = await askQuestion("Good choice! You got some coffee and then figured it out right away. You gain 2 health. ", []);
            playerHealth += 2;
        }
        answer = await askQuestion("Anyway, you're making progress, keep going! ", []);
        enemyCount = 2;
        backgroundImg = "url(images/code.png)";
    } else if (level == 5) {
        answer = await askQuestion("Well done, you've managed to survive!", []);
        answer = await askQuestion("But the deadline is fast approaching and you're running out of time! ", []);
        answer = await askQuestion("Here are your options:", ['Pull an all-nighter', 'Use Amazon Q Developer', 'Drink more coffee']);
        if (answer == 0 || answer == 2) {
            answer = await askQuestion("Always a bad idea... You lose 1 health", []);
            playerHealth--;
        } else if (answer == 1) {
            answer = await askQuestion("Good move, you saved so much time you're back on track! ", []);
            answer = await askQuestion("The Dev Gods have rewarded your good move. Your dice have been upgraded with an Attack 4.", []);
            diceFaces[0] = 'Attack 4';
        }
        answer = await askQuestion("You're so close to submitting your work! But can you overcome this final battle?!", []);
        enemyCount = 2;
        backgroundImg = "url(images/creep.png)";

    }

    screenMusic.pause();
    battleMusic.play();
    document.getElementById('desk-wrapper').style.display = 'none';
    document.getElementById('game-container').style.backgroundImage = backgroundImg;
    document.getElementById('game-container').style.display = 'flex';
    subtext.style.display = 'block';
    setLevelInfo();

}
