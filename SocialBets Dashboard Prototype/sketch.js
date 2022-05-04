let bitTable;
let ethTable;
let dogTable;

let dateStringArray;
let dateArray;

let bitCountStringArray;
let bitCountArray;

let bitTotal = 0;
let ethTotal = 0;

let bitContentArray;
let ethContentArray;

let score;
let bitIndividualScores = [];
let ethIndividualScores = [];
let totalBitScore = 0;
let totalEthScore = 0;

let likert;

function preload(){
  bitTable = loadTable("BitcoinTweets.csv"); // load local csv files
  ethTable = loadTable("EthereumTweets.csv");
  bitContentTable = loadTable("BitcoinContent.csv");
  ethContentTable = loadTable("EthereumContent.csv");

  likert = loadImage("Likert.png");
}

function setup() {


/////////////////BITCOIN SENTIMENT ANALYSIS//////////////

bitContentArray = bitContentTable.getArray(); // load table data into array
for(var i = 0; i < bitContentArray.length; i++){
  var contentString = JSON.stringify(bitContentArray[i]); // ensure the content of each post is in a string
  var words = contentString.split(/\W/); // parse string to get an array of words
  score = 0; //reset score to start each post at 0
  for(var j = 0; j < words.length; j++){
    var word = words[j].toLowerCase(); // afinn words are lowercase
    if(afinn[word]) // search for the word in the afinn list
    {
      score += Number(afinn[word]); // add afinn score to the post's individual score
    }
  }
  if (score < -5){ // to ensure that a single post doesn't skew the results too drastically
    score = -5;
  }
  else if (score > 5){
    score = 5;
  }
  bitIndividualScores.push(score); // add individual score to list of individual scores
}

////////////////ETHEREUM SENTIMENT ANALYSIS////////////////////

ethContentArray = ethContentTable.getArray(); // load each post into an array
for(var i = 0; i < ethContentArray.length; i++){
  var contentString = JSON.stringify(ethContentArray[i]);
  var words = contentString.split(/\W/);
  score = 0; // reset score for new post
  for(var j = 0; j < words.length; j++){
    var word = words[j].toLowerCase(); // all words in afinn are lowercase
    if(afinn[word])
    {
      score += Number(afinn[word]);
    }
  }
  if (score < -5){ //to ensure that a single post doesn't skew the results too drastically
    score = -5;
  }
  else if (score > 5){
    score = 5;
  }
  ethIndividualScores.push(score);
}

for (var i = 0; i < bitIndividualScores.length; i++){ // add scores together
  totalBitScore += bitIndividualScores[i];
}

totalBitScore = totalBitScore/bitIndividualScores.length; // divide by number of posts to get the average individual score

for (var i = 0; i < ethIndividualScores.length; i++){
  totalEthScore += ethIndividualScores[i]
}

totalEthScore = totalEthScore/ethIndividualScores.length;

///////////////////////////////////////////////////////////////

  createCanvas(1600, 600);
  background(255);

  dateStringArray = bitTable.getColumn(0); // get dates column into array
  // dateArray = dateStringArray.map(d => new Date(d));

  bitCountStringArray = bitTable.getColumn(3); // load table column into array
  bitCountArray = bitCountStringArray.map((str) => parseInt(str)); // convert string array to int array

  ethCountStringArray = ethTable.getColumn(1); 
  ethCountArray = ethCountStringArray.map((str) => parseInt(str)); 

  for (let i = 0; i < bitCountArray.length; i += 1) { // count total mentions
    bitTotal += bitCountArray[i];
  }
  for (let i = 0; i < ethCountArray.length; i += 1) {
    ethTotal += ethCountArray[i];
  }
  bitCountArray.unshift("Bitcoin"); // add labels at the beginnings of data arrays
  ethCountArray.unshift("Ethereum");

  ////////////// DRAW CHART ////////////

  var chart = c3.generate({
    
    data: {
      colors: {
        "Bitcoin": '#f2a900',
        "Ethereum": '#3c3c3d'
      },
        columns: [
            bitCountArray,
            ethCountArray
        ]
    },

    title: {
      text: 'BTC and ETH Mention Count Over Last 30 Days'

    },

    axis: {
      x: {
        tick: {
          centered: true,
          culling: true
        },
        type: 'category',
          categories: dateStringArray
      }
    },

    legend: {
      position: 'right'
  }
});



}

function draw(){
  
  
let bitDiameter = map(bitTotal, 0, 200, 0, 100); // map the total number of counts to a drawable diameter for the circles
let ethDiameter = map(ethTotal, 0, 200, 0, 100);

textAlign(CENTER); // ensure the text is directly under the circles
imageMode(CENTER);
textSize(20);
fill('#000000');
noStroke();

text("Total mentions over the last 30 days", 400, 125);

fill(242, 169, 0); // BTC RGB
circle(200, 300, bitDiameter);
text("Bitcoin", 200, 300 + (bitDiameter/2) + 20);

fill(113, 107, 148); // ETH RGB
circle(600,300,ethDiameter);
text("Ethereum", 600, 300 + (ethDiameter/2) + 20);

fill('#000000');
text("Sentiment Scores based on Context of Mentions", 1300, 125);
text("(scaled from -5 to 5)", 1300, 150);
text("-5", 1035, 305);
text("+5", 1565, 305);
image(likert, 1300, 300);

textSize(12);
text("BTC", 1300 + (totalBitScore * 50), 280);
text("ETH", 1300 + (totalEthScore * 50), 330);
stroke(0);
line(1300 + (totalBitScore * 50), 285, 1300 + (totalBitScore * 50), 300);
line(1300 + (totalEthScore * 50), 300, 1300 + (totalEthScore * 50), 315);
noStroke();

textSize(15);
textAlign(LEFT);
text("Bitcoin: " + totalBitScore, 1200, 400);
text("Ethereum: " + totalEthScore, 1200, 425);

}