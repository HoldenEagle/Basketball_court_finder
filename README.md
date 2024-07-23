# Basketball_court_finder

As a big fan of basketball, I have always looked for places to play basketball around my area. As you grow older and move away from your hometown, sometimes the easiest way to meet new people is through playing basketball. My goal with this project was to allow users to freely search up online basketball courts around them of a certain radius in their location, or any location that they want. From there , they can see discussions people posted about this court, the type of basketball sessions that occur there, etc. They can even add their own thoughts about the place, they can rate it, and they can recommend to other people to come to this court. This way , if you are looking for basketball courts for a specific level of play, this is the site to look at. We hope that this site can add accurate reviews about the courts in a way that google maps cannot.

The frontend of this project is made using React, CSS, Javascript, and HTML. I am also using placesApi and MapsApi from the Google Cloud Console for the map information. The information on the courts as well as the users is going to be stored on dynamoDb databases using AWS. I also hope to implement the queries to these databases to be concurrent or implement some sort of method to prevent bottleneck issues from occuring. Will likely use Node.js for the backend server.

To run this Repo.
1. Clone the repo into your folder using git clone
2. cd into the folder
Currently this project is still a work in progress. This is how the front end server can be started. Will cover the backend server along with everything else when I start that
4. Install the project dependecies specified in package.json with npm install
5. To build the application for production -> npm run build
6. To test the application on a local host -> npm start , go to http://localhost:3000 on your console to see it.

