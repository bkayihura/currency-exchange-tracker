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

const ratesTable =document.getElementById("ratesTable");

async function loadRates() {
    try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");

        if (!response.ok) {
            throw new Error("Failed to load rates");
        }

        const data = await response.json();
    
        if (data.result !== "success") {
            throw new Error("Invalid API response");
        }

        const currencies = ["RWF", "EUR", "GBP", "KES", "UGX", "TZS", "JPY", "CAD"];

        ratesTable.innerHTML = "";

        currencies.forEach(currency =>{
            const row = document.createElement("tr");
            const rate = data.rates[currency];

            if (typeof rate !== "number") return;

            const currencyCell = document.createElement("td");
            const rateCell = document.createElement("td");

            currencyCell.textContent = currency;
            rateCell.textContent = rate.toFixed(2);

            row.append(currencyCell, rateCell);
            ratesTable.appendChild(row);
        });
    } catch (error) {
        ratesTable.innerHTML = "<tr><td colspan='2'>Unable to load rates.</td></tr>";
        console.error(error);
    }
}

loadRates();

const searchCurrency = document.getElementById("searchCurrency");

searchCurrency.addEventListener("input", function () {
    const search = searchCurrency.value.toUpperCase();
    const rows = ratesTable.querySelectorAll("tr");

    rows.forEach(row => {
        const currency = row.cells[0].textContent.toUpperCase();

        if (currency.includes(search)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});

const sortRates = document.getElementById("sortRates");

sortRates.addEventListener("change", function () {
    const rows = Array.from(ratesTable.querySelectorAll("tr"));
    const selected = sortRates.value;

   if (selected === "name") {
    rows.sort((a,b) =>
        a.cells[0].textContent.localeCompare(b.cells[0].textContent)
    );

    } else if (selected === "low") {
        rows.sort((a,b) =>
            Number(a.cells[1].textContent) - Number(b.cells[0].textContent)
        );
    } else if (selected === "high") {
        rows.sort ((a,b) =>
            Number(b.cells[1].textContent) - Number(a.cells[1].textContent)
        );
    } else {
        const originalOrder = ["RWF", "EUR", "GBP", "KES", "UGX","TZS","JPY","CAD"];

        rows.sort ((a,b) =>
            originalOrder.indexOf(a.cells[0].textContent) -
            originalOrder.indexOf(b.cells[0].textContent)
        );
    }

    rows.forEach(row => ratesTable.appendChild(row));
});

const refreshBtn = document.getElementById("refreshBtn");

refreshBtn.addEventListener("click", function () {
    loadRates();
});