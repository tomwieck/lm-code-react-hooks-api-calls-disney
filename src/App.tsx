import './App.css';
import React, { useState } from 'react';
import Header from './components/header';
import CharacterContainer from './components/character_container';
import Navigation from './components/navigation';
import { DisneyCharacter } from './disney_character';
import axios from 'axios';
import { useEffect } from 'react';

export const FavouritesContext = React.createContext<number[]>( []);

const App : React.FC = () => {

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [characterFavourites, setCharacterFavourites] = useState<Array<number>>([]);

  // Some dummy state representing disney characters
  const [characters, setCharacters] = useState<Array<DisneyCharacter>>([

  ]);

  useEffect(() => {
	getCharacters(currentPage);
  }, [currentPage]);

  const getCharacters = async (pageNumber : number) => {
	// Utilised Axios for API calls
	const apiResponse = await axios.get(`http://api.disneyapi.dev/characters?page=${pageNumber}`);
	setCharacters(apiResponse.data.data);
	console.log(characters);
  };



	return (
		<FavouritesContext.Provider value={characterFavourites}>
		<div className="page">
			<Header currentPage={currentPage} />
			<Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
			<CharacterContainer characters={characters} updateFavourites={setCharacterFavourites}  />
		</div>
		</FavouritesContext.Provider>
	);

}

export default App;