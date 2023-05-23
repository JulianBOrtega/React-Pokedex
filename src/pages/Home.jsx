import React from 'react'
import { PokemonGallery } from '../components/PokemonGallery'
import { Searchbar } from '../components/Searchbar'
export const Home = () => {
  return (
    <div>
      <Searchbar/>
      <PokemonGallery/>
    </div>
  )
}
