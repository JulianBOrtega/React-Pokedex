import React from 'react'
import { PokemonGallery } from '../components/PokemonGallery'
import { Searchbar } from '../components/Searchbar'
import './home.css';

export const Home = () => {
  return (
    <div className='homePage'>
      <br />{/* Los br sirven, te gusten o no */}<br />
      <Searchbar/>
      <PokemonGallery/>
      <a href='#' className='goUp'>↑</a>
    </div>
  )
}
