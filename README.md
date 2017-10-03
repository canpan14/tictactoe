# Tic-Tac-Toe
By Sam Machlin

Link to game: https://canpan14.github.io/tictactoe/

## Technologies Used
Technologies Used:
- HTML/CSS
- Javascript
- Webpack
- Bootstrap

## Planning
Initial planning was mostly around local single player.
The idea was to make a very simple UI and focus on the game logic/functionality over the look.

## Development and Problem Solving
Outside of small notification additionals, the UI mostly didn't change since day 1.
After the basic local gameplay was done I moved onto multiplayer.
That's when things went downhill.
I got multiplayer to work but the code became much more hacky than I would like.
Small issues and less than idea design decisions made in the early planning for just local play became road blocks.
Also there were a number of instances of reusing code written for local play for multiplayer.
That became an issue because any change made to multiplayer cause the need for a full retest of local play.

## Future Versions
Biggest changes I would make in future iterations would really be entire overhalls of the event -> controller/ui process.
Also numerous areas where code should be encapsulated and more reusable.
Knowing I was going to get this far in the project I should have planned out the code design with multiplayer in mind from the beginning.

## Wireframes
Wireframes: https://imgur.com/a/cDV0p

## User Stories
- User can sign in
- User can sign out
- User can change password
- User can play the game against another player online
- User can play the game while signed in
- Game ends when a user has won/drawn (clicks no longer do anything to the game)
- Game can be reset without refreshing the page
