## 1st Iteration

Created a base charachter class which has attributes like name, alignment, armor, class, experience and level. Implemented methods for attacking, damage and leveling up. Included ability scores such as strength, dexterity, constitution, wisdom, intelligence, and charisma and their Modifiers

## 2nd Iteration

Implemented Fighter class with increased hit points and attack bonuses. Created Rogue class which has triple damage on critical hits and dexterity-based attacks. Added a monk claass with wisdom bonus to armor class and unique attack strengths.
Added a Paladin class which has alignment restriction ans add bonus against evel opponents.

## 3rd Iteration

Extended Charachter class to include different races like Human, Orc, Dwarf, Elf and Halfing. Implemented racial ability score modifier like Orcs get +2 Strength, -1 Intelligence, Wisdom and Charisma. Added race-specific bonuses like Dwarves get bonuses against Orcs, Elves have increased critical hit range. Added class bonus calculation on top of charachter get ArmorClass method and then it cacluclates like if  Halflings get +2 AC against Non - Halflings

## 4th Iteration

In 4th iteration i have added new classes for Weapons, Armors , and items  with properties and values which are passed when creating a new object. 
Then I modified the Charachter class to include , Weapon, Armor and Shield Added the armorclass getter to account for equipped armor and shield. Also modified the attack method which will take in account weapon, armors and items abilities.