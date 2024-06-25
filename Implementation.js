class Character {
    constructor(name, race='Human') {
      this.name = name;
      this.alignment = 'Neutral';
      this.armorClass = 10;
      this.hitPoints = 5;
      this.experience = 0;
      this.level = 1;
      this.setRace(race);
      this.abilities = {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        wisdom: 10,
        intelligence: 10,
        charisma: 10
      };
      this.weapon = null;
      this.armor = null;
      this.shield = null;
      this.items = [];
    }

    equipWeapon(weapon) {
        this.weapon = weapon;
    }

    equipArmor(armor) {
        this.armor = armor;
    }

    equipShield(shield) {
        this.shield = shield;
    }

    addItem(item) {
        this.items.push(item);
    }

    setRace(race) {
        this.race = race;
        this.applyRacialTraits();
    }
  
    setAlignment(alignment) {
      const validAlignments = ['Good', 'Evil', 'Neutral'];
      if (validAlignments.includes(alignment)) {
        this.alignment = alignment;
      }
    }
  

    attack(opponent) {
        const roll = Math.floor(Math.random() * 20) + 1;
        let attackBonus = this.getAbilityModifier('strength') + Math.floor(this.level / 2);
        
        if (this.weapon) {
            attackBonus += this.weapon.attackBonus;
        }

        const totalRoll = roll + attackBonus;

        if (roll >= this.getCriticalRange() || totalRoll >= opponent.armorClass) {
            let damage = this.weapon ? this.weapon.damage : 1;
            damage += this.getAbilityModifier('strength');
            
            if (this.weapon) {
                damage += this.weapon.damageBonus;
            }

            if (roll >= this.getCriticalRange()) {
                damage *= (this.weapon && this.weapon.specialProperties.criticalMultiplier) 
                    ? this.weapon.specialProperties.criticalMultiplier 
                    : 2;
            }

            damage = Math.max(1, damage);
            opponent.takeDamage(damage);
            this.gainExperience(10);
            return true;
        }
        return false;
    }

  
    takeDamage(amount) {
      this.hitPoints -= amount;
      if (this.hitPoints <= 0) {
        this.hitPoints = 0;
        console.log(`${this.name} has died!`);
      }
    }
  
    getAbilityModifier(ability) {
      const score = this.abilities[ability];
      return Math.floor((score - 10) / 2);
    }
  
    gainExperience(amount) {
      this.experience += amount;
      while (this.experience >= this.level * 1000) {
        this.levelUp();
      }
    }
  
    levelUp() {
      this.level++;
      const hpIncrease = 5 + this.getAbilityModifier('constitution');
      this.hitPoints += Math.max(1, hpIncrease);
      console.log(`${this.name} has reached level ${this.level}!`);
    }
    applyRacialTraits() {
        // Default implementation for Human 
    }


    getCriticalRange() {
        return 20;  // Default critical range
    }   

    get armorClass() {
        let ac = 10; // Base AC
        if (this.armor) {
            ac += this.armor.armorClass;
        }
        if (this.shield) {
            ac += this.shield.armorClass;
        }
        ac += this.getAbilityModifier('dexterity');
        return ac;
    }
  }



class Weapon {
    constructor(name, damage, attackBonus = 0, damageBonus = 0) {
        this.name = name;
        this.damage = damage;
        this.attackBonus = attackBonus;
        this.damageBonus = damageBonus;
        this.specialProperties = {};
    }

    addSpecialProperty(propertyName, value) {
        this.specialProperties[propertyName] = value;
    }
}

class Armor {
    constructor(name, armorClass) {
        this.name = name;
        this.armorClass = armorClass;
        this.specialProperties = {};
    }

    addSpecialProperty(propertyName, value) {
        this.specialProperties[propertyName] = value;
    }
}

class Item {
    constructor(name) {
        this.name = name;
        this.effects = {};
    }

    addEffect(effectName, value) {
        this.effects[effectName] = value;
    }
}

  class Fighter extends Character {
    constructor(name) {
        super(name);
        this.hitPoints = 10;  // Start with 10 HP 
    }

    levelUp() {
        this.level++;
        const hpIncrease = 10 + this.getAbilityModifier('constitution');
        this.hitPoints += Math.max(1, hpIncrease);
        console.log(`${this.name} the Fighter has reached level ${this.level}!`);
    }

    attack(opponent) {
        const roll = Math.floor(Math.random() * 20) + 1;
        const attackBonus = this.getAbilityModifier('strength') + this.level;  // +1 per level
        const totalRoll = roll + attackBonus;

        if (roll === 20 || totalRoll >= opponent.armorClass) {
            let damage = 1 + this.getAbilityModifier('strength');
            if (roll === 20) damage *= 2;
            damage = Math.max(1, damage);
            opponent.takeDamage(damage);
            this.gainExperience(10);
            return true;
        }
        return false;
    }
}

class Rogue extends Character {
    constructor(name) {
        super(name);
        if (this.alignment === 'Good') {
            this.alignment = 'Neutral';  // Cannot have Good alignment
        }
    }

    setAlignment(alignment) {
        if (alignment !== 'Good') {
            super.setAlignment(alignment);
        }
    }

    attack(opponent) {
        const roll = Math.floor(Math.random() * 20) + 1;
        const attackBonus = this.getAbilityModifier('dexterity') + Math.floor(this.level / 2);
        const totalRoll = roll + attackBonus;
        
        const targetAC = opponent.armorClass - Math.max(0, opponent.getAbilityModifier('dexterity'));

        if (roll === 20 || totalRoll >= targetAC) {
            let damage = 1 + this.getAbilityModifier('dexterity');
            if (roll === 20) damage *= 3;  // Triple damage on critical
            damage = Math.max(1, damage);
            opponent.takeDamage(damage);
            this.gainExperience(10);
            return true;
        }
        return false;
    }
}

class Monk extends Character {
    constructor(name) {
        super(name);
        this.hitPoints = 6;  // Start with 6 HP 
    }

    levelUp() {
        this.level++;
        const hpIncrease = 6 + this.getAbilityModifier('constitution');
        this.hitPoints += Math.max(1, hpIncrease);
        console.log(`${this.name} the Monk has reached level ${this.level}!`);
    }

    attack(opponent) {
        const roll = Math.floor(Math.random() * 20) + 1;
        const attackBonus = this.getAbilityModifier('strength') + 
                            Math.floor(this.level / 2) + 
                            (this.level % 3 === 2 ? 1 : 0);  // +1 every 2nd and 3rd level
        const totalRoll = roll + attackBonus;

        if (roll === 20 || totalRoll >= opponent.armorClass) {
            let damage = 3 + this.getAbilityModifier('strength');  // 3 points of damage
            if (roll === 20) damage *= 2;
            damage = Math.max(1, damage);
            opponent.takeDamage(damage);
            this.gainExperience(10);
            return true;
        }
        return false;
    }

    get armorClass() {
        return super.armorClass + Math.max(0, this.getAbilityModifier('wisdom'));
    }
}

class Paladin extends Character {
    constructor(name) {
        super(name);
        this.hitPoints = 8;  // Start with 8 HP 
        this.alignment = 'Good';  // Can only have Good alignment
    }

    setAlignment(alignment) {
        if (alignment === 'Good') {
            super.setAlignment(alignment);
        }
    }

    levelUp() {
        this.level++;
        const hpIncrease = 8 + this.getAbilityModifier('constitution');
        this.hitPoints += Math.max(1, hpIncrease);
        console.log(`${this.name} the Paladin has reached level ${this.level}!`);
    }

    attack(opponent) {
        const roll = Math.floor(Math.random() * 20) + 1;
        const attackBonus = this.getAbilityModifier('strength') + this.level;  // +1 per level
        const totalRoll = roll + attackBonus;

        if (roll === 20 || totalRoll >= opponent.armorClass) {
            let damage = 1 + this.getAbilityModifier('strength');
            if (opponent.alignment === 'Evil') {
                damage += 2;
                if (roll === 20) damage *= 3;  // Triple damage when critting on Evil
            } else if (roll === 20) {
                damage *= 2;
            }
            damage = Math.max(1, damage);
            opponent.takeDamage(damage);
            this.gainExperience(10);
            return true;
        }
        return false;
    }
}

class Orc extends Character {
    constructor(name) {
        super(name, 'Orc');
    }

    applyRacialTraits() {
        this.abilities.strength += 2;
        this.abilities.intelligence -= 1;
        this.abilities.wisdom -= 1;
        this.abilities.charisma -= 1;
        this.armorClass += 2;
    }
}

class Dwarf extends Character {
    constructor(name) {
        super(name, 'Dwarf');
    }

    applyRacialTraits() {
        this.abilities.constitution += 1;
        this.abilities.charisma -= 1;
    }

    levelUp() {
        super.levelUp();
        if (this.getAbilityModifier('constitution') > 0) {
            this.hitPoints += this.getAbilityModifier('constitution');
        }
    }

    attack(opponent) {
        let attackRoll = super.attack(opponent);
        if (opponent.race === 'Orc') {
            attackRoll += 2;
        }
        return attackRoll;
    }
}

class Elf extends Character {
    constructor(name) {
        super(name, 'Elf');
    }

    applyRacialTraits() {
        this.abilities.dexterity += 1;
        this.abilities.constitution -= 1;
    }

    getCriticalRange() {
        return 19;  // Increases critical hit range
    }

    get armorClass() {
        let ac = super.armorClass;
        if (this.lastAttacker && this.lastAttacker.race === 'Orc') {
            ac += 2;
        }
        return ac;
    }
}

class Halfling extends Character {
    constructor(name) {
        super(name, 'Halfling');
    }

    applyRacialTraits() {
        this.abilities.dexterity += 1;
        this.abilities.strength -= 1;
    }

    setAlignment(alignment) {
        if (alignment !== 'Evil') {
            super.setAlignment(alignment);
        }
    }

    get armorClass() {
        let ac = super.armorClass;
        if (this.lastAttacker && this.lastAttacker.race !== 'Halfling') {
            ac += 2;
        }
        return ac;
    }   
}

//1st Iteration usage
const hero = new Character("Aragorn");
hero.setAlignment("Good");
hero.abilities.strength = 15;

const enemy = new Character("Orc");
enemy.setAlignment("Evil");

console.log(hero.attack(enemy) ? "Hit!" : "Miss!");

//2nd Iteration usage
const fighter = new Fighter("Aragorn");
const rogue = new Rogue("Bilbo");
const monk = new Monk("Bruce Lee");
const paladin = new Paladin("Galahad");

const enemy = new Character("Orc");
enemy.setAlignment("Evil");

console.log(fighter.attack(enemy) ? "Fighter hits!" : "Fighter misses!");
console.log(rogue.attack(enemy) ? "Rogue hits!" : "Rogue misses!");
console.log(monk.attack(enemy) ? "Monk hits!" : "Monk misses!");
console.log(paladin.attack(enemy) ? "Paladin hits!" : "Paladin misses!");

//3rd Iteration Usage

const human = new Character("Bob");  // Default race is Human
const orc = new Orc("Grug");
const dwarf = new Dwarf("Gimli");
const elf = new Elf("Legolas");
const halfling = new Halfling("Frodo");

console.log(human.race);  // Output: "Human"
console.log(orc.abilities.strength);  // Output: 12 (10 + 2)
console.log(dwarf.hitPoints);  // Output will depend on Constitution modifier
console.log(elf.getCriticalRange());  // Output: 19
console.log(halfling.armorClass);  // Output will be higher when attacked by non-Halflings

console.log(dwarf.attack(orc) ? "Dwarf hits Orc!" : "Dwarf misses Orc!");

elf.lastAttacker = orc;
console.log(elf.armorClass);  // Should be 2 higher than normal

halfling.setAlignment('Evil');  // This should not work
console.log(halfling.alignment);  // Should not be 'Evil'

//4h Iteration Usage
const longsword = new Weapon("Longsword", 5);
const plateArmor = new Armor("Plate Armor", 8);
plateArmor.addSpecialProperty("classRestriction", ["Fighter"]);
plateArmor.addSpecialProperty("raceRestriction", ["Dwarf"]);
const shield = new Armor("Shield", 3);
shield.addSpecialProperty("attackPenalty", -4);
shield.addSpecialProperty("fighterAttackPenalty", -2);
const ringOfProtection = new Item("Ring of Protection");
ringOfProtection.addEffect("armorClass", 2);

const beltOfGiantStrength = new Item("Belt of Giant Strength");
beltOfGiantStrength.addEffect("strength", 4);

const hero = new Fighter("Hero");
hero.equipWeapon(longsword);
hero.equipArmor(plateArmor);
hero.equipShield(shield);
hero.addItem(ringOfProtection);
hero.addItem(beltOfGiantStrength);

console.log(hero);  