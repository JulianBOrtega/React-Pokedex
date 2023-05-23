import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setPokemonFilterContent, clearPokemonFilterList,
    applyPokemonFilter, removePokemonFilterAbility} from '../features/pokemon/pokemonSlice'
import { setAbilityFilterContent, clearAbilityFilterList, applyAbilityFilter } from '../features/ability/abilitySlice'
import { AbilitySearch } from './AbilitySearch'
import './searchBar.css';

export const Searchbar = () => {
    const pokemonFilter = useSelector(state => state.pokemon.filter);
    const [activityTimeout, setActivityTimeout] = useState(null);
    const inputRef = useRef(null);
    const typeRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(applyPokemonFilter())
    }, [pokemonFilter.abilities])

    const handleInputActivity = e => {
        const value = e.target.value;
        
        clearTimeout(activityTimeout);
        const timeout = setTimeout(() => {
            if(typeRef.current.value == 'pokemon') {
                dispatch(setPokemonFilterContent(value));
                dispatch(applyPokemonFilter());
            } else if(typeRef.current.value == 'ability') {
                dispatch(setAbilityFilterContent(value));
                dispatch(applyAbilityFilter());
            }
        }, 1000);

        setActivityTimeout(timeout);
    }

    const handleClearFilter = () => {
        clearTimeout(activityTimeout);
        if(typeRef.current.value == 'pokemon') {
            dispatch(setPokemonFilterContent('')); 
            dispatch(clearPokemonFilterList());
        } else if(typeRef.current.value == 'ability') {
            dispatch(setAbilityFilterContent('')); 
            dispatch(clearAbilityFilterList());
        }
        inputRef.current.value = '';
    }

    const handleForceSearch = () => {
        clearTimeout(activityTimeout);
        dispatch(setPokemonFilterContent(inputRef.current.value));
        if(typeRef.current.value == 'pokemon') {
            dispatch(applyPokemonFilter());
        } else if(typeRef.current.value == 'ability') {
            dispatch(applyAbilityFilter());
        }
    }

    const handleRemoveSkill = (skillName) => {
        dispatch(removePokemonFilterAbility(skillName))
    }

    const handleSwitchInputs = () => {
        inputRef.current.value = typeRef.current.value == 'pokemon' ? pokemonFilter.content : '';
        dispatch(setAbilityFilterContent('')); 
    }

  return (
    <div className='searchBar'>
        <select defaultValue="pokemon" ref={ typeRef } onChange={handleSwitchInputs}>
            <option value="pokemon">Pokemon</option>
            <option value="ability">Ability</option>
        </select>
        <div className='searchInput'>
            <input type="text" placeholder="Search..." ref={ inputRef } onChange={ handleInputActivity } />
            { typeRef.current && typeRef.current.value == 'ability' ? 
                ((inputRef.current.value != '') && <AbilitySearch/>)
                : null }
        </div>
        <button onClick={ handleClearFilter }>x</button>
        <button onClick={ handleForceSearch }>Search</button>
        <div className='abilitiesSelected'>
            <div className='abilitiesSelectedContainer'>
                {
                    pokemonFilter.abilities &&
                        pokemonFilter.abilities.length > 0 &&
                            pokemonFilter.abilities.map((ability, i) =>
                                <button key={i + ability.name} onClick={e => handleRemoveSkill(ability.name)}>{ability.name}</button>)
                }
            </div>
        </div>

    </div>
  )
}
