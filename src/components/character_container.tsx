import React from 'react';
import { DisneyCharacter } from '../disney_character';
import Character from './character';

interface CharacterContainerProps{
	characters: Array<DisneyCharacter>;
	characterFavourites: Array<number>;
	updateFavourites: (favourites: Array<number>) => void;
}

// for our props we can reuse the DisneyCharacter interface
// - defining an anonymous type that just has one property - an array of DisneyCharacter
const CharacterContainer : React.FC<CharacterContainerProps> = ( { characters, characterFavourites, updateFavourites }) => {

	// this function separates our array of DisneyCharacters into rows and columns
    const buildRows = () => {
        
		// we'll need arrays to store the rows and cols in, and they will be of type JSX.Element
		let rows : Array<JSX.Element> = [], cols : Array<JSX.Element> = [];
        
		characters.forEach((character, index) => {
            cols.push(
                <Character key={character._id}
                            character={character}
                            characterFavourites={characterFavourites}
                            updateFavourites={updateFavourites}
                />
            );
            if ((index + 1) % 5 === 0) {
                rows.push(
                    <div className="character-row" key={index}>
                        {cols}
                    </div>
                )
                cols = []
            }
        });

        // Final remaining columns
        if (cols.length > 0) {
            rows.push(
                <div className="character-row" key={characters.length}>
                    {cols}
                </div>
            )
        }

        return rows;
    }

    return (
        <div className="character-container">
            {buildRows()}
        </div>
    )
}

export default CharacterContainer;