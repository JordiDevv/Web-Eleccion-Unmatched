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
        const resultsContainer = document.getElementById("results");
        resultsContainer.innerHTML = "";
        const matchPool = new Map();
    
        data.result.forEach(entry => {
            const maxPrio = calculateMaxPrio(entry);
            matchPool.set(entry.nombre, entry.prio[maxPrio]);
            // const entryElement = document.createElement("p");
            // entryElement.textContent = `${entry.nombre}: ${entry.prio[maxPrio].hero} ${entry.prio[maxPrio].value} `;
            // resultsContainer.appendChild(entryElement);
        });

        const matchPoolArray = Array.from(matchPool.values());
        for (let i = 1; i < matchPoolArray.length; i++)
        {
            if (matchPoolArray[i].hero == matchPoolArray[i - 1].hero)
                console.log("ok");
        }
    }
    else
        alert("Error: " + data.error);
}

function calculateMaxPrio(entry)
{
    let indexMaxPrio = 0;
    for (let i = 1; i < entry.prio.length; i++)
        if (entry.prio[i].value > indexMaxPrio) indexMaxPrio = i;
    return (indexMaxPrio);
}
