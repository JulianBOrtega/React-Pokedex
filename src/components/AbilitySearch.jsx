import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addAbilityToPokemonFilter } from '../features/ability/abilitySlice'
import loading from '../assets/magikarp.gif'
import './abilitySearch.css';

export const AbilitySearch = () => {
    const abilityData = useSelector(state => state.ability);
    const dispatch = useDispatch();

    const handleAbilitySelection = async(e, ability) => {
        //! por alguna razón si le quito la e del parámetro aquí y en el onClick, se rompe asdasfasfd
        dispatch(addAbilityToPokemonFilter(ability));
    }

    return (
        <div className='abilitySearch'>
            <div className='container'>
            { abilityData.loadingList  ? <img src={loading} alt="Loading..." className="loadingGif" />
                : abilityData.filteredList?.slice(0, 7).map((ability, i) => 
                        <p key={ i + ability.name} className='ability' onClick={e => 
                        handleAbilitySelection(e, ability)}>{ability.name}</p>) }
            </div>
        </div>
    )
}
