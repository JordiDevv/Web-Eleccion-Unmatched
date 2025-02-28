document.getElementById("calculateForm").addEventListener("submit", async function(event) {
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
        alert("Okey");
    } else {
        alert(inputsData.error); // Muestra "Usuario no encontrado" si no coincide
    }
    

    // const response = await fetch("/calculator", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ nombres })
    // });

    // const data = await response.json();
    
    // if (response.ok)
    //     document.getElementById("results").innerHTML = `<p>${JSON.stringify(data.resultado)}</p>`;
    // else
    //     alert("Error: " + data.error);
});
