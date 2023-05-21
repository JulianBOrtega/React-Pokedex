import React from 'react'
import { useSelector } from 'react-redux';

export const PokemonCard = ( pokemon ) => {
    const pokemonDetail = useSelector(state => state.pokemon.detailLoaded);

    return (
    pokemonDetail[pokemon.name] ? (
        <div>
            <img src={ pokemonDetail[pokemon.name].sprites.front_default } alt={ `${pokemon.name} sprite` } /> 
            <p>{ pokemon.name }</p>
        </div>
        ) : null
    )
}
