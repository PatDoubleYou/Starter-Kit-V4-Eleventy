document.getElementById("cabinetry-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const cabinetOpeningWidth = parseFloat(document.getElementById("width").value);
    const widthFraction = parseFloat(document.getElementById("width-fraction").value);
    const totalWidth = cabinetOpeningWidth + widthFraction;
    const height = parseFloat(document.getElementById("height").value);
    const depth = parseFloat(document.getElementById("depth").value);
    const thickness = parseFloat(document.getElementById("thickness").value);

    const drawerBox = calculateDrawerBox(totalWidth, height, depth, thickness);
    displayResults(drawerBox);
});

function calculateDrawerBox(totalWidth, height, depth, thickness) {
    const adjustedWidth = totalWidth - 0.65625; // This is the value for 42mm from Blum's book.
    console.log(`${adjustedWidth} = ${totalWidth} - 0.65625`)
    const adjustedHeight = height; // No adjustment needed
    const adjustedDepth = depth; // No adjustment needed
    const maxDrawerHeight = height - 0.8125 // At least 13/16 of an inch is required due to the lift from the bottom of the hardware, with the drawer box sitting on the saddle.

    return {
        frontBack: {
            width: adjustedWidth,
            height: maxDrawerHeight,
        },
        sides: {
            width: adjustedDepth,
            height: maxDrawerHeight,
        },
        bottom: {
            width: adjustedWidth + 0.25, // Need to add 1/4in for fitting into the slot.
            depth: adjustedDepth + 0.25,
        },
        maxDrawerHeight: maxDrawerHeight,
    };
}



function millimetersToInches(mm) {
    const inches = mm / 25.4;
    return inches;
}

function inchesToMillimeters(inches) {
    const mm = inches * 25.4;
    return mm;
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function decimalToFraction(decimal) {
    const closest32nd = Math.round(decimal * 32);
    const numerator = closest32nd;
    const denominator = 32;

    const divisor = gcd(numerator, denominator);
    return {
        numerator: numerator / divisor,
        denominator: denominator / divisor,
    };
}


function displayResults(drawerBox) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <h2>Drawer Box Components:</h2>
        <p>Front/Back: ${convertToMixedNumber(drawerBox.frontBack.width)} (2 pieces)</p>
        <p>Sides: ${drawerBox.sides.width} (2 pieces)</p>
        <p>Bottom: ${convertToMixedNumber(drawerBox.bottom.width)} x ${convertToMixedNumber(drawerBox.bottom.depth)} (1 piece)</p>
        <p>Max Drawer Height: ${drawerBox.maxDrawerHeight}</p>
        <p>Preparing the back piece:
            <ol>
                <li>Drill a hole 7mm in from the outer edge and 24mm up from the bottom.</li>
                <li>Notch both bottom corners, 1/2 inch up and at least 1 3/8inch towards the center.</li>
            </ol>
        </p>
    `;
}



// Perform calculations using millimeters or inches, as needed

const widthInInches = parseFloat(document.getElementById("width").value);
const widthInMillimeters = inchesToMillimeters(widthInInches);

const heightInInches = parseFloat(document.getElementById("height").value);
const heightInMillimeters = inchesToMillimeters(heightInInches);

const depthInInches = parseFloat(document.getElementById("depth").value);
const depthInMillimeters = inchesToMillimeters(depthInInches);

function convertToMixedNumber(measurement) {
    console.log(`converting ${measurement}`);
    const integerPart = Math.floor(measurement);
    const decimalPart = measurement - integerPart;
    console.log(`separated to ${integerPart} and ${decimalPart}`);
    const fraction = decimalToFraction(decimalPart);
    const mixedNumber = `${integerPart} ${fraction.numerator}/${fraction.denominator}"`;
    console.log(mixedNumber);
    return mixedNumber
}