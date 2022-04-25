# Activity 5 - Avoid Prop Drilling with useContext

## Prop drilling

So far you've successfully got the favourite Disney characters being tracked.

However in order to do so you have passed data and functions through the component tree. From **App** => **CharacterContainer** => **Character**

For this size of application that might actually be a totally valid way to approach things.

However for a large application with hundreds of components then passing items through the component tree might cause challenges further down the line.

Let's think about sharing state between components. There are a number of cases where "global" state is useful in every component such as:

* Application theme (EG. Dark mode or light mode)
* User profile information

In those cases it might be useful for EVERY component to have access to that state in order to take actions.

Then there are cases where state needs to be shared by some component trees, such as:

* Specific page states
* Product pages that need to share state for a specific product

With React we can use the [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) hook to create state which can be accessed by a component tree. If we put this context at our App level then we have effectively created global state: state that is available globally to ALL components, i.e. the entire tree. And if we put it at a 'lower' level then we've got state that is shared between a smaller tree of components.

Since our app is *entirely* based around favouriting Disney characters it seems appropriate to place our favourites data context at the App level and make it global. However, in larger apps we should consider the correct place for our contexts to sit. 

💡 The golden rule is that we should wrap our contexts around the smallest possible tree of components that need access to the context data. For example, if we had an "FAQ" page it wouldn't need to access any product data, so any `ProductContext` should not be global, but should just wrap the Product pages.

## Creating the context

In order to do this we'll need to firstly create the context. The context will then wrap all your components.

👉 In your [App.tsx](../src/App.tsx) lets create the context. After the imports but before you declare the `const App : React.FC = // etc` introduce the creation of the context. As usual, we'll need to define a type for our context - let's create a new interface called `IFavouritesContext` to hold this type:

```JSX
export const FavouritesContext = React.createContext<number[]>( []);
```

## Providing the context

Now you're going to "provide" that context to all the child components. The way we do this in React is to wrap child components in the [context provider](https://reactjs.org/docs/context.html#contextprovider).

👉 Again, in your [App.tsx](../src/App.tsx) wrap the JSX elements in the **FavouritesContext**. Update the return statement so that it looks like the following:

```JSX
return (
    <FavouritesContext.Provider value={characterFavourites}>
      <div className="page">
        <Header currentPage={currentPage} />
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <CharacterContainer characters={characters} characterFavourites={characterFavourites} updateFavourites={setCharacterFavourites}  />
      </div>
    </FavouritesContext.Provider>
);
```

Notice we wrap all components in a new JSX tag which is your **FavouritesContext.Provider**. Also crucially notice the **value** prop. For context providers the prop is ALWAYS called **value**. The value we are specifying is the array of **characterFavourites**

(Again, this could be a complex type - for now we're just using a `number[]`)

You might be thinking...Hmmm but thats just the data, what about being able to update the favourites from anywhere?! We'll come on to that later 🙌

Now we've wrapped all components with the context we can remove the **characterFavourites** prop from our component tree.

👉 Update the return statement in the App.tsx to remove the **characterFavourites** prop 

```JSX
return (
    <FavouritesContext.Provider value={characterFavourites}>
      <div className="page">
        <Header currentPage={currentPage} />
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <CharacterContainer characters={characters} updateFavourites={setCharacterFavourites}  />
      </div>
    </FavouritesContext.Provider>
  );
```

👉 Open up your [CharacterContainer](../src/components/character_container.js) and we can remove the **characterFavourites** prop from there also. In order to do this we firstly remove it from the interface:

```JSX
interface CharacterContainerProps{ 
	characters: Array<DisneyCharacter>;	
	// removed characterFavourites
	updateFavourites: (favourites: Array<number>) => void;
}

```

This will immediately break everything! We have to remove the prop we're passing to CharacterContainer, the prop we're passing to `Character`, make the same change to the interface in `Character`, and so on...

```JSX
// character_container.jsx

interface CharacterContainerProps{ 
	characters: Array<DisneyCharacter>;	
	updateFavourites: (favourites: Array<number>) => void;
}

const CharacterContainer : React.FC<CharacterContainerProps> = ( { characters, updateFavourites }) => {

	// this function separates our array of DisneyCharacters into rows and columns
    const buildRows = () => {
        
		// we'll need arrays to store the rows and cols in, and they will be of type JSX.Element
		let rows : Array<JSX.Element> = [], cols : Array<JSX.Element> = [];
        
		characters.forEach((character, index) => {
            cols.push(<Character key={character._id} character={character} 
                updateFavourites={updateFavourites} />);

// rest of file...

```

```JSX
// character.tsx

interface CharacterProps{
	character: DisneyCharacter;	
	updateFavourites: (favourites: Array<number>) => void;
}

const Character : React.FC<CharacterProps> = ( { character, updateFavourites }) => {
	// rest of file...
```

It's still broken, because we need to consume the context.

## Consuming the context

Finally we need to update the **Character** component to consume the context. This is where the **useContext** hook comes in to action.

Now you need to import the React **useContext** hook and utilise it. At the same time we'll also import that **FavouritesContext** that you declared in the **App.tsx**

👉 Introduce the import at the top of your **Character** component

```TypeScript
import React, { useContext } from 'react';
import { FavouritesContext } from '../App';
```

Now let's make use of the **useContext** hook, telling it which context to use in order to get access at the context.

👉 Immediately after defining the **Character** function introduce the following line:

```TypeScript
const characterFavourites = useContext(FavouritesContext);
```

👉 You've done it!! Try stopping and starting the application (just in case) and try favouriting some characters 🙌 You've just replaced that prop with some state accessed via the **useContext** hook.

No longer do we have to pass the prop through three different files - we just define it in `App.tsx` and consume it in `character.tsx`. The middle file doesn't know anything about `characterFavourites` - which is good, as it never needed to! It was just a middleman. (Or middle-component.)

👉 We covered a lot of ground there so if you need to check any syntax before continuing on, we've provided each of the components in the notes at the bottom of this page.

👉 Git commit and push up your changes and take a celebratory drink.

But wait....there's more! What about that **updateFavourites** method? We're still passing that down as a prop - could we allow that to be in the context also?

👉 Have a watch of this video (13 mins):

[https://www.youtube.com/watch?v=5LrDIWkK_Bc](https://www.youtube.com/watch?v=5LrDIWkK_Bc)

👉 Try to take the approaches discussed in order to change how you utilise the context hook and implement the **updateFavourites** in a manner you can access via the context.

👉 If you get this far make sure to git commit and push. Then for those wanting more learning why not try [activity 6](./activity_6.md)!!


## Sample code files

#### App.tsx

```JSX

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

```

#### CharacterContainer.js

```JSX
import React from 'react';
import { DisneyCharacter } from '../disney_character';
import Character from './character';

interface CharacterContainerProps{ 
	characters: Array<DisneyCharacter>;	
	updateFavourites: (favourites: Array<number>) => void;
}

const CharacterContainer : React.FC<CharacterContainerProps> = ( { characters, updateFavourites }) => {

	// this function separates our array of DisneyCharacters into rows and columns
    const buildRows = () => {
        
		// we'll need arrays to store the rows and cols in, and they will be of type JSX.Element
		let rows : Array<JSX.Element> = [], cols : Array<JSX.Element> = [];
        
		characters.forEach((character, index) => {
            cols.push(<Character key={character._id} character={character} 
                updateFavourites={updateFavourites} />);
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
```

#### Character.tsx

```JSX
import { DisneyCharacter } from "../disney_character"
import React, { useContext } from 'react';
import { FavouritesContext } from '../App';

interface CharacterProps{
	character: DisneyCharacter;	
	updateFavourites: (favourites: Array<number>) => void;
}

const Character : React.FC<CharacterProps> = ( { character, updateFavourites }) => {

	const characterFavourites = useContext(FavouritesContext);

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
  
    return(<article className="character-item">

      <h2>{character.name}</h2>

      <div className="character-item__actions"  onClick={() => toggleFavouriteForCharacter(character._id)}>
	  	{!characterFavourites.includes(character._id) ? "Add to Favourites" : "Favourited"}
      </div>

      <img className="character-item__img" src={character.imageUrl} alt={character.name} />

    </article>);
}


export default Character;
```

Congratulations for making it this far! 🙌 🔥


You can put your feet up and relax, you deserve it! However, the learning never stops 😅 

If you feel like another challenge... an extension activity can be found here: [Extension](./activity_6.md). You can do it! 🙌 💪 🧠
