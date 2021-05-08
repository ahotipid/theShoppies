const app = {};

///////////////get results from API and display as a list //////////////
app.apiKey = `5b496702`;
app.apiUrl = `http://www.omdbapi.com/`;
app.resultsUl = document.querySelector('ul.resultsList');
app.spanElement = document.querySelector('span.searchParameter');

//search for movie base on user input
app.search = (userInput) => {
    const url = new URL(app.apiUrl);
    url.search = new URLSearchParams({
        // search parameter
        apikey : app.apiKey,
        s : userInput,
        type : `movie`,
        r :`json`
      });

    fetch(url)
        .then(res=>res.json())
        .then((json) => {
            if (json.Response === 'True') {
                const movieResults  = json.Search;
                app.displayResults(movieResults,userInput)
            } else {
                app.spanElement.textContent = `"${userInput}"`;
                app.ulElement.innerHTML = `<h4>no results found</h4>`;
            }
        })
}

//keep and eye on change of the input and search
app.checkInput = () => {
    const formElement = document.querySelector('form');
    formElement.addEventListener('submit', (e)=> {
        e.preventDefault();
        const userInput = document.querySelector('input').value;
        app.search(userInput);
    })
}

//display results to page
app.displayResults = (resultsArray,userInput) => {
    app.spanElement.textContent = `"${userInput}"`;
    app.resultsUl.innerHTML= '';
    resultsArray.forEach( (movie,index) => {
        const {Poster, Title, Year} = movie;
        
        const movieList = document.createElement('li');
        movieList.classList.add('movie')

        const contentDiv = document.createElement('div')
        const movieImage = document.createElement('img');
        movieImage.src = Poster;
        movieImage.alt = Title;

        const movieTitle = document.createElement('h3');
        movieTitle.textContent = `${Title} (${Year})`;

        const nominateButton = document.createElement('button');
        nominateButton.textContent = 'Nominate';
        nominateButton.classList.add('nominate');
        nominateButton.id = index;

        contentDiv.appendChild(movieTitle);
        contentDiv.appendChild(nominateButton);

        movieList.appendChild(movieImage);
        movieList.appendChild(contentDiv);

        app.resultsUl.appendChild(movieList);
        
    });
}
// function to listen to nominate button and save to nominations list
app.nominate = () => {
    app.resultsUl.addEventListener('click', function (e) {
        const listIndex = e.target.id;
        console.log(this.children[listIndex]);
    });
}

//////////////get data from local storage and append to the nominations list ///////////////

app.init = () => {
    app.checkInput();
    app.nominate();
    console.log(localStorage);
}

//initialize app
app.init();