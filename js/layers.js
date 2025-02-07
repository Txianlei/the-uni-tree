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
        if(hasUpgrade("g",32)) mult=mult.times(upgradeEffect("g",32))
        if(hasUpgrade("g",15)) mult=mult.times(3)
        if(hasUpgrade("q",25)) mult=mult.times(upgradeEffect("q",25))
        mult=mult.times(buyableEffect("g",11))
        mult=mult.times(buyableEffect("g",23))

        if(hasMilestone("q",0)) mult=mult.times(tmp.q.quarkboost[1])
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "g", description: "G: Reset for genesis", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer){
        let keep=[]
        if(hasUpgrade("q",22)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) {
            if(!hasUpgrade("q",22)) player.subtabs.g.mainTabs="Main"
            layerDataReset("g", keep)
        }
    },
    layerShown(){return true},
    passiveGeneration(){return hasUpgrade("q",31)?upgradeEffect("q",31):0},
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
                ["buyables",[1]],
            ]
        },
        "Quantum":{
            content:[
                ["display-text",function() { return `You have <h2 style="color:#DDDDDD;text-shadow:0 0 10px #DDDDDD">${format(player.g.points)}</h2> genesis, producing <h2 style="color:#DDDDDD;text-shadow:0 0 10px #DDDDDD">${format(getPointGen())}</h2> force/s.`},{ "font-size":"15px"},],
                "blank",
                "prestige-button",
                "blank",
                ["buyables",[2,3]],
            ],
            unlocked(){return hasUpgrade("g",25)}
        }
    },
    update(diff){
        if(hasUpgrade("q",23)) layers.g.buyables[11].buy()
        if(hasUpgrade("q",33)) layers.g.buyables[21].buy()
        if(hasUpgrade("q",33)) layers.g.buyables[22].buy()
        if(hasUpgrade("q",33)) layers.g.buyables[23].buy()
        if(hasUpgrade("q",33)) layers.g.buyables[31].buy()
        if(hasUpgrade("q",33)) layers.g.buyables[32].buy()
    },
    upgrades:{
        11:{
            title:"Weak force",
            description(){return `Double force gain.`},
            cost(){return new Decimal(2)},
            unlocked(){ 
                return true
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
            effect(){return player.g.points.add(1).ln().pow(hasUpgrade("g",16)?1.6:1.44).times(hasMilestone("q",2)?tmp.q.quarkboost[3]:1).add(1)},
            effectDisplay(){return `Currently:x${format(upgradeEffect("g",12))}`},
            tooltip(){
                if(hasUpgrade("g",21)) return `ln(g+1)<b style="color:#00EF00">^1.6+1`
                return `ln(g+1)^1.44+1`
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
            title:"Strength",
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
            effect(){return player.g.points.add(1).log10().div(100).min(0.3)},
            effectDisplay(){return this.effect().eq(0.3)?`Currently:+0.30(Hard capped)`:`Currently:+${format(upgradeEffect("g",23))}`},
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
        25:{
            title:"Quantum tunnel",
            description(){return `Unlock new buyables.`},
            cost(){return new Decimal(1e8)},
            unlocked(){ 
                return hasUpgrade("g",24)||hasUpgrade("g",25)
            },
            canAfford(){return player.g.points.gte(1e8)&&player.points.gt("1e-39")},
            pay(){return player.g.points=player.g.points.minus(1e8)},
        },
        31:{
            title:"Quantum float",
            description(){return `Unlock a new buyable.`},
            cost(){return new Decimal(1e12)},
            unlocked(){ 
                return hasUpgrade("g",25)
            },
            canAfford(){return player.g.points.gte(1e12)&&player.points.gt("1e-39")},
            pay(){return player.g.points=player.g.points.minus(1e12)},
        },
        32:{
            title:"Synergism power",
            description(){return `Boost genesis gain based on "Positive"s.`},
            cost(){return new Decimal(1e16)},
            unlocked(){ 
                return hasUpgrade("g",31)
            },
            canAfford(){return player.g.points.gte(1e16)&&player.points.gt("1e-39")},
            pay(){return player.g.points=player.g.points.minus(1e16)},
            effect(){return getBuyableAmount("g",21).add(1).pow(2).div(10).max(1)},
            effectDisplay(){return `Currently:x${format(upgradeEffect("g",32))}`},
            tooltip(){return `(n+1)^2/10`}
        },
        33:{
            title:"Quark",
            description(){return `Unlock a new layer.`},
            cost(){return new Decimal(1e20)},
            unlocked(){ 
                return hasUpgrade("g",32)
            },
            canAfford(){return player.g.points.gte(1e20)&&player.points.gt("1e-39")},
            pay(){return player.g.points=player.g.points.minus(1e20)},
        },
        34:{
            title:"Quantum quark",
            description(){return `Unlock a new buyable.`},
            cost(){return new Decimal(1e38)},
            unlocked(){ 
                return hasUpgrade("g",33)&&hasMilestone("q",2)
            },
            canAfford(){return player.g.points.gte(1e38)&&player.points.gt("1e-39")},
            pay(){return player.g.points=player.g.points.minus(1e38)},
        },
        35:{
            title:"Quantum quark II",
            description(){return `Unlock a new buyable.`},
            cost(){return new Decimal(1e65)},
            unlocked(){ 
                return hasUpgrade("g",34)&&hasMilestone("q",5)
            },
            canAfford(){return player.g.points.gte(1e65)&&player.points.gt("1e-39")},
            pay(){return player.g.points=player.g.points.minus(1e65)},
        },
    },
    buyables:{
        11:{
            title:"Gravitational field",
            cost(x) { return Decimal.pow(10,Decimal.pow(x,1.5)).div(hasUpgrade("g",24)?upgradeEffect("g",24):1).div(hasMilestone("q",1)?tmp.q.quarkboost[2]:1)},
            effect(x) { return Decimal.pow(3,x.add(buyableEffect("g",22)))},
            display() { return (hasUpgrade("q",23)?``:`Reset genesis,force, `+(hasUpgrade("q",14)?``:`and first 9 genesis upgrades`))+`boost genesis and force gain.
                                Next at: ${format(this.cost())} genesis
                                Amount: ${format(getBuyableAmount("g",11))}
                                Effect: x${format(this.effect())}` },
            canAfford() { return player.g.points.gte(this.cost())&&this.unlocked() },
            buy(){
                if(!tmp.g.buyables[11].canAfford) return
                if(!hasUpgrade("q",14)) player.g.upgrades = player.g.upgrades.filter(item => item > "24")
                if(!hasUpgrade("q",23)){
                    player.g.points=new Decimal(0)
                    layer.points=new Decimal("1e-39")
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
                if(!tmp.g.buyables[11].canAfford) return
                let tb = player.g.points.max(1).times(hasMilestone("q",1)?tmp.q.quarkboost[2]:1).times(hasUpgrade("g",24)?upgradeEffect("g",24):1).log10().root(1.5)
                let tg = tb.plus(1).floor()
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(tg))
            },
            unlocked(){return hasUpgrade("g",15)||getBuyableAmount("g",11).gt(0)},
            style:{"height":"250px","width":"250px","font-size":"15px","border-radius":"1%","border":"10 px solid","background-color"(){return tmp.g.buyables[11].canAfford? "#DDDDDD25":"#000000"},"border-color":"#DDDDDD","color":"#DDDDDD"}
        },
        21:{
            title:"Positive",
            cost(x) { return Decimal.pow(10,Decimal.pow(x.add(1),(hasMilestone("p",1)?1.1:1.25))).times("8e-32")},
            effect(x) { 
                let base=new Decimal(5)
                if(hasUpgrade("q",11)) base=base.add(1.5)
                return Decimal.pow(base,x)
            },
            display() { return `Boost force gain.
                                Cost: ${format(this.cost())} force
                                Amount: ${format(getBuyableAmount("g",21))}
                                Effect: x${format(this.effect())}` },
            canAfford() { return player.points.gt(this.cost())&&this.unlocked() },
            buy(){
                if(!tmp.g.buyables[21].canAfford) return
                if(!hasUpgrade("q",33)) player.points=player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
                if(!tmp.g.buyables[21].canAfford) return
                let tb = player.points.max(1).times(1e30).log10().root(1.25).sub(1)
                let tg = tb.plus(1).floor()
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(tg))
            },
            unlocked(){return hasUpgrade("g",25)},
            style:{"height":"150px","width":"150px","font-size":"15px","border-radius":"5%"}
        },
        22:{
            title:"Vanish",
            cost(x) { return Decimal.pow(1000,x.pow(1.5)).times("1e-25") },
            effect(x) { return this.unlocked()? x.times(0.5):new Decimal(0)},
            display() { return `Give free "Gravitational field"s.
                                Cost: ${format(this.cost())} force
                                Amount: ${format(getBuyableAmount("g",22))}
                                Effect: +${format(this.effect())}` },
            canAfford() { return player.points.gt(this.cost())&&this.unlocked() },
            buy(){
                if(!tmp.g.buyables[22].canAfford) return
                if(!hasUpgrade("q",33)) player.points=player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
                if(!tmp.g.buyables[22].canAfford) return
                let tb = player.points.max(1).times(1e25).log(1000).root(1.5).sub(1)
                let tg = tb.plus(1).floor()
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(tg))
            },
            unlocked(){return hasUpgrade("g",31)},
            style:{"height":"150px","width":"150px","font-size":"15px","border-radius":"5%"}
        },
        23:{
            title:"Negative",
            cost(x) { return Decimal.pow(1.5,x.add(1).pow(2)).times("8e-29") },
            effect(x) {
                let base=new Decimal(3)
                if(hasUpgrade("q",12)) base=base.add(1.5)
                return Decimal.pow(base,x)
            },
            display() { return `Boost genesis gain.
                                Cost: ${format(this.cost())} force
                                Amount: ${format(getBuyableAmount("g",23))}
                                Effect: x${format(this.effect())}` },
            canAfford() { return player.points.gt(this.cost())&&this.unlocked() },
            buy(){
                if(!tmp.g.buyables[23].canAfford) return
                if(!hasUpgrade("q",33)) player.points=player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
                if(!tmp.g.buyables[23].canAfford) return
                let tb = player.points.max(1).times(1e28).log(1.5).sqrt().sub(1)
                let tg = tb.plus(1).floor()
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(tg))
            },
            unlocked(){return hasUpgrade("g",25)},
            style:{"height":"150px","width":"150px","font-size":"15px","border-radius":"5%"}
        },
        31:{
            title:"Inflation",
            cost(x) { return Decimal.pow(15,x.add(1).pow(0.8)).pow(2).times(1000) },
            effect(x) {return Decimal.pow(x.add(1).log10().add(2),x)},
            display() { return `Boost first 3 types of quarks gain.
                                Cost: ${format(this.cost())} force
                                Amount: ${format(getBuyableAmount("g",31))}
                                Effect: x${format(this.effect())}` },
            canAfford() { return player.points.gt(this.cost())&&this.unlocked() },
            buy(){
                if(!tmp.g.buyables[31].canAfford) return
                if(!hasUpgrade("q",33)) player.points=player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
                if(!tmp.g.buyables[31].canAfford) return
                let tb = player.points.max(1).div(1000).sqrt().log(15).pow(1.25).sub(1)
                let tg = tb.plus(1).floor()
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(tg))
            },
            unlocked(){return hasUpgrade("g",34)},
            style:{"height":"150px","width":"150px","font-size":"15px","border-radius":"5%","margin-top":"15px","font-size":"12.5px"}
        },
        32:{
            title:"Massive field",
            cost(x) { return Decimal.pow(20,x.add(1).pow(1.25)).times(1e20) },
            effect(x) {return Decimal.pow(x.add(1).log10().add(1.75),x)},
            display() { return `Boost last 3 types of quarks gain.
                                Cost: ${format(this.cost())} force
                                Amount: ${format(getBuyableAmount("g",32))}
                                Effect: x${format(this.effect())}` },
            canAfford() { return player.points.gt(this.cost())&&this.unlocked() },
            buy(){
                if(!tmp.g.buyables[32].canAfford) return
                if(!hasUpgrade("q",33)) player.points=player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
                if(!tmp.g.buyables[32].canAfford) return
                let tb = player.points.max(1).div(1e20).log(20).root(1.25).sub(1)
                let tg = tb.plus(1).floor()
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(tg))
            },
            unlocked(){return hasUpgrade("g",35)},
            style:{"height":"150px","width":"150px","font-size":"15px","border-radius":"5%","margin-top":"15px","font-size":"12.5px"}
        },
    },
}),
addLayer("q", {
    name: "quark", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Q", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        upquark: new Decimal(0),
        downquark: new Decimal(0),
        strangequark: new Decimal(0),
        charmquark: new Decimal(0),
        topquark: new Decimal(0),
        bottomquark: new Decimal(0),
    }},
    color:"rgb(175, 50, 50)",
    requires: new Decimal("1e-13"), // Can be a function that takes requirement increases into account
    resource: "quark", // Name of prestige currency
    baseResource: "force", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasMilestone("q",3)) mult=mult.times(tmp.q.quarkboost[4])
        if(hasUpgrade("q",25)) mult=mult.times(upgradeEffect("q",25))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "q", description: "Q: Reset for quarks", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("g",33)||player.q.unlocked},
    branches:["g"],
    tabFormat:{
        "Main":{
            content:[
                ["display-text",function() { return `You have <h2 style="color:rgb(175,50,50);text-shadow:0 0 10px rgb(175,50,50)">${format(player.q.points)}</h2> quark, boost force gain by <h2 style="color:rgb(175,50,50);text-shadow:0 0 10px rgb(175,50,50)">${format(tmp.q.calcqboost)}</h2>`},{ "font-size":"15px"},],
                "blank",
                "prestige-button",
                "blank",
                "milestones",
                "upgrades",
            ]
        },
        "Quarks":{
            content:[
                ["display-text",function() { return `You have <h2 style="color:rgb(175,50,50);text-shadow:0 0 10px rgb(175,50,50)">${format(player.q.points)}</h2> quark, boost force gain by <h2 style="color:rgb(175,50,50);text-shadow:0 0 10px rgb(175,50,50)">${format(tmp.q.calcqboost)}</h2>`},{ "font-size":"15px"},],
                "blank",
                "prestige-button",
                "blank",
                ["display-text",function() { return `You have <b style="color:red">${format(player.q.upquark)}</b>(+${format(tmp.q.quarkgen[1])}/s) upquark, boost genesis gain by ${format(tmp.q.quarkboost[1])}`},{ "font-size":"15px"},],
                "blank",
                ["display-text",function() { return `You have <b style="color:orange">${format(player.q.downquark)}</b>(+${format(tmp.q.quarkgen[2])}/s) downquark, "Gravitational Field" price is divided by ${format(tmp.q.quarkboost[2])}`},{ "font-size":"15px"},],
                "blank",
                ["display-text",function() { return `You have <b style="color:yellow">${format(player.q.strangequark)}</b>(+${format(tmp.q.quarkgen[3])}/s) strangequark, "Strong force" effect is boosted by ${format(tmp.q.quarkboost[3])}`},{ "font-size":"15px"},],
                "blank",
                ["display-text",function() { return `You have <b style="color:green">${format(player.q.charmquark)}</b>(+${format(tmp.q.quarkgen[4])}/s) charmquark, boost quark gain by ${format(tmp.q.quarkboost[4])}`},{ "font-size":"15px"},],
                "blank",
                ["display-text",function() { return `You have <b style="color:blue">${format(player.q.topquark)}</b>(+${format(tmp.q.quarkgen[5])}/s) topquark, first 2 types of quark effect is raised to ^${format(tmp.q.quarkboost[5])}`},{ "font-size":"15px"},],
                "blank",
                ["display-text",function() { return `You have <b style="color:purple">${format(player.q.bottomquark)}</b>(+${format(tmp.q.quarkgen[6])}/s) bottomquark, middle 2 types of quark effect is raised to ^${format(tmp.q.quarkboost[6])}`},{ "font-size":"15px"},],
                "blank",
            ],
            unlocked(){return hasMilestone("q",0)}
        },
    },
    update(diff){
        player.q.upquark=player.q.upquark.add(tmp.q.quarkgen[1].times(diff))
        player.q.downquark=player.q.downquark.add(tmp.q.quarkgen[2].times(diff))
        player.q.strangequark=player.q.strangequark.add(tmp.q.quarkgen[3].times(diff))
        player.q.charmquark=player.q.charmquark.add(tmp.q.quarkgen[4].times(diff))
        player.q.topquark=player.q.topquark.add(tmp.q.quarkgen[5].times(diff))
        player.q.bottomquark=player.q.bottomquark.add(tmp.q.quarkgen[6].times(diff))
    },
    calcqboost(){
        return Decimal.pow(11,player.q.points.add(1).log10()).pow(2)
    },
    quarkgen(){
        upgen=new Decimal(0)
        downgen=new Decimal(0)
        strangegen=new Decimal(0)
        charmgen=new Decimal(0)
        topgen=new Decimal(0)
        bottomgen=new Decimal(0)
        if(hasMilestone("q",0)){
            upgen=player.q.points.pow(0.6667)
            if(hasUpgrade("q",13)) upgen=upgen.times(upgradeEffect("q",13))
            if(hasUpgrade("q",35)) upgen=upgen.times(upgradeEffect("q",35))
            upgen=upgen.times(buyableEffect("g",31))
        }
        if(hasMilestone("q",1)){
            downgen=player.q.points.pow(0.3333)
            if(hasUpgrade("q",15)) downgen=downgen.times(upgradeEffect("q",15))
            if(hasUpgrade("q",35)) downgen=downgen.times(upgradeEffect("q",35))
            downgen=downgen.times(buyableEffect("g",31))
        }
        if(hasMilestone("q",2)){
            strangegen=upgen.pow(0.25)
            if(hasUpgrade("q",21)) strangegen=strangegen.times(upgradeEffect("q",21))
            if(hasUpgrade("q",35)) strangegen=strangegen.times(upgradeEffect("q",35))
            strangegen=strangegen.times(buyableEffect("g",31))
        }
        if(hasMilestone("q",3)){
            charmgen=downgen.pow(0.25)
            if(hasUpgrade("q",24)) charmgen=charmgen.times(upgradeEffect("q",24))
            if(hasUpgrade("q",35)) charmgen=charmgen.times(upgradeEffect("q",35))
            charmgen=charmgen.times(buyableEffect("g",32))
        }
        if(hasMilestone("q",4)){
            topgen=strangegen.pow(0.1)
            if(hasUpgrade("q",32)) topgen=topgen.times(upgradeEffect("q",32))
            if(hasUpgrade("q",35)) topgen=topgen.times(upgradeEffect("q",35))
            topgen=topgen.times(buyableEffect("g",32))
        }
        if(hasMilestone("q",5)){
            bottomgen=charmgen.pow(0.1)
            if(hasUpgrade("q",34)) bottomgen=bottomgen.times(upgradeEffect("q",34))
            if(hasUpgrade("q",35)) bottomgen=bottomgen.times(upgradeEffect("q",35))
            bottomgen=bottomgen.times(buyableEffect("g",32))
        }
        return [null,upgen,downgen,strangegen,charmgen,topgen,bottomgen]
    },
    quarkboost(){
        upboost=new Decimal(1)
        downboost=new Decimal(1)
        strangeboost=new Decimal(1)
        charmboost=new Decimal(1)
        topboost=new Decimal(1)
        bottomboost=new Decimal(1)
        if(hasMilestone("q",0)){
            upboost=Decimal.pow(3,player.q.upquark.add(1).log10())
            if(hasMilestone("q",4)) upboost=upboost.pow(topboost)
        }
        if(hasMilestone("q",1)){
            downboost=player.q.downquark.add(1).pow(0.5)
            if(hasMilestone("q",4)) downboost=downboost.pow(topboost)
        }
        if(hasMilestone("q",2)){
            strangeboost=Decimal.pow(1.5,player.q.strangequark.add(1).log10().pow(1.5))
            if(hasMilestone("q",5)) strangeboost=strangeboost.pow(bottomboost)
        }
        if(hasMilestone("q",3)){
            charmboost=Decimal.pow(2,player.q.charmquark.add(1).log10().times(2))
            if(hasMilestone("q",5)) charmboost=charmboost.pow(bottomboost)
        }
        if(hasMilestone("q",4)){
            topboost=player.q.topquark.add(1).log10().pow(2).div(100).add(1)
        }
        if(hasMilestone("q",5)){
            bottomboost=player.q.bottomquark.add(1).log10().pow(1.8).div(100).add(1)
        }
        return [null,upboost,downboost,strangeboost,charmboost,topboost,bottomboost]
    },
    upgrades:{
        11:{
            title:"Stronger Positive",
            description(){return `+1.5 to "Positive" base.`},
            cost(){return new Decimal(2)},
            unlocked(){ 
                return player.q.unlocked
            },
            canAfford(){return player.q.points.gte(2)},
            pay(){return player.q.points=player.q.points.minus(2)},
        },
        12:{
            title:"Stronger Negative",
            description(){return `+1.5 to "Negative" base.`},
            cost(){return new Decimal(2)},
            unlocked(){ 
                return player.q.unlocked
            },
            canAfford(){return player.q.points.gte(2)},
            pay(){return player.q.points=player.q.points.minus(2)},
        },
        13:{
            title:"Quark chain I",
            description(){return `Boost upquark gain based on quarks.`},
            cost(){return new Decimal(5)},
            unlocked(){ 
                return hasUpgrade("q",11)||hasUpgrade("q",12)
            },
            canAfford(){return player.q.points.gte(5)},
            pay(){return player.q.points=player.q.points.minus(5)},
            effect(){return player.q.points.add(1).ln().pow(2).add(1)},
            effectDisplay(){return `Currently:x${format(upgradeEffect("q",13))}`},
            tooltip(){return `ln(q+1)^2+1`}
        },
        14:{
            title:"Quark QoL I",
            description(){return `"Gravitational field" doesn't reset upgrades any longer.`},
            cost(){return new Decimal(35)},
            unlocked(){ 
                return hasUpgrade("q",13)
            },
            canAfford(){return player.q.points.gte(5)},
            pay(){return player.q.points=player.q.points.minus(5)},
        },
        15:{
            title:"Quark chain II",
            description(){return `Boost downquark gain based on upquark.`},
            cost(){return new Decimal(35)},
            unlocked(){ 
                return hasUpgrade("q",13)
            },
            canAfford(){return player.q.points.gte(35)},
            pay(){return player.q.points=player.q.points.minus(35)},
            effect(){return Decimal.pow(1.1,player.q.upquark.add(1).ln())},
            effectDisplay(){return `x${format(upgradeEffect("q",15))}`},
            tooltip(){return `1.1^(ln(uq+1))`}
        },
        21:{
            title:"Quark chain III",
            description(){return `Boost strangequark gain based on downquark.`},
            cost(){return new Decimal(400)},
            unlocked(){ 
                return hasUpgrade("q",14)||hasUpgrade("q",15)
            },
            canAfford(){return player.q.points.gte(400)},
            pay(){return player.q.points=player.q.points.minus(400)},
            effect(){return Decimal.pow(1.08,player.q.downquark.add(1).ln())},
            effectDisplay(){return `Currently:x${format(upgradeEffect("q",21))}`},
            tooltip(){return `1.08^(ln(dq+1))`}
        },
        22:{
            title:"Quark Qol II",
            description(){return `Keep genesis upgrades on reset.`},
            cost(){return new Decimal(300)},
            unlocked(){ 
                return hasUpgrade("q",14)||hasUpgrade("q",15)
            },
            canAfford(){return player.q.points.gte(300)},
            pay(){return player.q.points=player.q.points.minus(300)},
        },
        23:{
            title:"Quark Qol III",
            description(){return `Auto reset "Gravitational field"s, "Gravitational field" resets nothing.`},
            cost(){return new Decimal(20000)},
            unlocked(){ 
                return hasUpgrade("q",21)||hasUpgrade("q",22)
            },
            canAfford(){return player.q.points.gte(20000)},
            pay(){return player.q.points=player.q.points.minus(20000)},
        },
        24:{
            title:"Quark chain IV",
            description(){return `Boost charmquark gain based on strangequark.`},
            cost(){return new Decimal(3e5)},
            unlocked(){ 
                return hasUpgrade("q",21)||hasUpgrade("q",22)
            },
            canAfford(){return player.q.points.gte(3e5)},
            pay(){return player.q.points=player.q.points.minus(3e5)},
            effect(){return Decimal.pow(1.06,player.q.strangequark.add(1).ln())},
            effectDisplay(){return `Currently:x${format(upgradeEffect("q",24))}`},
            tooltip(){return `1.06^(ln(sq+1))`}
        },
        25:{
            title:"Genesis chain",
            description(){return `Boost quark gain based on genesis.`},
            cost(){return new Decimal(1e6)},
            unlocked(){ 
                return hasUpgrade("q",23)&&hasUpgrade("q",24)
            },
            canAfford(){return player.q.points.gte(1e6)},
            pay(){return player.q.points=player.q.points.minus(1e6)},
            effect(){return player.g.points.add(1).ln().pow(3).add(1)},
            effectDisplay(){return `Currently:x${format(upgradeEffect("q",25))}`},
            tooltip(){return `ln(g+1)^3+1`}
        },
        31:{
            title:"Quark Qol IV",
            description(){return `Auto generate genesis based on quark.`},
            cost(){return new Decimal(1e6)},
            unlocked(){ 
                return hasUpgrade("q",25)
            },
            canAfford(){return player.q.points.gte(1e6)},
            pay(){return player.q.points=player.q.points.minus(1e6)},
            effect(){return player.q.points.add(1).log10().div(10).min(50)},
            effectDisplay(){return `Currently:${format(upgradeEffect("q",31).times(100))}%`},
            tooltip(){return `log10(q+1)/10`}
        },
        32:{
            title:"Quark chain V",
            description(){return `Boost topquark gain based on charmquark.`},
            cost(){return new Decimal(1e15)},
            unlocked(){ 
                return hasUpgrade("q",31)
            },
            canAfford(){return player.q.points.gte(1e15)},
            pay(){return player.q.points=player.q.points.minus(1e15)},
            effect(){return Decimal.pow(1.04,player.q.charmquark.add(1).ln())},
            effectDisplay(){return `Currently:x${format(upgradeEffect("q",32))}`},
            tooltip(){return `1.04^(ln(cq+1))`}
        },
        33:{
            title:"Quark Qol V",
            description(){return `Auto buy genesis buyables, genesis buyables no longer reduce force.`},
            cost(){return new Decimal(1e15)},
            unlocked(){ 
                return hasUpgrade("q",31)
            },
            canAfford(){return player.q.points.gte(1e15)},
            pay(){return player.q.points=player.q.points.minus(1e15)},
        },
        34:{
            title:"Quark chain VI",
            description(){return `Boost bottomquark gain based on topquark.`},
            cost(){return new Decimal(3e16)},
            unlocked(){ 
                return hasUpgrade("q",32)&&hasUpgrade("q",33)
            },
            canAfford(){return player.q.points.gte(3e16)},
            pay(){return player.q.points=player.q.points.minus(3e16)},
            effect(){return Decimal.pow(1.02,player.q.topquark.add(1).ln())},
            effectDisplay(){return `Currently:x${format(upgradeEffect("q",34))}`},
            tooltip(){return `1.02^(ln(tq+1))`}
        },
        35:{
            title:"Quark chain VII",
            description(){return `Boost all type of quark gain based on force.`},
            cost(){return new Decimal(1e17)},
            unlocked(){ 
                return hasUpgrade("q",34)
            },
            canAfford(){return player.q.points.gte(1e17)},
            pay(){return player.q.points=player.q.points.minus(1e17)},
            effect(){return player.points.pow(2).add(1).ln()},
            effectDisplay(){return `Currently:x${format(upgradeEffect("q",35))}`},
            tooltip(){return `ln(f^2+1)+1`}
        },
        41:{
            title:"Proton",
            description(){return `Unlock a new layer.`},
            cost(){return new Decimal(1e20)},
            unlocked(){ 
                return hasUpgrade("q",35)
            },
            canAfford(){return player.q.points.gte(1e20)},
            pay(){return player.q.points=player.q.points.minus(1e20)},
        },
    },
    milestones:{
        0: {
            requirementDescription: "1 quark & 1e-13 force",
            done() { return player.q.points.gte(1)&&player.points.gte("1e-13")},
            effectDescription: "Start to generate upquarks.",
        },
        1: {
            requirementDescription: "3 quark & 1e-9 force",
            done() { return player.q.points.gte(3)&&player.points.gte("1e-9")},
            effectDescription: "Start to generate downquarks.",
        },
        2: {
            requirementDescription: "75 quark & 1e7 force",
            done() { return player.q.points.gte(75)&&player.points.gte(1e7)},
            effectDescription: "Start to generate strangequarks.",
        },
        3: {
            requirementDescription: "500 quark & 1e10 force",
            done() { return player.q.points.gte(500)&&player.points.gte(1e10)},
            effectDescription: "Start to generate charmquarks.",
        },
        4: {
            requirementDescription: "1e14 quark & 1e25 force",
            done() { return player.q.points.gte(1e14)&&player.points.gte(1e25)},
            effectDescription: "Start to generate topquarks.",
        },
        5: {
            requirementDescription: "1e16 quark & 1e26 force",
            done() { return player.q.points.gte(1e16)&&player.points.gte(1e26)},
            effectDescription: "Start to generate bottomquarks.",
        },
    }
}),
addLayer("p", {
    name: "proton", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        upquark: new Decimal(0),
        downquark: new Decimal(0),
        strangequark: new Decimal(0),
        charmquark: new Decimal(0),
        topquark: new Decimal(0),
        bottomquark: new Decimal(0),
    }},
    color:"rgb(0, 60, 235)",
    requires: new Decimal(1e20), // Can be a function that takes requirement increases into account
    resource: "proton", // Name of prestige currency
    baseResource: "quark", // Name of resource prestige is based on
    baseAmount() {return player.q.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.01, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for protons", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("q",41)||player.p.unlocked},
    branches:["q"],
    tabFormat:{
        "Main":{
            content:[
                ["display-text",function() { return `You have <h2 style="color:rgb(0,60,235);text-shadow:0 0 10px rgb(0,60,235)">${format(player.p.points)}</h2> proton.`},{ "font-size":"15px"},],
                "blank",
                "prestige-button",
                "blank",
                "upgrades",
            ]
        },
        "Milestones":{
            content:[
                ["display-text",function() { return `You have <h2 style="color:rgb(0,60,235);text-shadow:0 0 10px rgb(0,60,235)">${format(player.p.points)}</h2> proton.`},{ "font-size":"15px"},],
                "blank",
                "prestige-button",
                "blank",
                "milestones"
            ],
        },
    },
    update(diff){
    },
    milestones:{
        0: {
            requirementDescription: "1 proton",
            done() { return player.p.points.gte(1)},
            effectDescription: `10x force gain, the exponent growth of "Positive" price is weaker.`,
        },
    }
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
                "blank",
                ["infobox","Genesis2"],
                "blank",
                ["infobox","Genesis3"],
                "blank",
                ["infobox","Genesis4"],
                "blank",
                ["infobox","Genesis5"],
            ]
        },
        "Chapter II":{
            content:[
                ["infobox","Quark1"],
                "blank",
                ["infobox","Quark2"],
                "blank",
                ["infobox","Quark3"],
                "blank",
                ["infobox","Quark4"],
                "blank",
                ["infobox","Quark5"],
                "blank",
            ],
            unlocked(){return player.q.unlocked},
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
            unlocked(){return hasUpgrade("g",11)||getBuyableAmount("g",11).gt(0)||player.q.unlocked}
        },
        Genesis3: {
            title: "Part III-Gravity",
            body() { return `The force is strong enough to pull each other together.<br>
                            These makes produce faster.` },
            style:{"width":"400px"},
            unlocked(){return getBuyableAmount("g",11).gt(0)||player.q.unlocked}
        },
        Genesis4: {
            title: "Part IV-Quantum",
            body() { return `Something strange things appeared in the void.<br>
                            Spend some force to catch it.` },
            style:{"width":"400px"},
            unlocked(){return hasUpgrade("g",25)||player.q.unlocked}
        },
        Genesis5: {
            title: "Part V-Vanish",
            body() { return `You caught a positive quantum and a negative one.<br>
                            They vanished immediately, but you fell the gravity is stronger.` },
            style:{"width":"400px"},
            unlocked(){return hasUpgrade("g",31)||player.q.unlocked}
        },
        Quark1: {
            title: "Part I-Quark",
            body() { return `Finally, the force is strong enough to stop quantums from vanishing.<br>
                            They merged up and created a new thing —— quark.<br>
                            You need more force to combined quarks together.<br>
                            Luckily, you can use all your genesis to create a quark.<br>
                            It can make force stronger.` },
            style:{"width":"400px"},
            unlocked(){return player.q.unlocked}
        },
        Quark2: {
            title: "Part II-Types",
            body() { return `You found that there're different specifics between quarks.<br>
                            You decided to divide them into 6 types:<br>
                            up,down,strange,charm,top and bottom.<br>
                            Your current force only allows you to create the basic and the lightest one————up quarks.` },
            style:{"width":"400px"},
            unlocked(){return hasMilestone("q",0)}
        },
        Quark3: {
            title: "Part III-Up and down",
            body() { return `You can generate down quarks now.<br>
                            Each type of quarks make force produce faster.<br>
                            Soon, you'll have your force exceed 1.<br>
                            But there's something slows down the production...` },
            style:{"width":"400px"},
            unlocked(){return hasMilestone("q",1)}
        },
        Quark4: {
            title: "Part IV-Strange and charm",
            body() { return `These two types are much heavier than the previous ones.<br>
                            It took you much forces to create them.<br>
                            The new types are very unstable that they can become up/down quark instantly.<br>
                            So their production are based on your up/down quark production.` },
            style:{"width":"400px"},
            unlocked(){return hasMilestone("q",3)}
        },
        Quark5: {
            title: "Part V-Top and bottom",
            body() { return `These two types are the rariest quarks.<br>
                            Their production are based on strange/charm production.<br>
                            They're so heavy that they could affect the lighter one's effect.<br>
                            Your quarks started to gathering, let's see what would happen...` },
            style:{"width":"400px"},
            unlocked(){return hasMilestone("q",5)}
        },
    },
})
