import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { removeSelection, clearSelection, deselectPokemon } from '../features/pokemon/pokemonSlice';
import 'reset-css';
import './navbar.css'

export const Navbar = () => {
  const [hoveredPokemon, setHoveredPokemon] = useState(null);
  const detail = useSelector(state => state.pokemon.detailLoaded)
  const selection = useSelector(state => state.pokemon.selection)
  const dispatch = useDispatch();

  return (
    <div className='navbar'>
      <div className='leftMenu'>
        <p>Selection</p>
        <p>[</p>
        <div className='selection'>
          {
            selection.map((pokemon, i) => {
              if(detail[pokemon] != undefined)  
                return <img key={pokemon + i} className='sprite'
                  src={ hoveredPokemon == pokemon ? detail[pokemon].sprites.front_default
                  : detail[pokemon].sprites.back_default } 
                  alt="pokemon-sprite" 
                  onClick={() => dispatch(deselectPokemon(pokemon))}
                  onMouseEnter={() => setHoveredPokemon(pokemon)}
                  onMouseLeave={() => setHoveredPokemon(null)}
                  />
            })
          }
        </div>
        <p>]</p>
      </div>

      <div className='rightMenu'>
        <button onClick={() => dispatch(clearSelection())}>Clear selection</button>
        <button onClick={() => dispatch(removeSelection())}>Delete</button>
      </div>
    </div>
  )
}
