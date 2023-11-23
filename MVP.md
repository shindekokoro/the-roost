MVP

event system
 - combat events
    - scaled on the front end based on user stats
    - attack, defend, run (movement)
 - movement events
    - possible actions come down from event, nested in single movement icon
 - interaction events
    - two options for mvp, interact and don't interact (run, movement icon)
 - event rewards are calculated on the front end

character 
 - xp system, leveling skills
 - items

enemies
 - skills
 - items
 
tailwind setup, eventually
add and delete users
leaderboard 
enforced unique accounts names

SEVER SYNC
 - handshake with the server, db has a version number
 - client has its version number
 - if diff server has been updated with new events, etc (or client doesn't have a version number as well)
 - get all the game data, save to local storage, save new version number
 - local storage:
   - version number
   - combat events
   - movement events
   - interaction event
   - current game context (this allows you to resume a game, or refresh and not loose your current event)

GAME LOGIC
 - game loop
   - random shop event (interaction event)
      - random items based on stats
      - could also be based on gold you have
 - character modification
   - event rewards
      - gold drops
      - could also drop gear
   - xp gain
      - events xp rewards scale with character
      - show xp number on event completion
   - leveling
      - exponential level breakpoint
   - equipment
      - item interactions (stat boosts)
      - equip/unequip 
      - item drops/gold drops scale with character level
 - death handling 
 - enemies
   - scale with character level

END FEATURE CREEP

-------------------------------------------------------------------

PHASE 1
INITIAL SCAFFOLDING
 - [x] react app, vite - ready for dev
 - [x] express server boilerplate - serve a temp home page, connect to db and display something
 - [x] mongodb setup with mongoose - boiler plate, so we are ready to expand features
 - [x] graphql interface for account creation
 - [x] accounts in db, bcrypt 
 - [x] jwt for sessions

-------------------------------------------------------------------

PHASE 2

FRONT END
 - [x] mui 
 - [x] clean up front end folders 

BACK END
 - [x] Events object shape
 - [x] character object shape
 - [x] mongoose models
 - [x] graphql queries
    - [x] event query
    - [x] character query
 - [x] graphql mutations
    - [x] update character

-------------------------------------------------------------------

PHASE 3

BACK END
 - [x] graphql resolvers

GAMEPLAY
 - [] Seeds (images, etc)
    - [] sample movement events 
    - [] sample combat events 
    - [] sample interaction events 

FRONT END
 - [] persistent top nav, options vary based page or signed in status
 - [] landing page (call to action: signup, play today!)
   - [] when signed in options: start game, profile, leaderboard
 - [x] login / signup
 - [x] logout
 - [] profile (show your character)
   - [] component that queries "me"
   - [] start game button
 - [?] any authentication errors redirect to login/signup (This should be done, display's an error inline)

-------------------------------------------------------------------

PHASE 4

GAMEPLAY
 - [] get the game version
   - [] see if client needs to update
   - [] get all events to client
      - [] save events to local storage
 - [] get character data
   - [] save character to local storage
 - [] show character data on the profile page
