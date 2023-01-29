# Activity 6 - Extension exercise

## Showing the favourites

🤔 Did you spot that **Show Favourites** button? Give it a click. Notice it doesn't do anything at the moment?

🦸‍♂️ Your challenge is to implement the user story below

```
As a user I want to be able to toggle between seeing my favourite Disney characters and the entire list.
```

#### Acceptance criteria

- When the "Show Favourites" button is clicked, the UI should show only the favourite characters that the user has chosen
- The UI should show favourite characters irrespective of which page of the API they appear on
- The "Show Favourites" button should be updated to say "Show All" after being clicked
- When the user clicks "Show All" it should revert back to showing page 1 of ALL the Disney characters

## Hints and tips

💡 It might be worth attempting in a TDD manner with React Testing Library

💡 Currently when you add a favourite it only includes the character ID. Maybe you'll need to change that approach.

💡 You might need to change the remove from favourites function if you do change the way the favourites are tracked in state.
