const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const convertBtn = document.getElementById("convertBtn");
const result = document.getElementById("result");

async function convertCurrency() {
    const amount = Number(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (amountInput.value.trim() === "" || !Number.isFinite(amount) || amount <= 0) {
        result.textContent = "Please enter a valid amount greater than zero.";
        return;
    }

    result.textContent = "Converting...";

    try{
        const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);

        if (!response.ok) {
            throw new Error("Failed to fetch exchange rates");
        }

        const data = await response.json();

        if (data.result !== "success" || !Number.isFinite(data.rates?.[to])) { throw new Error("Exchange rate unavailabel");
    }

    const converted = amount * data.rates[to];

    result.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
} catch (error) {
    result.textContent ="Unable to load exchange rates. Please try again.";
    console.error(error);
}

}

convertBtn.addEventListener("click", convertCurrency);
