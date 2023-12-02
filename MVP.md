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
 - [x] Sample Seeds (images, etc)
    - [x] sample movement events 
    - [x] sample combat events 
    - [x] sample interaction events 

FRONT END
 - [x] persistent top nav, options vary based page or signed in status
 - [x] login / signup
 - [x] logout
 - [x] profile (show your character stats)
   - [x] component that queries "me"
 - [x] any authentication errors redirect to login/signup

-------------------------------------------------------------------

PHASE 4

CLIENT
 - [x] get all events to client
   - [x] save events to local storage
 - [x] get character data (comes down with the user object)
   - [x] save character to local storage
 - [x] start game button
 - [x] game component (parent of all game related components)
   - [x] get all event to local storage (pass -> children)
   - [x] get character 
   - [x] save character 
   - [x] working movement/interaction events
   - [] working combat events
   - [] finalize combat event logic



-------------------------------------------------------------------

POLISH
 - [] landing page (call to action: signup, play today!)
