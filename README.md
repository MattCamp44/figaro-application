# Figaro code
Code repository for the Figaro project (HCI 2020)

## Build the app

### Start server

* npm install
* npm run watch

### Start frontend

* cd client
* npm install
* npm start


## Website

Visit the [website](https://figaro-app.herokuapp.com/) for a faster access to the application


## Notes
The application is meant to be used on a smartphone/tablet. Although it can be of course accessed on a desktop, it might present some positioning flaws, based on the screen resolution.
At this point of the development, some open issues still need to be fixed. The most relevant ones are

* Safari compatibility: this was noticed late in the development (during a user testing) and it is related to the different ways of this browser to expose the audio context features. At the day of the delivery, we are able to open the stream but the application will crash on the first reproduced note
* Input/output interference: our application provides a speaker feedback to the user while he/she is singing the requested note. This feature was designed since the  first phases of the project and we believe that it's a strenght of this application (trivially, an inexperienced user can still play the exercise by just listening to the note, without having to know the proposed note convention). Unfortunatelly, we found out that if the device speaker volume is set above a certain threshold, the emitted note will be recognized also as input to the application, with the consequence of a 100% score at the end. Reducing the volume or making use of headphones will solve the problem
