import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchList, fetchNextBatch, removeSelection } from '../features/pokemon/pokemonSlice'
import { PokemonCard } from './PokemonCard'

export const PokemonGallery = () => {
    const pokemonData = useSelector(state => state.pokemon);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchList()).then(() => {
            dispatch(fetchNextBatch());
            console.log('triggers from 1st useEffect')
        });
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
            if(scrollTop + clientHeight >= scrollHeight - 10 && !pokemonData.loadingNextBatch) {
                dispatch(fetchNextBatch());
                console.log('triggers from 2nd useEffect')
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <div>
            <h2>Pokemons</h2> 
            <button onClick={() => dispatch(removeSelection())}>Remove selection</button>

            { pokemonData.loadingList && <p>Loading...</p> }
            { !pokemonData.loadingList && pokemonData.error ? <p>{ pokemonData.error }</p> : null }
            { !pokemonData.loadingList && pokemonData.list.length > 0 ? (
                <div> 
                    { pokemonData.list.map((pokemon, i) => <PokemonCard key={ i + pokemon.name} { ...pokemon } />) } 
                </div>
            ) : null }
        </div>
    )
}
