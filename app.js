document.addEventListener("DOMContentLoaded", function() {
    ////////////////////////
    ////////////////////////
    ///   GLOBAL VARS    ///
    ////////////////////////
    ////////////////////////


    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var w = 10; //width and height of each cell
    var rows = 60; // number of rows
    var cols = 100; // number of columns
    var width = cols * w;
    var height = rows * w;
    var y = 0;
    var counter = 0;
    var ruleNumber = 0;


    ////////////////////////
    ////////////////////////
    ///     FUNCTIONS    ///
    ////////////////////////
    ////////////////////////

    // function generateRandomFirstRow() {
    //     let cells = [];
    //     for (let i = 0; i < cols; i++) {
    //         cells[i] = Math.floor(Math.random() * 2);
    //     }
    //     return cells;
    // }

    function generateFirstRow() {
        let cells = [];
        for (let i = 0; i < cols; i++) {
            cells[i] = 0;
        }
        cells[Math.floor(cols / 2)] = 1;
        return cells;
    }

    function boardStates(cellsColl) {
        let grid = {};
        grid[0] = cellsColl;

        for (let i = 0; i < rows; i++) {
            grid[i + 1] = generateNextRowState(grid[i]);
        }
        return grid;
    }

    function generateNextRowState(previousCellsColl) {
        let nextRowState = [];

        for (let i = 0; i < cols; i++) {
            let leftNeighbor = previousCellsColl[(i - 1 + cols) % cols]; // Handle wrap-around for left boundary
            let currentCell = previousCellsColl[i];
            let rightNeighbor = previousCellsColl[(i + 1) % cols]; // Handle wrap-around for right boundary

            let nextState = rules(leftNeighbor, currentCell, rightNeighbor);
            nextRowState.push(nextState);
        }

        return nextRowState;
    }

    function rules(s1, s2, s3) {
        function integerToBinary(n) {
            return n.toString(2);
        }
        if (ruleNumber > 255) {
            console.log("Number has to be between 1 and 255");
        } else {
            let ruleSet = integerToBinary(ruleNumber).padStart(8, '0'); // Ensure rule set is 8 digits long
            let index = parseInt(s1.toString() + s2.toString() + s3.toString(), 2); // Convert neighborhood state to binary string and then to integer
            return ruleSet.charAt(7 - index); // Retrieve the rule for the given neighborhood state
        }
    }

    ////////////////////////
    ////////////////////////
    //   ANIMATION LOOP   //
    ////////////////////////
    ////////////////////////

    function animationLoop() {
        let cells = generateFirstRow();
        const boardStatesMap = boardStates(cells)

        if (counter === rows) {
            return;
        } else {
            for (let i = 0; i < cols; i++) {
                let ele = boardStatesMap[counter][i];
                let x = i * w;
                ctx.beginPath();
                ctx.strokeStyle = "black";
                ctx.fillStyle = ele === '1' ? "black" : "white"; // Compare with '1' as rules function returns a string
                ctx.rect(x, y, w, w);
                ctx.fill();
                ctx.stroke();
            }
            y += w;
            counter += 1;
            requestAnimationFrame(animationLoop);
        }
    }

    function updateRule(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        ruleNumber = parseInt(document.getElementById("ruleNumberInput").value);
        counter = 0; // Reset counter to start animation loop from the beginning
        y = 0; // Reset y position
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before rerendering
        animationLoop(); // Rerun animation loop with the new rule
    }


    ////////////////////////
    ////////////////////////
    ///    START HERE    ///
    ////////////////////////
    ////////////////////////

    document.getElementById("updateButton").addEventListener("click", updateRule);

    canvas.width = width;
    canvas.height = height;
    animationLoop();
});
