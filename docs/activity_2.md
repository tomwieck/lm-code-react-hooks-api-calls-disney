# Activity 2 - Working with APIs

## The (possible) Image Issue

One of the challenges of working with APIs is that we are often not in control of the data structure or even the contents of the API response. That could be because the API is provided by a separate business or organisation (like in our case with the Disney API) or maybe the API is provided by another team within the same business.

As a result we can often find issues when testing or running applications that talk to APIs.

Often a decision must be made around where the issue should be fixed - should it be in the frontend code or should the API providers fix the issue? For the API provider, if they fix the issue for you and your requirements then they run the risk of breaking it for other teams or developers.

For example, when this assignment was initially written, many Disney Characters would return with an `imageUrl` property that wouldn't function. It turned out that the URL had extra characters at the end that wouldn't work with the `src` attribute of the `<img>` tags.

However, now it seems that many (all?) of the characters returned by the API have `imageUrl` properties that work on first load - so the original activity instructions are out-of-date because they changed their API!

Still, the original instructions do contain useful ideas. So, whether or not you're experiencing broken images, here are the instructions to fix them.

It won't hurt to implement the fix to the old issue even if you're not experiencing it, and either way it's a good idea to implement a `default` image for if there's a missing image for some other reason.

## Fixing the issue

Let's look deeper into why the images aren't loading.

If you look in the browser console you'll notice that there are lot of 404 status code errors. File not found. Similar to the image below:

![Console log 404](./images/404_image.png "Console log 404")

If we cross reference that with the component that displays characters [Character.tsx](../src/components/character.tsx) notice that it seems to be using **character.imageUrl** for the **src** of the image.

👉 Try hitting the characters endpoint with your browser and copy the path to the **imageUrl** of one of the results. It should look something like this: `https://static.wikia.nocookie.net/disney/images/6/61/Olu_main.png/revision/latest?cb=20200630025227`

That URL looks odd because it seems to reference a PNG image but then there is further path information after the **png** part such as `/revision/latest?cb=20200630025227`. This almost seems like another API for fetching images.

🤔 You take a sip of your drink and have a ponder. "I wonder if I can strip off everything after the image path and see if that loads". Essentially remove the `/revision/latest?cb=20200630025227` part of the URL.

This is also a good opportunity to think about failure scenarios - what would happen if the character didn't have an image? It would be nice to have a default image shown.

👉 Update your [Character.tsx](../src/components/character.tsx) to handle these scenarios

```TypeScript
const Character : React.FC<{ character: DisneyCharacter}> = ( { character }) => {

  // Define a default in case the character doesn't have an image
  let imageSrc = "https://picsum.photos/300/200/?blur";
  if (character.imageUrl) {
    // API seems to include extra path for images so here we strip it off to fetch raw image
    imageSrc = character.imageUrl.substring(0, character.imageUrl.indexOf('/revision'));
  }

  return (
    <article className="character-item">

      <h2>{character.name}</h2>

      <div className="character-item__actions">
        Add to Favourites
      </div>

      <img className="character-item__img" src={imageSrc} alt={character.name} />

    </article>
  )
}

export default Character;
```

Here we worked through some of the challenges you might experience when consuming an API. There are many scenarios where you have a certain portion of data or data might not be in the form you'd like it to be. Often you'll need to talk with the API provider (whether thats another team member, another team entirely or even another external organisation) in order to find the best fix for the bug.

👉 It's well worth committing and pushing to your repository before moving on to [activity 3](./activity_3.md) where we'll implement the ability to paginate through the characters.
