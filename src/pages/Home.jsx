import React from 'react'
import { PokemonGallery } from '../components/PokemonGallery'
import { Searchbar } from '../components/Searchbar'
export const Home = () => {
  return (
    <div>
      <br />{/* Los br sirven, te gusten o no */}<br />
      <Searchbar/>
      <PokemonGallery/>
    </div>
  )
}
