import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchList, fetchBatch, fetchNextBatch, removeSelection } from '../features/pokemon/pokemonSlice'
import { fetchAbilities } from '../features/ability/abilitySlice'
import { PokemonCard } from './PokemonCard'

export const PokemonGallery = () => {
    const pokemonData = useSelector(state => state.pokemon);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchList()).then(() => {
            dispatch(fetchNextBatch());
            console.log('triggers from 1st useEffect')
        });

        dispatch(fetchAbilities());
    }, [])

    useEffect(() => {
        if(pokemonData.filter.content !== ''){ 
            const start = pokemonData.filteredOffset;
            const end = pokemonData.filteredOffset + pokemonData.limit;
            
            dispatch(fetchBatch(pokemonData.filteredList.slice(start, end)));
            console.log('triggered filterload')
        }
    }, [pokemonData.filter.content])

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
            if(scrollTop + clientHeight >= scrollHeight - 10 && !pokemonData.loadingNextBatch) {

                if(pokemonData.filter.content !== ''){ 
                    const start = pokemonData.filteredOffset;
                    const end = pokemonData.filteredOffset + pokemonData.limit;
                    
                    fetchBatch(pokemonData.filteredList.slice(start, end));
                    setFilteredLastIndex(filteredLastIndex + 20);
                }
                else{
                    dispatch(fetchNextBatch());
                }
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
            <h2>{(pokemonData.filter.content != '') ? 
                `Search: ${pokemonData.filter.content}` : 'Pokemons'}</h2> 
            <button onClick={() => dispatch(removeSelection())}>Remove selection</button>

            { pokemonData.loadingList && <p>Loading...</p> }
            { !pokemonData.loadingList && pokemonData.error ? <p>{ pokemonData.error }</p> : null }
            { !pokemonData.loadingList && pokemonData.list.length > 0 ? 
                pokemonData.filter.content != '' ? (
                <div>
                    { pokemonData.filteredList
                        .map((pokemon, i) => <PokemonCard key={ i + pokemon.name} { ...pokemon } />) } 
                </div>
                ) : (
                <div>
                    { pokemonData.list
                        .map((pokemon, i) => <PokemonCard key={ i + pokemon.name} { ...pokemon } />) } 
                </div>
                ) 
            : null }
        </div>
    )
}
