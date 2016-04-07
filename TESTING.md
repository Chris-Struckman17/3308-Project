Part 3 - Testing

Who: Victoria Velasquez (torivelasquez), Chris Struckman (Chris-Struckman17), John Welch (Jinjirow), Zach Brimlow (zbrimlow)

Title: LitCloud

Vision: "Music Made Better" Our website is a modification of the Soundcloud api that makes listening to music easier. Queuing songs is now possible to form temporary playlists with ease.

Automated Test: 
  Tool Used: Mocha-chai
  Link: https://mochajs.org/
  We made a test file "test.js" where we created a case to test if our authentication popup actually alerts the client when they sign in. Using this framework, we passed the test that we created with the screenshot shown.

User Acceptance Test:
Test 1: Authentication
1.) Procedure: Click on the "Connect" button, then sign in with your SoundCloud credentials.
2.) Expected Outcome: A Popup window with a SoundCloud sign-in page should appear, the window should then close and an alert window will open greeting the user.

Test 2: 
1.) Procedure: Click on the "Stream" page tab
2.) Expected Outcome: An Embedded audio player should pop up, the player's controls should be fully functional.

Test 3:
1.) Procedure: Login and click on the plus icon under the audio player
2.) Expected Outcome: An alert should appear displaying your user id (not an actual feature for the website but useful if you need your user id #)
-
