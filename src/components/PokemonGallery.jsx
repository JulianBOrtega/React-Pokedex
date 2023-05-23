import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchList, fetchBatch, fetchNextBatch, applyPokemonFilter } from '../features/pokemon/pokemonSlice'
import { applyAbilityFilter, fetchAbilities } from '../features/ability/abilitySlice'
import { PokemonCard } from './PokemonCard'
import nothingFound from '../assets/nothing.png'
import './pokemonGallery.css'

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
        <div className='pokemonGallery'>
            <h2>{(pokemonData.filter.content != '') && 
                `Searching ${pokemonData.filter.content}...`}</h2> 

            { pokemonData.loadingList && <p>Loading...</p> }
            { !pokemonData.loadingList && pokemonData.error ? <p>{ pokemonData.error }</p> : null }
            { !pokemonData.loadingList && pokemonData.list.length > 0 ? 
                pokemonData.filter.content != '' ? (
                <div className='pokemonContainer'>
                    { pokemonData.filteredList
                        .map((pokemon, i) => <PokemonCard key={ i + pokemon.name} { ...pokemon } />) } 
                    { pokemonData.filteredList.length == 0 && (
                        <div className='nothingFound'>
                            <img src={nothingFound} alt="nothingFound" />
                            <p>0 results. Sorry.</p>
                        </div>
                    )}
                </div>
                ) : (
                <div className='pokemonContainer'>
                    { pokemonData.list
                        .map((pokemon, i) => <PokemonCard key={ i + pokemon.name} { ...pokemon } />) } 
                </div>
                ) 
            : null }
        </div>
    )
}
