const NODE_SIZE = 20;

let button, canvas;

let running = false;

let townStack = [];
let bestTour = [];
let bestDistance = 0;

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

	stroke(120);
	strokeWeight(4);
	line(x0, y0, x1, y1);
}

function distanceBetween(start, end)
{
	let x0 = start.x,	y0 = start.y;
	let x1 = end.x, 	y1 = end.y;

	return Math.sqrt(Math.pow(x1-x0,2) +  Math.pow(y1-y0,2));
}

async function generatePermutations(arr, size)	//Heap's Algorithm to generate permutations
{
	if(size == 1)
	{
		await evaluateSolution(arr);
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
	if(solution.length <= 2) {}
	else if(solution[0].index < solution[solution.length - 2].index)	//don't check duplicates which are just reverse of a solution
	{
		let distance = 0;
		for (let i = 0; i < solution.length; i++)
		{
			let nxtTown = (i+1) % solution.length;
			distance += distanceBetween(solution[i], solution[nxtTown]);
	
			drawEdge(solution[i], solution[nxtTown]);
			await delay(0);
		}
		if(bestDistance == 0){bestDistance = distance;}
		else if(distance <= bestDistance)
		{
			bestDistance = distance;
			bestTour = [...solution];
			print('Best Distance Yet:', bestDistance);
		}
		clear();
		drawUI();
	}
}

function drawUI()
{
	background(50);
	rectMode(CORNERS);
	fill(0, 0, 0, 0);
	stroke('white');
	strokeWeight(1);
	rect(400, 50, windowWidth - 40, windowHeight - 50);
}

//#endregion 

function setup()
{
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0,0);
	
	button = createButton('RUN');
	button.position(10, 10);
	button.mouseClicked(run);

	drawUI();
}

async function run()
{
	running = true;
	clear();
	setup();
	
	await generatePermutations(townStack, townStack.length);	//generates permutations and stores in solutions[]

	let distance = 0;
	for (let i = 0; i < bestTour.length; i++)
	{
		let nxtTown = (i+1) % bestTour.length;
		distance += distanceBetween(bestTour[i], bestTour[nxtTown]);

		drawEdge(bestTour[i], bestTour[nxtTown]);
	}
	print('Best Distance:', distance);
	bestDistance = 0;
	running = false;
}

function draw()
{
	townStack.forEach(element => { drawNode(element); });
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function mousePressed()
{
	if(mouseX > 400 && mouseX < windowWidth-40 && mouseY > 50 && mouseY < windowHeight-50 && !running)	//if click is inside the rectangle & not currently running
	{
		let town = new Town(mouseX, mouseY, townStack.length);
		townStack.push(town);
		drawNode(town);
	}
}