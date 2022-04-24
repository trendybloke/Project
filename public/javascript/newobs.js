analyses = 1;
const maxAnalyses = 5;

let plusButton;
let minusButton;
let analysesContainer;

document.onload = () => {
    plusButton = document.getElementById("plus");
    minusButton = document.getElementById("minus");
}
function toggleButton(button) {
    if (button.className == "hidden") {
        button.className = "";
        return;
    }

    button.className = "hidden";
}

function addAnalysis() {
    if (analyses == maxAnalyses) return;

    analyses++;

    // Create analysis input
    analysesContainer = document.getElementById("analysesContainer");


    let newAnalysis = document.createElement("input");
    newAnalysis.setAttribute("id", `analyses[${analyses - 1}]`);
    newAnalysis.setAttribute("name", `analyses[${analyses - 1}]`);
    newAnalysis.setAttribute("required", "true");

    analysesContainer.append(newAnalysis);

    plusButton = document.getElementById("plus");
    minusButton = document.getElementById("minus");

    if (analyses == maxAnalyses) toggleButton(plusButton);
    minusButton.className = "";
}

function removeAnalysis() {
    if (analyses == 1) return;

    // Remove analysis input
    let oldAnalysis = document.getElementById(`analyses[${analyses - 1}]`);
    oldAnalysis.remove();

    analyses--;

    plusButton = document.getElementById("plus");
    minusButton = document.getElementById("minus");

    if (analyses == 1) toggleButton(minusButton);
    plusButton.className = "";
}