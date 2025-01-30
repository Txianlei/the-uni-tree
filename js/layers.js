addLayer("g", {
    name: "genesis", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#DDDDDD",
    requires: new Decimal("1e-39"), // Can be a function that takes requirement increases into account
    resource: "genesis", // Name of prestige currency
    baseResource: "force", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("g",14)) mult=mult.times(upgradeEffect("g",14))
        if(hasUpgrade("g",15)) mult=mult.times(3)
        mult=mult.times(buyableEffect("g",11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "g", description: "G: Reset for genesis", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tabFormat:{
        "Main":{
            content:[
                ["display-text",function() { return `You have <h2 style="color:#DDDDDD;text-shadow:0 0 10px #DDDDDD">${format(player.g.points)}</h2> genesis, producing <h2 style="color:#DDDDDD;text-shadow:0 0 10px #DDDDDD">${format(getPointGen())}</h2> force/s.`},{ "font-size":"15px"},],
                "blank",
                "prestige-button",
                "blank",
                ["display-text",function() { return `Before buying any genesis things,force need to be more then 1e-39.`},{ "font-size":"15px"},],
                "blank",
                "upgrades",
                "blank",
                "buyables"
            ]
        }
    },
    upgrades:{
        11:{
            title:"Weak force",
            description(){return `Double force gain.`},
            cost(){return new Decimal(2)},
            unlocked(){ 
                return player.g.unlocked
            },
            canAfford(){return player.g.points.gte(2)&&player.points.gt("1e-39")},
            pay(){return player.g.points=player.g.points.minus(2)},
        },
        12:{
            title:"Strong force",
            description(){return `Boost force gain based on genesis.`},
            cost(){return new Decimal(5)},
            unlocked(){ 
                return hasUpgrade("g",11)
            },
            canAfford(){return player.g.points.gte(5)&&player.points.gt("1e-39")},
            pay(){return player.g.points=player.g.points.minus(5)},
            effect(){return player.g.points.add(1).ln().pow(hasUpgrade("g",16)?1.6:1.44)},
            effectDisplay(){return `Currently:x${format(upgradeEffect("g",12))}`},
            tooltip(){
                if(hasUpgrade("g",21)) return `ln(g+1)<b style="color:#00EF00">^1.6`
                return `ln(g+1)^1.44`
            }
        },
        13:{
            title:"Pulling",
            description(){return `Boost force gain based on itself.`},
            cost(){return new Decimal(15)},
            unlocked(){ 
                return hasUpgrade("g",12)
            },
            canAfford(){return player.g.points.gte(15)&&player.points.gt("1e-39")},
            pay(){return player.g.points=player.g.points.minus(15)},
            effect(){return player.points.times(1e40).pow(0.025).add(1)},
            effectDisplay(){return `Currently:x${format(upgradeEffect("g",13))}`},
            tooltip(){
                if(hasUpgrade("g",22)) return `(f*1e40)<b style="color:#00EF00">^0.04</b>+1`
                return `(f*1e40)^0.025+1`
            }
        },
        14:{
            title:"Genesis power",
            description(){return `Boost genesis gain based on force.`},
            cost(){return new Decimal(30)},
            unlocked(){ 
                return hasUpgrade("g",13)
            },
            canAfford(){return player.g.points.gte(30)&&player.points.gt("1e-39")},
            pay(){return player.g.points=player.g.points.minus(30)},
            effect(){return player.points.times(1e37).add(1).log10().pow(2).add(1)},
            effectDisplay(){return `Currently:x${format(upgradeEffect("g",14))}`},
            tooltip(){return `log10(f*1e37+1)^2+1`}
        },
        15:{
            title:"Gravity",
            description(){return `Triple genesis gain, unlock a booster.`},
            cost(){return new Decimal(100)},
            unlocked(){ 
                return hasUpgrade("g",14)
            },
            canAfford(){return player.g.points.gte(100)&&player.points.gt("1e-39")},
            pay(){return player.g.points=player.g.points.minus(100)},
        },
        21:{
            title:"Stronger force",
            description(){return `"Strong force" effect is stronger.`},
            cost(){return new Decimal(2e5)},
            unlocked(){ 
                return hasUpgrade("g",15)
            },
            canAfford(){return player.g.points.gte(2e5)&&player.points.gt("1e-39")},
            pay(){return player.g.points=player.g.points.minus(2e5)},
            tooltip(){return "1.44->1.6"}
        },
        22:{
            title:"Strenth",
            description(){return `"Pulling" effect is stronger.`},
            cost(){return new Decimal(1.5e6)},
            unlocked(){ 
                return hasUpgrade("g",21)
            },
            canAfford(){return player.g.points.gte(1.5e6)&&player.points.gt("1e-39")},
            pay(){return player.g.points=player.g.points.minus(1.5e6)},
            tooltip(){return "0.025->0.04"}
        },
        23:{
            title:"Cosmic wave",
            description(){return `Boost force gain base based on genesis.`},
            cost(){return new Decimal(5e6)},
            unlocked(){ 
                return hasUpgrade("g",22)
            },
            canAfford(){return player.g.points.gte(5e6)&&player.points.gt("1e-39")},
            pay(){return player.g.points=player.g.points.minus(5e6)},
            effect(){return player.g.points.add(1).log10().div(100).min(1)},
            effectDisplay(){return this.effect().eq(1)?`Currently:+1.00(Hard capped)`:`Currently:+${format(upgradeEffect("g",23))}`},
            tooltip(){return `log10(g+1)/100`}
        },
        24:{
            title:"Balanced gravity",
            description(){return `Divide "Gravitational field" price based on force.`},
            cost(){return new Decimal(1e7)},
            unlocked(){ 
                return hasUpgrade("g",23)
            },
            canAfford(){return player.g.points.gte(1e7)&&player.points.gt("1e-39")},
            pay(){return player.g.points=player.g.points.minus(1e7)},
            effect(){return player.points.times(1e35).add(1).pow(0.2).max(1)},
            effectDisplay(){return `Currently:/${format(upgradeEffect("g",24))}`},
            tooltip(){return `(f*1e35+1)^0.2`}
        },
    },
    buyables:{
        11:{
            title:"Gravitational field",
            cost(x) { return Decimal.pow(10,Decimal.pow(x,1.5)).div(hasUpgrade("g",24)?upgradeEffect("g",24):1)},
            effect(x) { return Decimal.pow(3,x)},
            display() { return `Reset genesis,force,and genesis upgrades to boost genesis and force gain.
                                Next at: ${format(this.cost())} genesis
                                Amount: ${format(getBuyableAmount("g",11))}
                                Effect: x${format(this.effect())}` },
            canAfford() { return player.g.points.gte(this.cost()) },
            buy(){
                if(!tmp.g.buyables[11].canAfford) return
                player.g.upgrades=[]
                player.g.points=new Decimal(0)
                player.points=new Decimal("1e-39")
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
                if(!tmp.g.buyables[11].canAfford) return
                let tb = player.g.points.max(1).times(hasUpgrade("g",24)?upgradeEffect("g",24):1).log10().root(1.5)
                let tg = tb.plus(1).floor()
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(tg))
            },
            unlocked(){return hasUpgrade("g",15)||getBuyableAmount("g",11).gt(0)},
            style:{"height":"250px","width":"250px","font-size":"15px","border-radius":"1%","border":"10 px solid","background-color"(){return tmp.g.buyables[11].canAfford? "#DDDDDD25":"#000000"},"border-color":"#DDDDDD","color":"#DDDDDD"}
        },
    },
}),
addLayer("st", {
    symbol: "#",
    startData() { return {
        unlocked: true,
    }},
    color: "#DDDDDD",
    row: "side",
    layerShown() {return true}, 
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Game stories")
    },
    tabFormat:{
        "Chapter I":{
            content:[
                ["infobox","Genesis1"],
                ["infobox","Genesis2"],
                ["infobox","Genesis3"],
            ]
        }
    },
    infoboxes: {
        Genesis1: {
            title: "Part I-Genesis",
            body() { return `Soon after the universe exploded, there was nothing but nothingness.....<br>
                            A force suddenly appeared in the void, but it was extremely weak, what do you need to do.....
                ` },
            style:{"width":"400px"},
        },
        Genesis2: {
            title: "Part II-Force production",
            body() { return `You can produce force now by using a strange thing:Genesis.<br>
                           But it is still weaker than you thought, you should find a way to make it faster.....
                ` },
            style:{"width":"400px"},
            unlocked(){return hasUpgrade("g",11)||getBuyableAmount("g",11).gt(0)}
        },
        Genesis3: {
            title: "Part III-Gravity",
            body() { return `The force is strong enough to pull each other together.<br>
                            These makes produce faster.` },
            style:{"width":"400px"},
            unlocked(){return getBuyableAmount("g",11).gt(0)}
        },
    },
})
