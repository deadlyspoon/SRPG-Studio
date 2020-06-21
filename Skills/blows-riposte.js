/*
	Version 1.0
	Made by MarkyJoe, inspired by LadyRena's Blow and Riposte Skills Scripts
	
	This script adds two separate skills. Blow Skills and Riposte Skills.
	Blow Skills give bonuses to your battle stats when you initiate battle.
	Riposte skills do the same thing, but when someone initiate battle on YOU.
	
	Instead of a pre-defined list of bonuses, you define the bonuses yourself
	using custom parameters.
	
	How To Use:
	- Create a skill with the "custom" radio checked
	- Click the Skill Effects field. This will bring up a window.
	- If you want the bonuses when you initiate battle, set the name to "Blow-Skill"
	- If you want the bonuses when an enemy initiates on you instead, use "Riposte-Skill"
	- Click "OK" and then click custom parameters.
	- Set the bonuses you want. Example:
		{
			attack: 2,
			defense: 1,
			hit: 3,
			avoid: 4,
			critical: 10,
			criticalAvoid: 20,
			attackCount: 1,
			agility: 5
		}
	- Hit okay and then you're done!
	
	Custom Parameters:
	All custom parameters are optional.
	
	attack
	Increases damage dealt
	
	defense
	Decreases damage taken
	
	hit
	Increases attack accuracy
	
	avoid
	Increases chances of avoiding attacks
	
	critical
	Increases the chances of landing a critical hit
	
	criticalAvoid
	Decreases the chances of taking a critical hit
	
	agility
	Increases user's agility. If pursuit is enabled and they
	have enough agility, the user will do a follow up attack
	
	attackCount
	number of ADDITIONAL attacks the user will do
	
*/


(function () {
	var isBlowBonus = function(unit) {
		var unitType = unit.getUnitType();
		var turnType = root.getCurrentSession().getTurnType();
		
		if (unitType == turnType && root.getCurrentScene() != SceneType.REST) {
			return true;
		}
		return false;
	}
	
	var isRiposteBonus = function(unit) {
		var unitType = unit.getUnitType();
		var turnType = root.getCurrentSession().getTurnType();
		
		if (unitType != turnType && root.getCurrentScene() != SceneType.REST) {
			return true;
		}
		return false;
	}
	
	var alias1 = SkillRandomizer.isCustomSkillInvokedInternal;
	SkillRandomizer.isCustomSkillInvokedInternal = function(active, passive, skill, keyword) {
		if (keyword === 'Blow-Skill') {
			return this._isSkillInvokedInternal(active, passive, skill);
		}
		if (keyword === 'Riposte-Skill') {
			return this._isSkillInvokedInternal(active, passive, skill);
		}
		
		return alias1.call(this, active, passive, skill, keyword);
	}
	
	var alias2 = DamageCalculator.calculateAttackPower;
	DamageCalculator.calculateAttackPower = function(active, passive, weapon, isCritical, totalStatus, trueHitValue) {
		var pow = alias2.call(this, active, passive, weapon, isCritical, totalStatus, trueHitValue);
		
		var skillArray = SkillControl.getDirectSkillArray(active, SkillType.CUSTOM, "Blow-Skill");
		for (i = 0; i < skillArray.length; i++) {
			if (isBlowBonus(active) && skillArray[i].skill.custom.attack != undefined) {
				pow += skillArray[i].skill.custom.attack;
			}
		}
		
		var skillArray = SkillControl.getDirectSkillArray(active, SkillType.CUSTOM, "Riposte-Skill");
		for (i = 0; i < skillArray.length; i++) {
			if (isRiposteBonus(active) && skillArray[i].skill.custom.attack != undefined) {
				pow += skillArray[i].skill.custom.attack;
			}
		}
		
		return pow;
	}
	
	var alias3 = DamageCalculator.calculateDefense;
	DamageCalculator.calculateDefense = function (active, passive, weapon, isCritical, totalStatus, trueHitValue) {
		var def = alias3.call(this, active, passive, weapon, isCritical, totalStatus, trueHitValue);
		
		var skillArray = SkillControl.getDirectSkillArray(passive, SkillType.CUSTOM, "Blow-Skill");
		for (i = 0; i < skillArray.length; i++) {
			if (isBlowBonus(passive) && skillArray[i].skill.custom.defense != undefined) {
				def += skillArray[i].skill.custom.defense;
			}
		}
		
		var skillArray = SkillControl.getDirectSkillArray(passive, SkillType.CUSTOM, "Riposte-Skill");
		for (i = 0; i < skillArray.length; i++) {
			if (isRiposteBonus(passive) && skillArray[i].skill.custom.defense != undefined) {
				def += skillArray[i].skill.custom.defense;
			}
		}
		
		return def;
	}
	
	var alias4 = HitCalculator.calculateSingleHit;
	HitCalculator.calculateSingleHit = function(active, passive, weapon, totalStatus) {
		var hit = alias4.call(this, active, passive, weapon, totalStatus);
		
		var skillArray = SkillControl.getDirectSkillArray(active, SkillType.CUSTOM, "Blow-Skill");
		for (i = 0; i < skillArray.length; i++) {
			if (isBlowBonus(active) && skillArray[i].skill.custom.hit != undefined) {
				hit += skillArray[i].skill.custom.hit;
			}
		}
		
		var skillArray = SkillControl.getDirectSkillArray(active, SkillType.CUSTOM, "Riposte-Skill");
		for (i = 0; i < skillArray.length; i++) {
			if (isRiposteBonus(active) && skillArray[i].skill.custom.hit != undefined) {
				hit += skillArray[i].skill.custom.hit;
			}
		}
		
		return hit;
	}
	
	var alias5 = HitCalculator.calculateAvoid;
	HitCalculator.calculateAvoid = function(active, passive, weapon, totalStatus) {
		var avo = alias5.call(this, active, passive, weapon, totalStatus);
		
		var skillArray = SkillControl.getDirectSkillArray(passive, SkillType.CUSTOM, "Blow-Skill");
		for (i = 0; i < skillArray.length; i++) {
			if (isBlowBonus(passive) && skillArray[i].skill.custom.avoid != undefined) {
				avo += skillArray[i].skill.custom.avoid;
			}
		}
		
		var skillArray = SkillControl.getDirectSkillArray(passive, SkillType.CUSTOM, "Riposte-Skill");
		for (i = 0; i < skillArray.length; i++) {
			if (isRiposteBonus(passive) && skillArray[i].skill.custom.avoid != undefined) {
				avo += skillArray[i].skill.custom.avoid;
			}
		}
		
		return avo;
	}
	
	var alias6 = CriticalCalculator.calculateSingleCritical;
	CriticalCalculator.calculateSingleCritical = function (active, passive, weapon, totalStatus) {
		var crit = alias6.call(this, active, passive, weapon, totalStatus);
		
		var skillArray = SkillControl.getDirectSkillArray(active, SkillType.CUSTOM, "Blow-Skill");
		for (i = 0; i < skillArray.length; i++) {
			if (isBlowBonus(active) && skillArray[i].skill.custom.critical != undefined) {
				crit += skillArray[i].skill.custom.critical;
			}
		}
		
		var skillArray = SkillControl.getDirectSkillArray(active, SkillType.CUSTOM, "Riposte-Skill");
		for (i = 0; i < skillArray.length; i++) {
			if (isRiposteBonus(active) && skillArray[i].skill.custom.critical != undefined) {
				crit += skillArray[i].skill.custom.critical;
			}
		}
		
		return crit;
	}
	
	var alias7 = CriticalCalculator.calculateCriticalAvoid;
	CriticalCalculator.calculateCriticalAvoid = function(active, passive, weapon, totalStatus) {
		var cavo = alias7.call(this, active, passive, weapon, totalStatus)
		
		var skillArray = SkillControl.getDirectSkillArray(passive, SkillType.CUSTOM, "Blow-Skill");
		for (i = 0; i < skillArray.length; i++) {
			if (isBlowBonus(passive) && skillArray[i].skill.custom.criticalAvoid != undefined) {
				cavo += skillArray[i].skill.custom.criticalAvoid;
			}
		}
		
		var skillArray = SkillControl.getDirectSkillArray(passive, SkillType.CUSTOM, "Riposte-Skill");
		for (i = 0; i < skillArray.length; i++) {
			if (isRiposteBonus(passive) && skillArray[i].skill.custom.criticalAvoid != undefined) {
				cavo += skillArray[i].skill.custom.criticalAvoid;
			}
		}
		
		return cavo;
	}
	
	var alias8 = Calculator.calculateAttackCount;
	Calculator.calculateAttackCount = function(active, passive, weapon) {
		var cnt = alias8.call(this, active, passive, weapon);
		
		var skillArray = SkillControl.getDirectSkillArray(active, SkillType.CUSTOM, "Blow-Skill");
		for (i = 0; i < skillArray.length; i++) {
			if (isBlowBonus(active) && skillArray[i].skill.custom.attackCount != undefined) {
				cnt += skillArray[i].skill.custom.attackCount;
			}
		}
		
		var skillArray = SkillControl.getDirectSkillArray(active, SkillType.CUSTOM, "Riposte-Skill");
		for (i = 0; i < skillArray.length; i++) {
			if (isRiposteBonus(active) && skillArray[i].skill.custom.attackCount != undefined) {
				cnt += skillArray[i].skill.custom.attackCount;
			}
		}
		
		return cnt
	}
	
	var alias9 = AbilityCalculator.getAgility;
	AbilityCalculator.getAgility = function (unit, weapon) {
		var agi = alias9.call(this, unit, weapon);
		
		var skillArray = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "Blow-Skill");
		for (i = 0; i < skillArray.length; i++) {
			if (isBlowBonus(unit) && skillArray[i].skill.custom.agility != undefined) {
				agi += skillArray[i].skill.custom.agility;
			}
		}
		
		var skillArray = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "Riposte-Skill");
		for (i = 0; i < skillArray.length; i++) {
			if (isRiposteBonus(unit) && skillArray[i].skill.custom.agility != undefined) {
				agi += skillArray[i].skill.custom.agility;
			}
		}
		
		return agi;
	}
	
}) ();