const createElement = (parent, tag, classes, content) => {
  const element = document.createElement(tag);
  if (classes) element.classList.add(...classes);
  if (content) element.textContent = content;
  parent.appendChild(element);
  return element;
};

const hideElement = (element) => {
  element.style.visibility = 'hidden';
};

const toggleButton = (button, shouldShow) => {
  button.style.visibility = shouldShow ? 'visible' : 'hidden';
};

const body = document.querySelector('body');

const cowButton = createElement(body, 'button', ['cow']);
cowButton.style.cssText = 'background-color:transparent; border:none';
const cowIcon = createElement(cowButton, 'img');
cowIcon.src = 'images/cow.png';

// Get the cow sound audio element
const cowSound = document.getElementById('cowSound');
// Create a flex container for the cash counter and milk bottle
const flexContainer = createElement(document.body, 'div', ['flex-container']);
flexContainer.style.cssText =
  'display: flex; align-items: center; justify-content: center; gap:1em; margin-left:50px';

const hiringContainer = createElement(body, 'div', ['hiring-container']);
hiringContainer.style.cssText =
  'display:flex; align-items: center; justify-content: center; gap:1em; margin-left:50px';
const bottleCounter = createElement(
  flexContainer,
  'p',
  ['bottle-counter'],
  '0'
);
const milkIcon = createElement(flexContainer, 'img', ['milk-icon']);
milkIcon.style.cssText = 'background-color:transparent; border:none';
milkIcon.src = 'images/milk.png';

const sellMilkButton = createElement(
  body,
  'button',
  ['sell-milk'],
  'Sell Milk + $0.00'
);
hideElement(sellMilkButton);

const producerButtonA = createElement(
  hiringContainer,
  'button',
  ['producer-btn-a'],
  '- $5 hire a worker'
);
hideElement(producerButtonA);

const producerButtonB = createElement(
  hiringContainer,
  'button',
  ['producer-btn-b'],
  '- $10 hire a cow'
);
hideElement(producerButtonB);
// Create a container div for the cashCounter and piggyBank elements
const containerDiv = createElement(body, 'div', ['container']);
containerDiv.style.cssText = 'position: relative;';
const cashCounter = createElement(containerDiv, 'p', ['cash-counter'], '$0.00');
cashCounter.style.cssText = 'position: absolute; margin: 10px; z-index: 2;';

const piggyBank = createElement(containerDiv, 'img', ['piggy-bank']);
piggyBank.style.cssText =
  'background-color:transparent; width:150px; border: none';
// ('background-color: transparent;width:150px;border: none; position: fixed; bottom:30em;left:20em;z-index: 1;');
piggyBank.src = 'images/piggybank.png';

const producerContainer = createElement(body, 'div', ['producer-container']);
const people = createElement(body, 'p', ['people'], '+1 bottles/sec');
hideElement(people);
const personIcon = createElement(producerContainer, 'div', ['person']);
createElement(personIcon, 'i', ['fa-solid', 'fa-person']);
hideElement(personIcon);

let bottleCount = 0;
let milkSellAmount = 0;
let cash = 0;
let producers = [];

const producerTypes = [
  { name: 'Producer A', cost: 5, milkPerSecond: 1 },
  { name: 'Producer B', cost: 10, milkPerSecond: 2 },
];

const updateDisplay = (element, content) => {
  element.textContent = content;
};

const toggleButtonVisibility = () => {
  toggleButton(producerButtonA, cash >= producerTypes[0].cost);
  toggleButton(producerButtonB, cash >= producerTypes[1].cost);
  toggleButton(sellMilkButton, milkSellAmount > 0);
};

const updateAllDisplays = () => {
  updateDisplay(bottleCounter, bottleCount);
  updateDisplay(sellMilkButton, `Sell Milk + $${milkSellAmount.toFixed(2)}`);
  updateDisplay(cashCounter, `$${cash.toFixed(2)}`);
  toggleButtonVisibility();
};

const buyProducer = (index) => {
  const producer = producerTypes[index];

  if (cash >= producer.cost) {
    cash -= producer.cost;
    producers.push(producer);

    if (index === 0) {
      toggleButton(people, true);
      toggleButton(personIcon, true);
    }

    const milkProductionInterval = setInterval(() => {
      milkSellAmount += producer.milkPerSecond;
      bottleCount += producer.milkPerSecond;
      updateDisplay(
        sellMilkButton,
        `Sell Milk + $${milkSellAmount.toFixed(2)}`
      );
      updateAllDisplays();
    }, 1000);

    producers[index].interval = milkProductionInterval;
    updateAllDisplays();
  } else if (milkSellAmount >= producer.cost) {
    milkSellAmount -= producer.cost;
    producers.push(producer);
  } else {
    producers.push(producer);
  }

  toggleButtonVisibility();
  updateAllDisplays();
};

const handleCowButtonClick = () => {
  bottleCount += 1;
  milkSellAmount += 0.5;
  // Play the cow sound
  cowSound.play();
  updateAllDisplays();
};

const resetCount = () => {
  milkSellAmount = 0;
  bottleCount = 0;
  updateAllDisplays();
};

const accumulateCash = () => {
  cash += milkSellAmount;
  updateAllDisplays();
};

updateAllDisplays();

cowButton.addEventListener('click', handleCowButtonClick);

sellMilkButton.addEventListener('click', () => {
  accumulateCash();
  resetCount();
});

producerButtonA.addEventListener('click', () => {
  if (cash >= producerTypes[0].cost) {
    buyProducer(0);
  }
});

producerButtonB.addEventListener('click', () => {
  if (cash >= producerTypes[1].cost) {
    buyProducer(1);
  }
});
