/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  document.querySelector("#coffee_counter").innerText = coffeeQty;
}

function clickCoffee(data) {
  // your code here
  data.coffee += 1;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.forEach((element) => {
    if (coffeeCount >= element.price / 2) {
      element.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  unlockProducers(data.producers, data.coffee);
  return data.producers.filter((element) => {
    return element.unlocked;
  });
}

function makeDisplayNameFromId(id) {
  return id
    .split("_")
    .map(
      (element) => element[0].toUpperCase() + element.slice(1, element.length)
    )
    .join(" ");
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  let producer = document.querySelector("#producer_container");
  deleteAllChildNodes(producer);
  const producers = getUnlockedProducers(data);
  producers.forEach((element) => {
    producer.appendChild(makeProducerDiv(element));
  });
}

// your code here

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  return data.producers.filter((element) => {
    return element.id === producerId;
  })[0];
}

function canAffordProducer(data, producerId) {
  if (data.coffee >= getProducerById(data, producerId).price) {
    return true;
  }
  return false;
}

function updateCPSView(cps) {
  let totalCps = document.querySelector("#cps");
  totalCps.innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  // your code here
  if (canAffordProducer(data, producerId)) {
    getProducerById(data, producerId).qty += 1;
    data.coffee -= getProducerById(data, producerId).price;
    getProducerById(data, producerId).price = updatePrice(
      getProducerById(data, producerId).price
    );

    data.totalCPS += getProducerById(data, producerId).cps;

    updateCPSView(data.totalCps);
    return true;
  } else {
    window.alert("Not enough cofee!");

    return false;
  }
}
function buyButtonClick(event, data) {
  if (event.target.tagName === "BUTTON") {
    let producerId = event.target.id.slice(4, event.target.id.length);
    console.log(producerId);

    let bought = attemptToBuyProducer(data, producerId);
    if (bought) {
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }
  }
}

function tick(data) {
  // your code here
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

saveDataToLocalStorage = (data) => {
  localStorage.setItem("data", JSON.stringify(data));
};

getData = () => {
  if (localStorage.getItem("data")) {
    return JSON.parse(localStorage.getItem("data"));
  } else return window.data;
};
renderAllData = (data) => {
  updateCoffeeView(data.coffee);
  updateCPSView(data.totalCPS);
  renderProducers(data);
};

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  let data = getData();
  renderAllData(data);
  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
  setInterval(() => saveDataToLocalStorage(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
