document.getElementById("calcButton").addEventListener("click", operation);

async function operation(event)
{
    event.preventDefault();

    const response = await fetch("/get-players",
    {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    let assignedHeroes = new Map();
    let conflictExists = true;

    while (conflictExists)
    {
        let heroOccurrences = new Map();
        conflictExists = false;

        players.forEach(player =>
        {
            if (!assignedHeroes.has(player.nombre))
            {
                let bestChoice = player.prio.reduce((max, current) =>
                    current.value > max.value ? current : max
                );

                assignedHeroes.set(player.nombre, { hero: bestChoice.hero, value: bestChoice.value });

                if (!heroOccurrences.has(bestChoice.hero))
                    heroOccurrences.set(bestChoice.hero, []);
                heroOccurrences.get(bestChoice.hero).push({ player, value: bestChoice.value });
            }
        });

        heroOccurrences.forEach((playersList, hero) =>
        {
            if (playersList.length > 1)
            {
                conflictExists = true;

                playersList.sort((a, b) => b.value - a.value);

                let highestValue = playersList[0].value;
                let candidates = playersList.filter(p => p.value === highestValue);

                let winner = candidates.length > 1 
                    ? candidates[Math.floor(Math.random() * candidates.length)]
                    : candidates[0];

                assignedHeroes.set(winner.player.nombre, { hero, value: highestValue });

                playersList = playersList.filter(p => p !== winner);

                playersList.forEach(loser => 
                {
                    let nextHero = loser.player.prio
                        .filter(h => !Array.from(assignedHeroes.values()).some(a => a.hero === h.hero))
                        .reduce((max, current) => current.value > max.value ? current : max, { value: -Infinity });

                    if (nextHero.value !== -Infinity)
                        assignedHeroes.set(loser.player.nombre, { hero: nextHero.hero, value: nextHero.value });
                    else
                        assignedHeroes.delete(loser.player.nombre);
                })
            }
        })
    }
    
    assignedHeroes.forEach((data, playerName) => 
    {
        if (data.value > 0)
            assignedHeroes.set(playerName, { hero: data.hero, value: 0 });
        else
            assignedHeroes.set(playerName, { hero: data.hero, value: data.value - 1 });
    });
    
    return assignedHeroes;
        
}

function updateDatabase(assignedHeroes, players)
{
    const updates = [];

    players.forEach(player =>
    {
        let assignedHero = assignedHeroes.get(player.nombre);
        
        if (assignedHero)
        {
            updates.push
            ({
                nombre: player.nombre,
                hero: assignedHero.hero,
                newValue: assignedHero.value
            });
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
        entryElement.textContent = `${player} juega con ${hero.hero}`;
        resultsContainer.appendChild(entryElement);
    }
}
