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
Most of the problem solving I did on the UI was changing parts to bootstrap so
it would be more responsive to different screen sizes.

After the basic local gameplay was done I fully tested it for defects and opened
up a second branch to move onto multiplayer. This was done so if multiplayer
went very badly I could always fallback on the local play only game version.

I got multiplayer to work after a bit of a struggle that was largely because
instead of rescoping and seperating the local code from the online, I smashed
them together. Lesson learned there.

The majoritory of problem solving around multiplayer was understanding how data
was passed around by the api, and learning how the watcher worked. I took notes
on paper following the flow of my code, and documenting when and where the
watcher would react and send data across the server. Doing that not only allowed
me to arrive at the solution but additionaly showed me code flow issues.

I heavily used google/stackoverflow/js documentation throughout the project to
help with asynchronus issues as well which are common aspecially when working
with multiplayer.

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
