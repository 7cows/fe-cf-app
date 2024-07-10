# Frontend for 7cows.io

This is the frontend of the website [7cows.io](7cows.io), the backend is not part of this repo.

## The execution flow

The high-level execution flows looks as follows:

`/cf` is created from`templates/results.html` where first the js frameworks from CDNs are loaded, then the scripts `utls.js`, `app.js`, `cards.js` and `cf.js` are loaded.
Finally, the function `$(document).ready()` gets executed with all its logic, the injection of the most relevant flask objects takes place there as well.

## How to run

### How to run it locally

One need to install the dependencies for the flask app (python dependencies are managed by [poetry](https://python-poetry.org/docs/#installation)):
```bash
poetry install
```

Once the dependencies are in place, run this.
```bash
poetry run python flask run --debug
```

Note that it's a dummy flask application. It uses the endpoints from [7cows.io](7cows.io/cf).

### Run the tests

Tests leverage the nodejs' 'jest' framework, first install the necessary `nodejs` modules:

```bash
npm install
```

Run the unit tests:

```bash
npm test
```

Additionally, one can test UI with cypress:

```bash
npx cypress run
```

## How to contribute

Issues are to be raised and bugs to be reported on [github](https://github.com/7cows/fe-cf-app/issues), code is to be contributed on [gitlab](https://gitlab.com/7cows/fe-cf-app/issues). 

### Issues/bugs

There's an issues tracker open to public set up at https://github.com/7cows/fe-cf-app/issues
If you face an error or a bug on [7cows.io](https://7cows.io), please raise it there.

### Code

The code could be contributed on [gitlab.com/7cows/fe-cf-app](https://gitlab.com/7cows/fe-cf-app)
To avoid the work in vain, at best, it should follow some issue or the need for such a change should be consulted upfront.

