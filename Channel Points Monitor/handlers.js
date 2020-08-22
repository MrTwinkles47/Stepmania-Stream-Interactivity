const Rewards = require('./rewards');
const ModHandler = require('./mods')

// Called when a message from twitch comes, like bits or points redemption
function HandleMessage(message)
{
    console.log("Got message in monitor")

    console.log(message)
    console.log(message.data.redemption.reward)
    console.log(message.data.redemption.user)

    if (message.type == "reward-redeemed")
    {
        HandleChannelPointsRedeemed(message.data);
    }
    else if (message.type == "bits??")
    {
        HandleBits(message.data);
    }
    else
    {
        console.log("Unsupported message type (You probably subscribed to some more events that we don't use)");
    }
}

function HandleChannelPointsRedeemed(data)
{
    console.log("HandleChannelPointsRedeemed");
    const mod = Rewards[data.redemption.reward.title];
    if (!mod)
    {
        // Reward does not exist in rewards.js config - not handling it here (probably a different type of reward, unrelated)
        return;
    }

    // Activate mods from reward
    ModHandler.ApplyMod(mod, data.redemption.user)
}

function HandleBits(data)
{
    console.log("HandleBits")
}


module.exports = { HandleMessage }