import { Injectable } from '@angular/core';
import { Ability } from '../interfaces/ability.interface';
import { SkillTraits } from '../interfaces/skills-traits.interface';

@Injectable({
  providedIn: 'root'
})
export class EncylopediaService {

  // AbilitiesTitle is used for the Prerequisite system
  characterSelectedAbilities: Array<Ability> = [];
  // characterSelectedSkills and Trais is used to seperate the two and do a ngForLoop to display their respective panles;
  characterSelectedSkills: Array<SkillTraits> = [];
  characterSelectedTraits: Array<SkillTraits> = [];

  constructor() { }
}
