const app = {};

///////////////get results from API and display as a list //////////////
app.apiKey = `5b496702`;
app.apiUrl = `http://www.omdbapi.com/`;
app.spanElement = document.querySelector('span.searchParameter');
app.resultsUl = document.querySelector('ul.resultsList');
app.nominationsList = document.querySelector('ul.nominationsList');

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
                app.resultsUl.innerHTML = `<h4>no results found</h4>`;
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
        app.resultsUl.scrollIntoView();
    })
}

//display results to page
app.displayResults = (resultsArray,userInput) => {
    app.spanElement.textContent = `"${userInput}"`;
    app.resultsUl.innerHTML= '';
    resultsArray.forEach( (movie,index) => {
        const {Poster, Title, Year} = movie;
        
        const movieList = document.createElement('li');
        movieList.classList.add('movie');

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('contentContainer');
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('imageContainer');

        const movieImage = document.createElement('img');
        movieImage.src = Poster;
        movieImage.alt = Title;

        const movieTitle = document.createElement('h3');
        movieTitle.textContent = `${Title} (${Year})`;

        const nominateButton = document.createElement('button');
        nominateButton.textContent = 'nominate';
        nominateButton.classList.add('nominate');
        nominateButton.id = index;

        //check if movie match with movie in nomination list. if so, then disable the button
        if (app.nominationsList.children.length > 0){
            [... app.nominationsList.children].forEach( (list) => {
                if (list.children[0].textContent === movieTitle.textContent) {
                    nominateButton.setAttribute('disabled',true);
                };
            });
        }

        //append element to display
        imgDiv.appendChild(movieImage);
        contentDiv.appendChild(movieTitle);
        contentDiv.appendChild(nominateButton);

        movieList.appendChild(imgDiv);
        movieList.appendChild(contentDiv);

        app.resultsUl.appendChild(movieList);
        
    });
}

// function to listen to nominate button and save to nominations list when user clicks on nominate button
app.nominate = () => {
    app.resultsUl.addEventListener('click', function (e) {
        if (e.target.tagName === "BUTTON") {
            //select the clicked button
            const button = e.target;
            //title and year of nominated move
            const nominateMovie = e.target.parentElement.children[0].textContent;
            //user can nominate up to 5 movies, once hit 5 , alert that they at max
            if (app.nominationsList.children.length < 5) {
                //append to  nominations list
                app.displayNominations(nominateMovie);
                //disable the button if that movie is nominated
                button.setAttribute('disabled',true)
            } else {
                alert("You have 5 nominations already");
            } 
        }
    });
}

//display nominations
app.displayNominations = (movie) => {
    //create a list element
    const nominatedMovie = document.createElement('li');
    //create title of the movie
    const movieTitle = document.createElement('p');
    movieTitle.textContent = movie;

    //create remove button element
    const removeButton = document.createElement('button');
    removeButton.textContent = 'remove';
    //append title and button to li
    nominatedMovie.appendChild(movieTitle);
    nominatedMovie.appendChild(removeButton);
    //append li to ul
    app.nominationsList.appendChild(nominatedMovie);
    if (app.nominationsList.children.length === 5) {
        const banner = document.querySelector('#banner');
        banner.classList.add('active');
    }
}

//function to listen to remove button to remove nominations when user click remove
app.removeNomination = () => {
    app.nominationsList.addEventListener('click', function (e) {
        if (e.target.tagName === "BUTTON") {
            //remove the nomination
            this.removeChild(e.target.parentElement);

            //enable nominate button back to that movie
            //check if movie match with movie in the results list. if so, then enable the nomination button
            const removedTitle = e.target.parentElement.children[0].textContent;
            [...app.resultsUl.children].forEach( (list) => {
                const title = list.children[1].children[0].textContent;
                if (removedTitle===title) {
                    list.children[1].children[1].removeAttribute('disabled');
                }
            });
        }
    });
}

app.init = () => {
    app.checkInput();
    app.nominate();
    app.removeNomination();
}

//initialize app
app.init();