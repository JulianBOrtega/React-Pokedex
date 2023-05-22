import { configureStore } from "@reduxjs/toolkit";
import pokemonReducer from '../features/pokemon/pokemonSlice';
import abilitySlice from "../features/ability/abilitySlice";

const store = configureStore({
    reducer: {
        pokemon: pokemonReducer,
        ability: abilitySlice
    }
})

export default store;