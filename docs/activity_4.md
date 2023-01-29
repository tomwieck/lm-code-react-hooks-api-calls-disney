# Activity 4 - Favouriting Characters

## Collecting favourites 😍

Notice the bit of text on each of the character cards that says **Add to favourites**. At the moment when you click that bit of text it doesn't seem to do anything.

Your task in this activity is to make sure that characters can be added to a list of favourites when users click that text.

If the character has been favourited then the text should be updated to say **Favourited** instead of **Add to favourites**

## State to track favourites

Favouriting a character is yet another example of **_state_** that our app needs to track. Flipping from 'not favourited' to 'favourited' is a change of state for a given character. So it should be no surprise that we'll use the **useState** hook again to track user favourites.

👉 Open up your **App.tsx** and introduce another piece of state to track favourites.

```TypeScript
const [characterFavourites, setCharacterFavourites] = useState<any>([]);
```

We should specify the **_type_** of our array as the generic parameter to `useState<T>` but we haven't decided what that data will look like yet. Let's put `any` for now, and then we'll come back and update it in a bit once we've figured out the data type.

❗ `any` might be useful during development as it "stops TypeScript complaining" but using it as a crutch will inevitably lead to disaster. It's _much better_ to define the type at the moment you add it - even if you have to go back and change it later!

## Passing props down to components

In order to add the character to the list of favourites or know whether the character is already favourited we'll need both the **characterFavourites** array and the **setCharacterFavourites** function. These are defined in **App.tsx** so we need to pass them down as **props**, firstly through to the [CharacterContainer](../src/components/character_container.tsx) and then on to the [Character](../src/components/character.tsx) component.

👉 Update the JSX where the **CharacterContainer** is utilised in **App.tsx** to pass in the props.

```JSX
// character_container.tsx
<CharacterContainer characters={characters}
                    characterFavourites={characterFavourites}
                    updateFavourites={setCharacterFavourites}  />
```

TypeScript will correctly complain that it doesn't know what these props are, so we'd better pop over to **_character_container.tsx_** and update it.

👉 Look at the props of `<CharacterContainer>`. Right now we're defining an anonymous type, which we could easily extend by adding the two new properties... but it's starting to feel like things might be cleaner if we add an `interface` instead:

```TypeScript
// character_container.tsx
interface CharacterContainerProps{
	characters: Array<DisneyCharacter>;
	characterFavourites: Array<any>;
	updateFavourites: (favourites: Array<any>) => void;
}

// notice we're updating the props destructuring to access the two new props too:
const CharacterContainer : React.FC<CharacterContainerProps> = ( { characters, characterFavourites, updateFavourites }) => {
	// rest of file here...
```

See how those `any`s are starting to multiply..? Because we never defined the type before we're having to put `any` twice here too! This is why we ought to be suspicious whenever we add a single `any` - before you know it it'll spread across your codebase and you'll have turned off all the useful features of TypeScript.

Let's fix that now!

🤔 Thinking about it, we can simply use the character `id` as a signifier that it has been favourited, so we don't need a complex type - a list of ids will do the job. In other words, those three references we just added to `Array<any>` should be `Array<number>`.

👉 In `App.tsx` change `Array<any>` to `Array<number>` for the `useState` call of our favourites array.

👉 In `character_container.tsx` change `Array<any>` to `Array<number>` in the props interface for our two new props.

So you've defined two props called **characterFavourites** and **updateFavourites**. They provide the current state of character favourites along with a function to update the favourites.

👉 Now open up the [CharacterContainer](../src/components/character_container.tsx) component and we need to make sure we pass those props on to each individual **Character** component.

You'll see this line of code:

```JSX
cols.push(<Character key={character._id} character={character} />);
```

That is where the **Character** component is defined and utilised. Let's update that to pass on the props.

👉 Update the line to read

```JSX
cols.push(
    <Character key={character._id}
                character={character}
                characterFavourites={characterFavourites}
                updateFavourites={updateFavourites}
    />
);
```

Ahhhh! Now we need to update the `Character` props too to accept our new props.

In `character.tsx` we're also using an anonymous type. Time to make it an interface.

👉 Extract the anonymous type from the `Character` props definition in `character.tsx` and create an interface with the three required props. Try it yourself before checking the below code!

```JSX
// character.tsx
interface CharacterProps{
	character: DisneyCharacter;
	characterFavourites: Array<number>;
	updateFavourites: (favourites: Array<number>) => void;
}

// notice we're updating the props destructuring to access the two new props too:
const Character : React.FC<CharacterProps> = ( { character, characterFavourites, updateFavourites }) =>
```

## Adding to favourites

Let's recap what you've done.

- Created an array and corresponding function for storing and managing favourites that will be stored in state
- Passed that array and function down from the `App` component to the `CharacterContainer` component as a prop
- Passed that array from the `CharacterContainer` component to the `Character` component as a prop

Now we can add favourites from the **Character** component where the **Add to favourites** text is located.

👉 In the [Character](../src/components/character.tsx) component we're using an implicit return, something like:

```JSX
const Component : React.FC = () => <SomeJSX></SomeJSX>;
```

We want to add some code to this component so we need to switch to an explicit return.

👉 Wrap the JSX in `character.tsx` in a `return(<JSXGoesHere/>)` statement. Then wrap the return statement in curly braces {}. For the above example component, it would look like this:

```JSX
const Component : React.FC = () => { return (<SomeJSX></SomeJSX>);}
```

Now we can add a function just before the **return** statement to toggle the favourites.

```TypeScript
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
```

Have a read of that function and make sure you understand what it's doing.

💡 Top tip - Make sure to track the props through and how it is being passed through the components.

🙋🏻 Now we need to trigger that function when someone clicks the **Add to favourites** text. How can we do that?

<details>
<summary>Click here to see the answer</summary>
<pre>
Attach an onClick listener
</pre>
</details>

👉 Attach a click listener to the corresponding `div`

```JSX
<div className="character-item__actions" onClick={() => toggleFavouriteForCharacter(character._id)}>
  Add to Favourites
</div>
```

Double check the browser console - if you are having any console errors then re-review the steps before proceeding.

## Conditional rendering

Now we should be successfully adding items to favourites but visually the user doesn't get any feedback.

Let's use some [conditional rendering](https://reactjs.org/docs/conditional-rendering.html) to visually update the User Interface (UI). If the character is in favourites it will say **Favourited** otherwise it will say **Add to favourites**

👉 Update the **Add to favourites** div to read

```JSX
<div className="character-item__actions" onClick={() => toggleFavouriteForCharacter(character._id)}>
  {!characterFavourites.includes(character._id) ? "Add to Favourites" : "Favourited"}
</div>
```

👉 Now refresh your browser and try clicking on **Add to favourites**

🎉 Celebrate as your screen is updating when you add items to favourites!!

Sadly, the celebration is short-lived... we're doing quite a bit of [prop drilling](https://kentcdodds.com/blog/prop-drilling) to pass the favourites and updateFavourites down through the component tree.

Take another break, commit and push things up to GitHub and move on to [activity 5](./activity_5.md) where we'll use another React hook to remove the need for prop drilling.
