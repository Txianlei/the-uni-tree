let modInfo = {
    name: "The universe Tree",
    id:"uitu",
    author: "User incremental",
    pointsName: "force",
    modFiles: ["layers.js", "tree.js"],
    allowSmall: true,

    discordName: "",
    discordLink: "",
    initialStartPoints: new Decimal("1e-39"),
    offlineLimit: 1, // In hours
}

// Version Info
let VERSION = {
    num: "0.0",
    name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
    <h3>v0.0</h3><br>
        - Added things.<br>
        - Added stuff.`

let winText = `Congratulations! You have reached the end of this game I guess.....`

var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"] // Don't call these every tick

function getStartPoints() {
    return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints() {
    return player.g.points.gt(0)
}

// Function to calculate the point generation per second
function getPointGen() {
    if (!canGenPoints())
        return new Decimal(0)

    let gain=new Decimal("1e-40")
    gain=gain.times(Decimal.pow(3,player.g.points.add(1).log10()))
    if(hasUpgrade("g",11)) gain=gain.times(2)
    if(hasUpgrade("g",12)) gain=gain.times(upgradeEffect("g",12))
    if(hasUpgrade("g",13)) gain=gain.times(upgradeEffect("g",13))
    gain=gain.times(buyableEffect("g",11))

    return gain;
}

// Add non-layer related variables that should go into "player"
function addedPlayerData() {
}

// Display extra things at the top of the page
var displayThings = [
];

// Determines when the game "ends"
function isEndgame() {
    return getBuyableAmount("g",11).gte(2)
}

// Background styles
var backgroundStyle = {}

// Max tick length
function maxTickLength() {
    return 3600 // Default is 1 hour
}

// Fix saves for old versions (no changes needed)
function fixOldSave(oldVersion) {
    // You can add your save fix logic here if necessary
}
