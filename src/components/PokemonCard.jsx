import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { selectPokemon, deselectPokemon } from '../features/pokemon/pokemonSlice';

export const PokemonCard = ( pokemon ) => {
    const pokemonDetail = useSelector(state => state.pokemon.detailLoaded);
    const selection = useSelector(state => state.pokemon.selection)
    const dispatch = useDispatch();

    const handleClick = () => {
        !selection.includes(pokemon.name) ?
            dispatch(selectPokemon(pokemon.name)) 
            : dispatch(deselectPokemon(pokemon.name)) 
    }

    return (
    pokemonDetail[pokemon.name] ? (
        <div>
            <img onClick={ handleClick } src={ pokemonDetail[pokemon.name].sprites.front_default } alt={ `${pokemon.name} sprite` } /> 
            <p >{ pokemon.name } { selection.includes(pokemon.name) && <b>// Selected //</b>}</p>
        </div>
        ) : null
    )
}
