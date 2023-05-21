import { configureStore } from "@reduxjs/toolkit";
import pokemonReducer from '../features/pokemon/pokemonSlice';

const store = configureStore({
    reducer: {
        pokemon: pokemonReducer
    }
})

export default store;