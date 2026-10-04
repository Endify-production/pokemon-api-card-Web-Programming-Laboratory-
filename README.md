# Pokémon API Card

A simple web app that fetches Pokémon data from the [PokéAPI](https://pokeapi.co/) and displays it as a card.

## Features

- Search by Pokémon name or ID
- Quick search buttons: Pikachu, Charizard, Bulbasaur
- Official artwork sprite
- Type badges with type colors
- Height & weight
- Abilities list
- Six base stats with visual bars
- Loading and error states

## Files

```
pokemon-api-card/
├── index.html
├── style.css
├── script.js
├── README.md
└── screenshots/
    ├── success.png
    └── error.png
```

## Usage

1. Open `index.html` in a browser, or serve the folder:

   ```bash
   npx serve .
   ```

2. Type a Pokémon name (e.g. `pikachu`) or ID (e.g. `25`) and press **Search**.

## Screenshots

- `screenshots/success.png` — successful search result
- `screenshots/error.png` — error state (invalid Pokémon)

## API

Data fetched from `https://pokeapi.co/api/v2/pokemon/{name-or-id}`.
