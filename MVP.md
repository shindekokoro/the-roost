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
 - [] graphql queries
    - [] event query
    - [] character query
 - [] graphql mutations
    - [] update character

-------------------------------------------------------------------

PHASE 3

BACK END
 - [] graphql resolvers

GAMEPLAY
 - [] Seeds
    - [] sample movement events 
    - [] sample combat events 
    - [] sample interaction events 

