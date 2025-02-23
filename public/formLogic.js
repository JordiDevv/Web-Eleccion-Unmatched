document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("userForm").classList.add("hidden");
    document.getElementById("confirmAdvice").addEventListener("click", function(){
        document.getElementById("beforeAdvice").classList.add("hidden");
        document.getElementById("userForm").classList.remove("hidden");
    });

    document.getElementById("userForm").addEventListener("submit", async function(event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const pjsPriorities = {};
        const prioUsed = new Set();

        const inputsIterator = document.querySelectorAll(".input-priority");
        
        for (let input of inputsIterator)
        {
            const prio = parseInt(input.value);

            if (prioUsed.has(prio) && prio > 0)
            {
                alert("No debes repetir orden de prioridades.");
                return;
            }

            prioUsed.add(prio);
            pjsPriorities[input.id] = parseInt(input.value);
        }

        const response = await fetch("/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, ...pjsPriorities })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Usuario registrado correctamente!");
            document.getElementById("userForm").reset();
        } else {
            alert("Error: " + data.error);
        }
    });
});
