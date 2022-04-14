//The user will enter a cocktail. Get a cocktail name, photo, and instructions and place them in the DOM
document.querySelector('form').addEventListener('submit', getCocktail);

let intervalID;

function getCocktail(e) {
  e.preventDefault();

  const cocktailQuery = document.querySelector('input').value.trim().split(' ').filter(s => s).join('+') || null;
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailQuery}`

  clearInput();
  clearDom();
  clearInterval(intervalID);

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(url)
      console.log(data)

      if (data.drinks) {
        let counter = 0;
        let d = data.drinks[counter];

        // data.drinks.forEach(d => {
        //   displayDrinkCard(d, 'id' + d.idDrink, d.strDrink, d.strDrinkThumb, 'id' + d.idDrink + 'Ingredients', d.strInstructions);
        // })
        displayDrinkCard(d, 'id' + d.idDrink, d.strDrink, d.strDrinkThumb, 'id' + d.idDrink + 'Ingredients', d.strInstructions);

        if (data.drinks.length > 1) {
          intervalID = setInterval( () => {
            if (counter === data.drinks.length - 1) {
              counter = 0;
            } else {
              counter++;
            }

            clearDom()
            d = data.drinks[counter];
            displayDrinkCard(d, 'id' + d.idDrink, d.strDrink, d.strDrinkThumb, 'id' + d.idDrink + 'Ingredients', d.strInstructions);
          }, 3000)
        }
      } else {
        createDrinkCard(null);
        addDrinkTitle('Sorry, no cocktails found by that name.', null);
      }

    })
    .catch(err => `Error: ${err}`);
};

function displayDrinkCard(drink, drinkId, drinkName, image, listId, instructions) {
  createDrinkCard(drinkId)
  addDrinkTitle(drinkName, drinkId);
  addDrinkImg(image, drinkId);
  addIngredientList(listId, drinkId);
  addDrinkInstructions(instructions, drinkId);
  for(let i = 1; drink[`strIngredient${i}`]; i++) {
    populateIngredientList(listId, `${drink[`strMeasure${i}`] || ''} ${drink[`strIngredient${i}`]}`)
  }
}

// create section container to hold individual drink information
function createDrinkCard(id) {
  const section = document.createElement('section');
  section.setAttribute('id', id);
  document.body.appendChild(section);
  // document.querySelector('#result').appendChild(section);
}

// dynamically create an h2 element for the drink title
function addDrinkTitle(content, cardId) {
  const h2 = document.createElement('h2');
  h2.innerText = content;
  document.querySelector(`#${cardId}`).appendChild(h2);
}

// dynamically create an img element for drink image
function addDrinkImg(url, cardId) {
  const img = document.createElement('img');
  img.src = url;
  document.querySelector(`#${cardId}`).appendChild(img);
}

// dynamically create a list to populate with ingredients & measurements
function addIngredientList(listId, cardId) {
  const h3 = document.createElement('h3');
  const list = document.createElement('ul');
  h3.innerText = 'Ingredients: ';
  list.setAttribute('id', listId);
  document.querySelector(`#${cardId}`).appendChild(h3);
  document.querySelector(`#${cardId}`).appendChild(list);
}

// dynamically add each ingredient & its measurement to the list
function populateIngredientList(listId, ingredient) {
  const item = document.createElement('li');
  item.innerText = ingredient;
  document.querySelector(`#${listId}`).appendChild(item);
}

// dynamically create an h3 element for drink instructions
function addDrinkInstructions(content, cardId) {
  const h3 = document.createElement('h3');
  const p = document.createElement('p');
  h3.innerText = 'Instructions: ';
  p.innerText = content;
  document.querySelector(`#${cardId}`).appendChild(h3);
  document.querySelector(`#${cardId}`).appendChild(p);
}

// clear out previously populated drink information
function clearDom() {
  document.querySelectorAll('section')?.forEach(section => section.remove());
}

// clear out previous query
function clearInput() {
  document.querySelector('input').value = null;
}