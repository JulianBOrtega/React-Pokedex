import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { selectPokemon, deselectPokemon } from '../features/pokemon/pokemonSlice';
import loading from '../assets/magikarp.gif'
import './pokemonCard.css';

export const PokemonCard = ( pokemon ) => {
    const [loadingImg, setLoadingImg] = useState(true);
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
        <div className={`pokemonCard ${ selection.includes(pokemon.name) ? 'selectedCard' : ''}`}>

            <div style={{display: loadingImg ? "block" : "none"}}>
                <img src={loading} alt="Loading..." className="loadingGif" />
            </div>
            
            <div style={{display: loadingImg ? "none" : "block"}}>
                <img className='pokemonImg'
                src={ pokemonDetail[pokemon.name].sprites.other['official-artwork'].front_default } 
                alt={ `${pokemon.name} sprite` }  
                onClick={ handleClick } 
                onLoad={() => setLoadingImg(false)} 
                />
            </div>
            
            
            <p className='name'>{ pokemon.name }</p>
            <p>Weight: {pokemonDetail[pokemon.name].weight}</p>
            <div className='abilityContainer'>
                {pokemonDetail[pokemon.name].abilities.map(ability => <p className='ability'>{ability.ability.name}</p>)}
            </div>
        </div>
        ) : null
    )
}
