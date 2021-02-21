# Stepmania-Stream-Interactivity
Enables viewers to interact with your Stepmania game by redeeming channel points to enable mods. Bits can also be used to "power up" these mod activations. Also includes an integration with [Song Requests](https://github.com/DaveLinger/Stepmania-Stream-Tools).

## Setting up

### Node Environment
Create a `.env` file inside `Channel Points Monitor`. Inside the `.env`, add the following two fields:
```
TOKEN=YOUR_OAUTH_TOKEN_HERE
CHANNEL_ID=YOUR_CHANNEL_ID_HERE
SAVE_DIR=YOUR_STEPMANIA_SAVE_DIRECTORY
```
You can find your channel ID by using the Twitch API. It's a bit difficult.

For the OAuth token, you can use a website like [this](https://twitchtokengenerator.com/) to generate tokens. In the future, this
functionality will be integrated with this app along with automatic channel ID grabbing.

Navigate into `Channel Points Monitor` and run `npm i` to install the required node modules.

### Stepmania Environment
Navigate to `Stepmania/Themes/YOUR_THEME/BGAnimations`. If you aren't using a custom theme, navigate inside the default theme folder.

From here, there are two ways to install depending on your theme. If a **folder** exists with the name `ScreenGameplay overlay`, then navigate inside that folder and paste the `Interactive` folder from `Stepmania Scripts` inside there. Then open `ScreenGameplay overlay/default.lua` and add this line at the bottom, right before `return t`:
```lua
t[#t+1] = LoadActor("Interactive");
```
This will load the interactive logic into the overlay during gameplay.

In the case that a folder called `ScreenGameplay overlay` does **not** exist, then find the file called `ScreenGameplay overlay.lua`. At the end of the file, right before `return t`, add this line:
```lua
t[#t+1] = LoadActor("Interactive");
```
After you've done that, paste `Interactive` folder from `Stepmania Scripts` into `BGAnimations`.

Now copy `Stepmania Scripts/new_mod.ogg` into `Stepmania/Themes/YOUR_THEME/BGAnimations`. You're good to go now!

### Twitch environment
Open up `Channel Points Monitor/rewards.js`. This is where you define correlations between channel point rewards and the mods they trigger. There's a couple examples in there already, so you can follow that format to add more mods.

The key of this list is the Twitch channel point reward title, like `Mod: Confusion`. This name must match the reward name from Twitch *__exactly__*. To set up custom channel point rewards, go to the [Channel Points Rewards page](https://dashboard.twitch.tv/community/channel-points/rewards) and hit "Add New Custom Reward". You'll be able to create a new reward in here, but the main thing is the title. 

If you'd like some ideas on different mods that can be applied, take a look at `Channel Points Monitor/config.js`. In here, all the mod types are defined as well as expected arguments. This contains lists of arguments that will be accepted. If you get an error while adding new mods, you probably didn't match the expected arguments.

### Song Requests

If you'd like to allow viewers to redeem channel points to request songs (that show up in DDRDave's song request system), follow these steps.

1. Set up the [Stepmania Stream Tools](https://github.com/DaveLinger/Stepmania-Stream-Tools) song requests.
2. Create a new channel points reward on Twitch called `Song Request`. I would recommend something like this for the description:
```
Request a song! See the "REQUESTS" panel below the stream for more info! After you've found the song ID, enter the ID below! It will automatically be added to the queue! (ID must be a number!)
```
You should also require the viewer to enter text for the reward because they'll be entering the song ID to request it.

3. Add the following two extra fields to your `.env` file.
```
WEBSITE_URL=YOUR_WEBSITE_URL_HERE
SECURITY_KEY=YOUR_SECURITY_KEY_HERE
```
The website URL is the URL where your stepmania tools are hosted, aka where people can go to browse your song list. The security key is your stepmania tools stream key that you configured for those tools.

4. You'll also need to edit `request.php` from the stepmania tools. Find where it says `function check_cooldown($user){` and then comment these three lines like so:
```php
	//if($numrows != 0){
	//	echo "You are requesting songs too rapidly!";
	//	die();
	//}
```
This will ensure that there is no cooldown when requesting songs.

5. Make sure to disable the relevant moobot commands if you have commands that viewers can use to request songs. You may want to restrict these to mod only so normal viewers have to use channel points to request songs.

Keep in mind that you will still have to run the stepmania stream tools scripts in order to cross off songs when you play them. Everything else should work the same in the stream tools.

## Running it

The node application uses a websocket to connect to Twitch pubsub and monitor for channel point redemptions. Navigate inside `Channel Points Monitor` and run the following command:
```
node main.js
```
This will start up the monitoring app. You should see the following two lines - if you do, then you're all set up and ready to go!
```
Connection established to wss://pubsub-edge.twitch.tv. Setting everything up...
All set up! We're good to go!
```

From here, when people redeem channel points, they should trigger the various mods that you set up. Additionally, if you set up the song requests feature, they'll need to use channel points to request songs.

## How it works (mods)
1. NodeJS app listens for channel point redemptions.
2. It parses this data and serializes it into nice strings.
3. It writes these strings to a file that Stepmania can read.
4. The script we added to Stepmania reads this file once per second.
5. If it finds new mods, it parses these and adds them to a queue.
6. Mods are applied from the queue if there is not already a mod of the same type running.
7. After the set amount of time, the mod is cleared from the game.

Keep in mind that this logic _only_ works during gameplay. If someone redeems channel points when you're not in a song, it will store these in a file until you start playing a song. Mods are cleared on song end.

### Powering Up Mods with Bits
If someone uses bits, this is also detected by the monitor and is used to power up mods by extending the time that they last. By default, every 20 bits equals one extra second of mod activation time. So if someone uses 100 bits, then their next mod activation will last for an extra 5 seconds. These activation points disappear when you restart the monitoring program, so users should activate a mod quickly after using bits to power up. After activating a mod, more bits must be used to power up the next activation.

## Questions?
Have questions about this, or need help setting it up? Feel free to message me on one of these platforms:

Discord: `StepOnIt#2565`

Twitter: `@StepOnItDDR`

## Credits
Thanks to DDRDave for his [Stepmania Stream Tools](https://github.com/DaveLinger/Stepmania-Stream-Tools), which showed me that something like this was possible.

Thanks to Kyzentun for some posts that I found on triggering mods with Lua. I used some code snippets to help me get started.

Thanks to the [Simply Love theme](https://github.com/quietly-turning/Simply-Love-SM5) for the mod activation sound effect.
