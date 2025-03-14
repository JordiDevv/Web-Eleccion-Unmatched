document.getElementById("calculateForm").addEventListener("submit", checkInputs);

async function checkInputs(event)
{
    event.preventDefault();

    const inputs = [
        document.getElementById("player1").value.trim(),
        document.getElementById("player2").value.trim(),
        document.getElementById("player3").value.trim(),
        document.getElementById("player4").value.trim()
    ];

    const inputsResponse = await fetch("/check-inputs-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs })
    });
    
    const inputsData = await inputsResponse.json();
    if (inputsResponse.ok) {
        operation(inputs);
    } else {
        alert(inputsData.error);
    }
}

async function operation(inputs)
{
    const response = await fetch("/calculate-prio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs })
    });
    
    const data = await response.json();
    
    if (response.ok)
    {
        let assignedHeroes = assignHeroes(data.result);
        showResults(assignedHeroes);
    }
    else
        alert("Error: " + data.error);
}

function assignHeroes(players)
{
    players.sort((a, b) => Math.max(...b.prio.map(p => p.value)) - Math.max(...a.prio.map(p => p.value)));

    const assignedHeroes = new Map();
    const heroOwners = new Map();

    players.forEach(player =>
    {
        let assigned = false;
        let availablePriorities = [...player.prio];
        
        while (!assigned && availablePriorities.length > 0) 
        {
            availablePriorities.sort((a, b) => b.value - a.value);
            let bestChoice = availablePriorities[0];

            if (heroOwners.has(bestChoice.hero)) 
            {
                let currentOwner = heroOwners.get(bestChoice.hero);
                
                if (currentOwner.value === bestChoice.value) 
                {
                    let winner = Math.random() < 0.5 ? player.nombre : currentOwner.owner;
                    let loser = winner === player.nombre ? currentOwner.owner : player.nombre;

                    assignedHeroes.set(winner, bestChoice.hero);
                    heroOwners.set(bestChoice.hero, { owner: winner, value: bestChoice.value });

                    player = players.find(p => p.nombre === loser);
                }
                else if (currentOwner.value < bestChoice.value)
                {
                    assignedHeroes.set(player.nombre, bestChoice.hero);
                    heroOwners.set(bestChoice.hero, { owner: player.nombre, value: bestChoice.value });

                    let previousOwner = players.find(p => p.nombre === currentOwner.owner);
                    previousOwner.prio = previousOwner.prio.filter(h => h.hero !== bestChoice.hero);
                    player = previousOwner;
                }
                else
                    availablePriorities.shift();
            }
            else
            {
                assignedHeroes.set(player.nombre, bestChoice.hero);
                heroOwners.set(bestChoice.hero, { owner: player.nombre, value: bestChoice.value });
                assigned = true;
            }
        }
    });

    players.forEach(player => {
        let assignedHero = assignedHeroes.get(player.nombre);
        let assignedPrio = player.prio.find(p => p.hero === assignedHero);

        if (assignedPrio)
        {
            if (assignedPrio.value > 0) assignedPrio.value = 0;
            else assignedPrio.value -= 1;
        }
    });

    return assignedHeroes;
}

function showResults(assignedHeroes)
{
    const resultsContainer = document.getElementById("results"); 
    resultsContainer.innerHTML = "";

    for (const [player, hero] of assignedHeroes)
    {
        const entryElement = document.createElement("p"); 
        entryElement.textContent = `${player} juega con ${hero}`;
        resultsContainer.appendChild(entryElement);
    }
}