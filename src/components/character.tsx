import { DisneyCharacter } from "../disney_character"

interface CharacterProps{
	character: DisneyCharacter;
	characterFavourites: Array<number>;
	updateFavourites: (favourites: Array<number>) => void;
}

// for our props we can reuse the DisneyCharacter interface
// - defining an anonymous type that just has one property - a DisneyCharacter
const Character : React.FC<CharacterProps> = ( { character, characterFavourites, updateFavourites }) => {

  function toggleFavouriteForCharacter(characterId : number) {
    if(!characterFavourites.includes(characterId)) {
        // add to favourites
        updateFavourites([...characterFavourites, characterId]);
    }
    else {
      // remove from favourites
      const updatedFavourites = characterFavourites.filter((id) => id !== characterId);
      updateFavourites(updatedFavourites);
    }
  }

  return (
    <article className="character-item">

      <h2>{character.name}</h2>

      <div className="character-item__actions" onClick={() => toggleFavouriteForCharacter(character._id)}>
        Add to Favourites
      </div>

      <img className="character-item__img" src={character.imageUrl} alt={character.name} />

    </article>
  )
}

  


export default Character