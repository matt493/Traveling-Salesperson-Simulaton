const NODE_SIZE = 20;

let button, canvas;

let running = false;

let townStack = [];
let bestTour;
let bestDistance;
let totalSolutions;
let solutionsExplored;

class Town
{
	constructor(x, y, index)
	{
		this.x = x;
		this.y = y;
		this.visited = false;
		this.index = index;
	}
}

//#region Util Funcs
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function drawNode(node)
{
	fill('white');
	stroke(0);
	strokeWeight(0);
	circle(node.x, node.y, NODE_SIZE);
}

function drawEdge(start, end)
{
	let x0 = start.x,	y0 = start.y;
	let x1 = end.x, 	y1 = end.y;

	stroke(110);
	strokeWeight(4);
	line(x0, y0, x1, y1);
}

function distanceBetween(start, end)
{
	let x0 = start.x,	y0 = start.y;
	let x1 = end.x, 	y1 = end.y;

	return Math.sqrt(Math.pow(x1-x0,2) +  Math.pow(y1-y0,2));
}

async function run()
{
	running = true;
	clear();
	setup();
	loop();
	totalSolutions = fact(townStack.length) / fact(townStack.length - townStack.length);

	if(townStack.length == 1){}	//only 1 town, do nothing
	else if(townStack.length == 2)	//2 towns, best path is straight line between them
	{
		bestTour = [...townStack];
	}
	else
	{
		await generatePermutations(townStack, townStack.length);	//generates permutations and stores in solutions[]
	}
	// drawUI();
	noLoop();
	bestDistance = 0;
	for (let i = 0; i < bestTour.length; i++)
	{
		let nxtTown = (i+1) % bestTour.length;
		bestDistance += distanceBetween(bestTour[i], bestTour[nxtTown]);

		drawEdge(bestTour[i], bestTour[nxtTown]);
	}
	print('Best Distance:', bestDistance);

	running = false;
}

async function generatePermutations(arr, size)	//Heap's Algorithm to generate permutations
{
	if(size == 1)
	{
		// print(arr);
		await evaluateSolution([...arr]);
		return;		// if size becomes 1 then print the obtained permutation
	}
	else
	{
		for (let i = 0; i < size; i++)
		{
			await generatePermutations(arr, size-1);

			// if size is odd, swap 'first' ie: arr[0] and 'last' ie: arr[size-1]
			// else If size is even, swap arr[i] and 'last' ie: arr[size-1]
			let swapPos = (size %2)? i : 0;	//if size even swapPos = i else swapPos = 0
			[arr[swapPos], arr[size-1]] = [arr[size-1], arr[swapPos]];		//destructing assignment method
		}
	}
}

async function evaluateSolution(solution)
{
	// drawUI();
	if(solution[0].index < solution[solution.length - 2].index)	//don't check duplicates which are just reverse of a solution
	{
		let distance = 0;
		
		for (let i = 0; i < solution.length; i++)
		{
			let nxtTown = (i+1) % solution.length;
			distance += distanceBetween(solution[i], solution[nxtTown]);
			drawEdge(solution[i], solution[nxtTown]);
		}
		if(distance < bestDistance || bestDistance == 0)
		{
			// drawUI();
			bestDistance = 0;
			bestTour = [...solution];

			for (let i = 0; i < bestTour.length; i++)
			{
				let nxtTown = (i+1) % bestTour.length;
				bestDistance += distanceBetween(bestTour[i], bestTour[nxtTown]);
				// drawEdge(bestTour[i], bestTour[nxtTown]);
			}
		}
		await delay(0);
	}
	
	drawUI();

	solutionsExplored++;
	rectMode(CORNER);
	let fillpercentage = (solutionsExplored/totalSolutions)*200;
	fill(100,200,100);
	strokeWeight(0);
	rect(100, 46, fillpercentage, 15);
}

function drawUI()
{
	background(50);
	rectMode(CORNERS);
	fill(0, 0);
	stroke('white');
	strokeWeight(1);
	rect(400, 50, windowWidth - 40, windowHeight - 50);

	rectMode(CORNER);

	textSize(20);
	strokeWeight(0);
	fill(200);
	text('Progress:', 10, 60);

	fill(0,0);
	stroke('white');
	strokeWeight(.5);
	rect(100, 46, 200, 15);
}

function fact(n)
{
	let f = 1;
	for(let i = 2; i <= n; i++)
		f = f * i;
	return f;
}

//#endregion 

function setup()
{
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0,0);
	
	button = createButton('RUN');
	button.position(10, 90);
	button.mouseClicked(run);

	explanation = createP(" Click inside the frame to create nodes.. Then Hit RUN!")
	explanation.style('color', 'white');
	explanation.style('align', 'centre');
	explanation.style('font-family', 'monospace');
	explanation.style('font-size', '19px');
	explanation.position(windowWidth/3,2)

	bestTour = [];
	bestDistance = 0;

	solutionsExplored = 0;
	totalSolutions = 0;

	drawUI();
	noLoop();
}

function draw()
{
	townStack.forEach(element => { drawNode(element); });
}

function mousePressed()
{
	if(mouseX > 400 && mouseX < windowWidth-40 && mouseY > 50 && mouseY < windowHeight-50 && !running)	//if click is inside the rectangle & not currently running
	{
		let town = new Town(mouseX, mouseY, townStack.length);
		townStack.push(town);
		drawNode(town);
	}
}