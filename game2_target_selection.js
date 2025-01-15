function showTargetSelection(options) {
    return new Promise((resolve) => {
        const gameContainer = document.getElementById('game-container');
        const targetSelectionDiv = document.createElement('div');
        targetSelectionDiv.id = 'target-selection';
        targetSelectionDiv.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 1000;';
        
        const title = document.createElement('h3');
        title.textContent = 'Choose a target:';
        targetSelectionDiv.appendChild(title);
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.style.cssText = 'display: block; width: 100%; margin: 5px 0; padding: 10px; border: none; background: #4CAF50; color: white; cursor: pointer; border-radius: 3px;';
            button.addEventListener('click', () => {
                gameContainer.removeChild(targetSelectionDiv);
                resolve(option.value);
            });
            targetSelectionDiv.appendChild(button);
        });
        
        gameContainer.appendChild(targetSelectionDiv);
    });
}