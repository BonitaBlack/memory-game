//global variables that 'should' work throughout the code
const deck = document.querySelector('.deck');
let flippedCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;
const cardMatch = 'card match open';


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    };
    return array;
}

// Can you hear what I hear?  Cards? are you clicked?
deck.addEventListener('click', event =>
{
    const clickTarget = event.target;
    //restartRefresh();
    if (kosherClick(clickTarget))
    {
        if (clockOff)
        {
            startClock();
            clockOff = false;
        }
    };

    if (kosherClick(clickTarget))
    {
        flipCard(clickTarget);
        addFlipCard(clickTarget);

    };

    if (flippedCards.length === 2)
    {
    //console.log('Now flippedCards array have 2 cards');

        checkForMatch(clickTarget);
        addMove();
        checkScore();

      };

});

// Is the click function halal?  or Kosher?  Let's check.
function kosherClick(clickTarget)
{
    return (clickTarget.classList.contains('card') && !clickTarget.classList.contains('match') && flippedCards.length < 2 && !flippedCards.includes(clickTarget));
}
//console.log("the click function is kosher");
// Toggle class of cards fuunction
function flipCard(card)
{
    card.classList.toggle('show');
    card.classList.toggle('open');
    card.classList.add('flop');
    card.classList.remove('flip');
//console.log("the card is flipped");
}

// push the clickTarget into the flippedCards array in global scope
function addFlipCard(clickTarget)
{
    flippedCards.push(clickTarget);
    console.log(flippedCards);
}

// looking for a match
function checkForMatch()
{
    if (flippedCards[0].firstElementChild.className === flippedCards[1].firstElementChild.className)
        {
          setTimeout(function()
            {
                flippedCards[0].className = cardMatch;
                flippedCards[1].className = cardMatch;
                flippedCards = [];
                setTimeout(function()
                {
                    checkWin();
                 }, 1500);

                }, 700);
// console.log("you are in a time-out mister");
    }
    else
    {
      setTimeout(function()
      {
            fail(); //FAIL FUNCTION when two cards don't match
         }, 200);
         flippedCards = [];
       }
}


function fail()
{
    var selected = document.querySelectorAll(".show");
    selected[0].classList.add("flip");
    selected[1].classList.add("flip");
    selected[0].classList.remove("flop");
    selected[1].classList.remove("flop");
    setTimeout(function() {
       selected[0].classList.remove("flip", "show", "open");
       selected[1].classList.remove("flip", "show", "open");
    }, 1000);
 }


// shuffle cards
function shuffleDeck()
{
    const shuffleCards = Array.from(document.querySelectorAll('.deck li'));
    const shuffledCards = shuffle(shuffleCards);

    for (card of shuffledCards)
    {
        deck.appendChild(card);
    }
}

// Making all the right moves.... with the right stuff.
function addMove()
{
    moves++;
    const moveText = document.querySelector('.moves');
    moveText.innerHTML = moves;
}

// star power!  If you don't move too much, you keep your stars!
function checkScore()
{
    if (moves === 10 || moves === 25 || moves === 40)
    {
        hideStar();
    }
}

// If you make too many moves, a star will hide, they are shy.
function hideStar()
{
    const starList = document.querySelectorAll('.stars li');
    for (star of starList)
    {
        if (star.style.display != 'none')
        {
            star.style.display = 'none';
            break;}
        };
}

// Start the clock.
function startClock()
{
    clockId = setInterval(() =>
    {
      time++;
      displayTime();
    },
    1000);
}

// Display how much time has gone by bc "Time Goes by.. so slowly"
function displayTime()
{
    const clock = document.querySelector(".clock");
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    //console.log(clock);
    if (seconds < 10)
    {
        clock.innerHTML = `${minutes}:0${seconds}`;
    }
    else
    {
        clock.innerHTML = `${minutes}:${seconds}`;
    }
}

// Stop the clock
function stopClock()
{
    clearInterval(clockId);
}

// Bless my stars function
function getStars()
{
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars)
    {
        if (star.style.display !== 'none')
        {
            starCount++;
        }
    }
    //console.log(starCount);
    return starCount;
}

// Modal..Thank you https://github.com/ahmedalameldin/fend-project-memory-game for the help with this!
function toggleModal()
{
    const modal = document.querySelector('.modal_bkgd');
    modal.classList.toggle('hide');
}

// MODAL Start
function toggleStartModal()
{
    const modal = document.querySelector('.modal_start');
    modal.classList.toggle('hide');
}

// MODAL: write stats func
function writeModalStats()
{
    const timeStat = document.querySelector('.modal_time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const movesStat = document.querySelector('.modal_moves');
    const starsStat = document.querySelector('.modal_stars');
    const stars = getStars();

    timeStat.innerHTML = `Time = ${clockTime}`;
    movesStat.innerHTML = `Moves = ${moves}`;
    starsStat.innerHTML = `Stars = ${stars}`;
}

// MODAL: Buttons listener func
document.querySelector('.btn_cancel').addEventListener('click', toggleModal);
document.querySelector('.modal_start_btn').addEventListener('click', toggleStartModal);
document.querySelector('.btn_replay').addEventListener('click', replayGame);
document.querySelector('.restart').addEventListener('click', gameOver);

// MODAL: Button replay to reset the game func
function resetGame()
{
    matched = 0;
    resetClockAndTime();
    resetMoves();
    resetStars();
    resetCards();
    shuffleDeck();
}

//MODAL: Button "Replay" to reset the game func
function replayGame()
{
    matched = 0;
    resetGame();
    toggleModal();
    resetCards();
    resetStars()
};



// Reset Functions :

function resetCards()
{
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards)
    {
    card.classList = 'card reset';
    }
};

function resetStars()
{
    const stars = document.querySelectorAll('ul.stars li');
    for (let star of stars)
    {
      star.style.display = 'inline';
    }
}

function resetClockAndTime()
{
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}

function resetMoves()
{
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

// FINAL CHECK if win or still playing
function checkWin()
{
    matched += 1;
    if (matched === 8)
    {
        gameOver();
        //console.log('finished');
    }
};




// Congratulations
function gameOver()
{
    stopClock();
    writeModalStats();
    toggleModal();
};

shuffleDeck();
writeModalStats();
toggleStartModal();




/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

