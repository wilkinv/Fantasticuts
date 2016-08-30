# Fantasticuts

Installation Guide:

This installation guide is for Mac users, though it should be similar for Windows users.

To start off you need to have git already installed. If you do not then a simple google search on how to install git will provide the information that you need to install it.

In the terminal, go to the directory you want to clone the repository and then type "git clone https://github.gatech.edu/kwoumn3/Fantasticuts.git" or "https://github.com/wilkinv/Fantasticuts.git" to download the source files.

Make sure you have nodejs installed. If not, install homebrew by going to http://brew.sh and following the instructions. Then type "brew install node" in the terminal to install node.

You need to install ionic, gulp, and cordova if you have not. You can do this by typing "npm install -g gulp","sudo install -g cordova", and "sudo npm install -g ionic".

Open two terminals and navigate one to the client folder then navigate the other one to the server folder.

Type "npm install" in the server folder. Type "npm install" in the client folder.

In the server folder type in "node server.js" for one terminal.

In the client folder type in "ionic serve --lab" for the other terminal.

At this point, you can start testing the application.

____________________________________________________________________________________
************************************************************************************
____________________________________________________________________________________

User's Manual/Help:

In the first page, login with your creditials or register a new user if you don't have one.

Once you are logged in, you are in the members area. You can look up stylists, view appointments, or log out. If this is your first time, you will probably want to go to find stylists.

In the find stylists page you can select the dropdown menues to pick your filters to find the right stylist.

Once you are at the list of stylists page, you can just select a stylist or go to the map button and view them on the map.

In the google maps page you tap the markers to go to a page where it lists the stylist's information. 

In the stylist's information page, you can set up an appointment.

Once you set a few appointments, you can go back to the main page and view your appointments.

Where it lists the appointments, you can tap to view the appointment information or swipe left to have the option to delete the appointment.

Depending on the computer you use, the server can crash when you hit the find stylists button. If you type "node server.js" in the server folder again, the application should work again.

____________________________________________________________________________________
************************************************************************************
____________________________________________________________________________________

Release Notes:

New Features:
- Appointments can now be set with barber stylists
- Appointments can be viewed and deleted by the user
- Stylists can be viewed on google maps so user has a better sense of location
- The stylists are sorted from closest to furthest
- Google maps view now starts at your location
- Eliminated CORS issue

Bugs:
- Server crashes when tapping find stylists button depending on computer
- Setting appointment does not restrict words (did not have time to implement calendar)
- Potentially a lot of scrolling if there are a lot of stylists or appointments


