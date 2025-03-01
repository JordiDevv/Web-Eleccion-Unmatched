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
    
        data.result.forEach(entry => {
            const entryElement = document.createElement("p");
            entryElement.textContent = `${entry.nombre}: ${entry.valores.join(", ")}`;
            resultsContainer.appendChild(entryElement);
        });
    }
    else
        alert("Error: " + data.error);
}
