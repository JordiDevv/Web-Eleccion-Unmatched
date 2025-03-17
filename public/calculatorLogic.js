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
        updateDatabase(assignedHeroes, data.result);
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

            if (!bestChoice)
            {
                availablePriorities.shift();
                continue;
            }

            if (heroOwners.has(bestChoice.hero)) 
            {
                let currentOwner = heroOwners.get(bestChoice.hero);
                
                if (currentOwner.value < bestChoice.value)
                {
                    assignedHeroes.set(player.nombre, bestChoice.hero);
                    heroOwners.set(bestChoice.hero, { owner: player.nombre, value: bestChoice.value });

                    let previousOwner = players.find(p => p.nombre === currentOwner.owner);
                    previousOwner.prio = previousOwner.prio.filter(h => h.hero !== bestChoice.hero);
                    
                    availablePriorities = previousOwner.prio;
                    player = previousOwner;
                }
                else if (currentOwner.value === bestChoice.value) 
                {
                    let winner = Math.random() < 0.5 ? player.nombre : currentOwner.owner;
                    let loser = winner === player.nombre ? currentOwner.owner : player.nombre;

                    assignedHeroes.set(winner, bestChoice.hero);
                    heroOwners.set(bestChoice.hero, { owner: winner, value: bestChoice.value });

                    let loserPlayer = players.find(p => p.nombre === loser);
                    loserPlayer.prio = loserPlayer.prio.filter(h => h.hero !== bestChoice.hero);
                    availablePriorities = loserPlayer.prio;
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
            assignedPrio.value = assignedPrio.value > 0 ? 0 : assignedPrio.value -= 1;
    });

    return assignedHeroes;
}

function updateDatabase(assignedHeroes, players)
{
    const updates = [];

    players.forEach(player => {
        let assignedHero = assignedHeroes.get(player.nombre);
        let assignedPrio = player.prio.find(p => p.hero === assignedHero);

        if (assignedPrio)
        {
            let newValue = assignedPrio.value;
            updates.push({ nombre: player.nombre, hero: assignedHero, newValue });
        }
    });

    fetch("/update-priorities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Base de datos actualizada correctamente");
        } else {
            console.error("Error al actualizar la base de datos:", data.error);
        }
    })
    .catch(error => console.error("Error en la petición:", error));
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