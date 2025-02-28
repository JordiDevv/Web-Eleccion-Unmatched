document.getElementById("calculosForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const nombres = [
        document.getElementById("player1").value.trim(),
        document.getElementById("player2").value.trim(),
        document.getElementById("player3").value.trim(),
        document.getElementById("player4").value.trim()
    ];

    const response = await fetch("/calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombres })
    });

    const data = await response.json();
    
    if (response.ok)
        document.getElementById("results").innerHTML = `<p>${JSON.stringify(data.resultado)}</p>`;
    else
        alert("Error: " + data.error);
});
