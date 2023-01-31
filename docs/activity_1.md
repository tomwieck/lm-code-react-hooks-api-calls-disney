# Activity 1 - Introducing the Disney API 🧚‍♀️

## Introduction

In the [App.tsx](../src/App.tsx) on lines 14 to 30 the code declares an array of characters and puts them in to state, as an `Array<DisneyCharacter>`.

In fact that is where you encounter your first React Hook [useState](https://beta.reactjs.org/reference/react/useState).

We'll use the `useState` hook to persist our array of characters, which is currently [hard coded](https://en.wikipedia.org/wiki/Hard_coding). As a result of our hard coding, if Disney create a new film then the application wouldn't reflect the new character until you updated the hard coded character array. Also, if you later updated the hard coded characters then it would mean you would have to re-deploy the application in order to see them on your application. 😱

In short, hard coding might be useful as a way of quickly developing a component, but in a real application we want to replace hard coding with smarter data access.

In this first activity we're going to replace this hard coded data by utilising an API to get a list of Disney characters 🙌

## The Disney API

The API we shall utilise is a community-provided Disney API.

[https://disneyapi.dev/](https://disneyapi.dev/)

👉 Have a browse of the API website and use your recent API practice to explore the endpoints using `Postman` or your browser.

🙋🏽‍♀️ Which endpoint do you think we can use for getting all the characters?

<details>
<summary>Click here to see the answer</summary>
<pre>
https://api.disneyapi.dev/characters
</pre>
</details>

As well as the endpoint, we also need to know which [Request Method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) (or sometimes called HTTP Verb) to utilise for making our request to the API.

🙋🏻 Which request method should you utilise to get a list of characters?

<details>
<summary>Click here to see the answer</summary>
<pre>
GET
</pre>
</details>

## Making HTTP Requests

So we know that we need to send a **GET** request to the **https://api.disneyapi.dev/characters** API endpoint. Let's set about doing that now 🙌

Firstly we need to write some code to execute the **GET** request.

Within JavaScript there are lots of [different ways of making an API call](https://levelup.gitconnected.com/all-possible-ways-of-making-an-api-call-in-plain-javascript-c0dee3c11b8b). Some popular ones are:

- [Axios](https://www.npmjs.com/package/axios)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

`Fetch` is built into modern browsers and is a good go-to for making any kind of HTTP request. For this assignment we'll make use of fetch.

## Utilising fetch and useEffect to call the API

Fetch allows us to write API calls in a succinct way.

For example if we wanted to send a **GET** request to the studio Ghibli API to get all the `people` we could write something like this:

```
fetch('https://ghibliapi.herokuapp.com/people')
.then(function (response) {
    // handle success
    console.log(response.data);
})
.catch(function (error) {
    // handle error
    console.log(error);
});
```

❗❗❗ Notice the use of promise handling! Let's take a moment to _understand_ this code before we move on.

The `fetch` function returns a `Promise` object. Promises are JavaScript's way of managing the fact that some operations take an unknown amount of time. Rather than stopping the whole app while we wait, we can "promise" that eventually this operation will complete.

When the Promise completes, it will either be successful, or it'll fail.

If the promise is successful, then the `.then` function will be called with the result. If it fails with an error of any kind, then instead the `.catch` function will be called with the error.

This is an extremely common pattern in modern JavaScript:

```JavaScript
 someFunctionThatReturnsAPromise().then(successHandlingFunction).catch(errorHandlingFunction)
```

👉 Are you happy with promise syntax? It's fundamental, so make sure you understand it - and don't be afraid to reach out if you're confused!

---

There is an alternative _even more modern_ method of resolving promises. It's known as [async/await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await).

Here is an example of the same code from above with the async/await approach:

```JavaScript
const getPeople = async () => {
    const response = await fetch('https://ghibliapi.herokuapp.com/people')
    const json = await response.json(); // this extracts the json from the response
    return json;
}
```

This `async/await` style tends to lead to cleaner code.

❗❗❗ Spend a moment internalising the idea that `async/await` and `Promise().then()` do the **_same job_** using **_different syntax_** - at heart, they're both simply ways of resolving Promises.

We'll make use of the `async/await` approach for calling the Disney API.

## Calling the API

We need to decide when to invoke calling the API.

This is where the next React hook can help us. We'll make use of [useEffect](https://beta.reactjs.org/reference/react/useEffect)

With the **useEffect** hook we make use of the concept of ["side effects"](https://dmitripavlutin.com/react-useeffect-explanation/). In this case, when the component loads we want a side effect of fetching the Disney character data from the API.

👉 First, in **App.tsx** let's change the default state of characters to be an empty array

```TypeScript
const [characters, setCharacters] = useState<Array<DisneyCharacter>>([]);
```

Now we can introduce the **useEffect** hook.

👉 Import the `useEffect` hook in `App.tsx` from React.

```TypeScript
import React, { useState, useEffect } from 'react';
```

👉 After the various pieces of state have been declared (but before the component returns) introduce the `useEffect` hook

```TypeScript
useEffect(() => {
    console.log("useEffect triggered");
}, []);
```

👉 This simply prints a line to the console.

👉 Try stopping your application and restarting it with the browser console open. Did you see it print out "useEffect triggered"?

You should see something similar to the screenshot below

![Console log use effect](./images/use_effect_triggered.png "Console log use effect")

Great stuff! We're successfully "hooking" into the component loading.

🤔 But why does this hook only trigger on the components first load?

<details>
<summary>Click here to see the answer</summary>
<pre>
💡 We're passing in an empty array of dependencies to `useEffect` - basically saying to React "run this function every time this empty array changes", which only happens the first time, when it 'changes' from "nothing" to "the empty array", which then never changes again.
</pre>
</details>

Now let's update the contents of that hook to fetch the characters from the API instead of console logging.

👉 Underneath where your various state is declared create a `getCharacters` function

```TypeScript
const getCharacters = async (pageNumber : number) => {
  const apiResponse = await fetch(`http://api.disneyapi.dev/characters?page=${pageNumber}`);
  const json = await apiResponse.json() as { data: DisneyCharacter[] };
		setCharacters(json.data);
};
```

Notice how this method is marked **async** meaning we can utilise the **await** keyword within it. We firstly call the API, providing a **pageNumber** which is passed in as an argument. We then use the **setCharacters** function that is provided by **useState** to set the list of characters.

With Fetch all HTTP requests will return **response**. Here we assign that **response** to the variable called **apiResponse**.

The **response** has a number of properties one of which is the json method, which also returns a promise. 

If you go back to check the Disney API, notice that the response of the API call is a JSON object that has a property called **data**. That is why we annotate the json response `as { data: DisneyCharacter[] };`. This is to match the shape of the json that is returned from this specific API. 

👉 Finally let's call that **getCharacters** function from within your **useEffect** hook. Update the **useEffect** method to look like the following

```TypeScript
useEffect(() => {
  getCharacters(1);
}, []);
```

👉 Stop and start you application (you probably actually don't need to stop and start but it might be worth it just in case there are any errors). You should see a lovely list of Disney characters...

❓ Are the images failing to appear?? If so, don't worry, we'll figure that out in the next activity!

🎉 Either way, bask in the glory of introducing your first API call.

👉 Before moving on to activity 2 make sure to compile your own notes around what you have covered and by all means ask us any questions.

Moving on to [activity 2](./activity_2.md).

🙋🏻 At this point your `App.tsx` should look similar to this:

```TypeScript

import './App.css';
import React, { useState } from 'react';
import Header from './components/header';
import CharacterContainer from './components/character_container';
import Navigation from './components/navigation';
import { DisneyCharacter } from './disney_character';
import { useEffect } from 'react';

const App : React.FC = () => {

	const [currentPage, setCurrentPage] = useState<number>(1);

  // Some dummy state representing disney characters
  const [characters, setCharacters] = useState<Array<DisneyCharacter>>([

  ]);

  useEffect(() => {
	getCharacters(1);
  }, []);

const getCharacters = async (pageNumber: number) => {
		const apiResponse = await fetch(`http://api.disneyapi.dev/characters?page=${pageNumber}`);
		const json = await apiResponse.json() as { data: DisneyCharacter[] };
		setCharacters(json.data);
	};

  return (
    <div className="page">
      <Header currentPage={currentPage} />
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <CharacterContainer characters={characters} />
    </div>
  );
}

export default App;

```

Let's move on to the [second activity](./activity_2.md)
