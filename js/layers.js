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
        if (layers[resettingLayer].row > this.row) {
            player.subtabs.g.mainTabs="Main"
            layerDataReset("g", keep)
        }
    },
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
                ["buyables",[1]],
            ]
        },
        "Quantum":{
            content:[
                ["display-text",function() { return `You have <h2 style="color:#DDDDDD;text-shadow:0 0 10px #DDDDDD">${format(player.g.points)}</h2> genesis, producing <h2 style="color:#DDDDDD;text-shadow:0 0 10px #DDDDDD">${format(getPointGen())}</h2> force/s.`},{ "font-size":"15px"},],
                "blank",
                "prestige-button",
                "blank",
                ["buyables",[2]],
            ],
            unlocked(){return hasUpgrade("g",25)}
        }
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
            effect(){return player.g.points.add(1).ln().pow(hasUpgrade("g",16)?1.6:1.44).add(1).times(hasMilestone("q",2)?tmp.q.quarkboost[3]:1)},
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
            effectDisplay(){return this.effect().eq(1)?`Currently:+0.30(Hard capped)`:`Currently:+${format(upgradeEffect("g",23))}`},
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
            effect(){return getBuyableAmount("g",21).add(1).pow(2).div(10)},
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
                return hasUpgrade("g",33)&&player.q.unlocked
            },
            canAfford(){return player.g.points.gte(1e38)&&player.points.gt("1e-39")},
            pay(){return player.g.points=player.g.points.minus(1e38)},
        },
    },
    buyables:{
        11:{
            title:"Gravitational field",
            cost(x) { return Decimal.pow(10,Decimal.pow(x,1.5)).div(hasUpgrade("g",24)?upgradeEffect("g",24):1).div(hasMilestone("q",1)?tmp.q.quarkboost[2]:1)},
            effect(x) { return Decimal.pow(3,x.add(buyableEffect("g",22)))},
            display() { return `Reset genesis,force,and `+(hasUpgrade("q",14)?``:`first 9 genesis upgrades`)+` to boost genesis and force gain.
                                Next at: ${format(this.cost())} genesis
                                Amount: ${format(getBuyableAmount("g",11))}
                                Effect: x${format(this.effect())}` },
            canAfford() { return player.g.points.gte(this.cost()) },
            buy(){
                if(!tmp.g.buyables[11].canAfford) return
                if(!hasUpgrade("q",14)) player.g.upgrades = player.g.upgrades.filter(item => item > "24");
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
        21:{
            title:"Positive",
            cost(x) { return Decimal.pow(10,Decimal.pow(x.add(1),1.25)).times("8e-32")},
            effect(x) { 
                let base=new Decimal(5)
                if(hasUpgrade("q",11)) base=base.add(1.5)
                return Decimal.pow(base,x)
            },
            display() { return `Boost force gain.
                                Cost: ${format(this.cost())} force
                                Amount: ${format(getBuyableAmount("g",21))}
                                Effect: x${format(this.effect())}` },
            canAfford() { return player.points.gte(this.cost()) },
            buy(){
                if(!tmp.g.buyables[21].canAfford) return
                player.points=player.points.sub(this.cost())
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
            canAfford() { return player.points.gte(this.cost()) },
            buy(){
                if(!tmp.g.buyables[22].canAfford) return
                player.points=player.points.sub(this.cost())
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
            canAfford() { return player.points.gte(this.cost()) },
            buy(){
                if(!tmp.g.buyables[23].canAfford) return
                player.points=player.points.sub(this.cost())
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
            cost(x) { return Decimal.pow(15,x.add(1).pow(0.5)).pow(2).times(1000) },
            effect(x) {Decimal.pow(x.add(1).log10().add(2),x)},
            display() { return `Boost first 3 types of quarks gain.
                                Cost: ${format(this.cost())} force
                                Amount: ${format(getBuyableAmount("g",31))}
                                Effect: x${format(this.effect())}` },
            canAfford() { return player.points.gte(this.cost()) },
            buy(){
                if(!tmp.g.buyables[31].canAfford) return
                player.points=player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
                if(!tmp.g.buyables[31].canAfford) return
                let tb = player.points.max(1).div(1000).sqrt().log(15).pow(2).sub(1)
                let tg = tb.plus(1).floor()
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(tg))
            },
            unlocked(){return hasUpgrade("g",34)},
            style:{"height":"150px","width":"150px","font-size":"15px","border-radius":"5%"}
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
            ],
            unlocked(){return hasMilestone("q",0)}
        },
    },
    update(diff){
        player.q.upquark=player.q.upquark.add(tmp.q.quarkgen[1].times(diff))
        player.q.downquark=player.q.downquark.add(tmp.q.quarkgen[2].times(diff))
        player.q.strangequark=player.q.strangequark.add(tmp.q.quarkgen[3].times(diff))
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
            upgen=upgen.times(buyableEffect("g",31))
        }
        if(hasMilestone("q",1)){
            downgen=player.q.points.pow(0.3333)
            if(hasUpgrade("q",15)) downgen=downgen.times(upgradeEffect("q",15))
            downgen=downgen.times(buyableEffect("g",31))
        }
        if(hasMilestone("q",2)){
            strangegen=upgen.pow(0.25)
            if(hasUpgrade("q",21)) strangegen=strangegen.times(upgradeEffect("q",21))
            strangegen=strangegen.times(buyableEffect("g",31))
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
        }
        if(hasMilestone("q",1)){
            downboost=player.q.downquark.add(1).pow(0.5)
        }
        if(hasMilestone("q",2)){
            strangeboost=Decimal.pow(1.5,player.q.strangequark.add(1).log10().pow(1.5))
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
            description(){return `Keep genesis upgrades on quark rest.`},
            cost(){return new Decimal(300)},
            unlocked(){ 
                return hasUpgrade("q",14)||hasUpgrade("q",15)
            },
            canAfford(){return player.q.points.gte(300)},
            pay(){return player.q.points=player.q.points.minus(300)},
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
            requirementDescription: "75 quark & 1e8 force",
            done() { return player.q.points.gte(75)&&player.points.gte(1e8)},
            effectDescription: "Start to generate strangequarks.",
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
    },
})
