import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, map } from 'rxjs';

export interface Rating {
  name: string;
  Chile: { label: string, rating: number };
  Dominican_Republic: { label: string, rating: number };
  Guadeloupe: { label: string, rating: number };
  Paraguay: { label: string, rating: number };
  Fiji: { label: string, rating: number };
  Bulgaria: { label: string, rating: number };
  Czech_Republic: { label: string, rating: number };
  Finland: { label: string, rating: number };
  France: { label: string, rating: number };
  Hungary: { label: string, rating: number };
  Iceland: { label: string, rating: number };
  Switzerland: { label: string, rating: number };
  isSelected: boolean;
}

export interface Convention {
  label: string;
  src: string;
  total_rating: number;
  color?: string;
}

@Component({
  selector: 'app-special-convention',
  templateUrl: './special-convention.page.html',
  styleUrls: ['./special-convention.page.scss'],
})
export class SpecialConventionPage implements OnInit {

  allRatings$: BehaviorSubject<Array<Rating>> = new BehaviorSubject([]);

  allConventions: Array<Convention> = [
    {
      label: 'Chile (Santiago)',
      src: '/assets/images/chile.png',
      total_rating: 0,
      color: '#FF7D43'
    },
    {
      label: 'Dominican Republic (Santo Domingo)',
      src: '/assets/images/DominicanRepublic.png',
      total_rating: 0,
      color: '#DB2B3E'
    },
    {
      label: 'Guadeloupe (Baie-Mahault)',
      src: '/assets/images/Guadeloupe.png',
      total_rating: 0,
      color: '#4D8F3D'
    },
    {
      label: 'Paraguay (Asunción)',
      src: '/assets/images/Paraguay.png',
      total_rating: 0,
      color: '#B01B0A'
    },
    {
      label: 'Fiji (Suva)',
      src: '/assets/images/Fiji.png',
      total_rating: 0,
      color: '#8E5C49'
    },
    {
      label: 'Bulgaria (Sofia)',
      src: '/assets/images/Bulgaria.png',
      total_rating: 0,
      color: '#BD2F28'
    },
    {
      label: 'Czech Republic (Prague)',
      src: '/assets/images/Czech Republic.png',
      total_rating: 0,
      color: '#00728D'
    },
    {
      label: 'Finland (Helsinki)',
      src: '/assets/images/Finland.png',
      total_rating: 0,
      color: '#0073BC'
    },
    {
      label: 'France (Lyon)',
      src: '/assets/images/France.png',
      total_rating: 0,
      color: '#608954'
    },
    {
      label: 'Hungary (Budapest)',
      src: '/assets/images/Hungary.png',
      total_rating: 0,
      color: '#C37C36'
    },
    {
      label: 'Iceland (Reykjavík)',
      src: '/assets/images/Iceland.png',
      total_rating: 0,
      color: '#7C6399'
    },
    {
      label: 'Switzerland (Zürich)',
      src: '/assets/images/Switzerland.png',
      total_rating: 0,
      color: '#386539'
    },
  ]


  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.getAllRatings().subscribe((res) => {
      console.log('res', res);
      const allratings: Array<Rating> = <Array<Rating>>res;
      if (allratings) {
        this.allRatings$.next(allratings);
      }
    });
  }

  getAllRatings() {
    return this.afs.collection('convention').valueChanges();
  }

  updateRating(rating: Rating) {
    const docRef = this.afs.collection('convention').doc(rating.name)
    return docRef.set(rating, { merge: true });
  }

  onAddMember() {
    const rating: Rating =
    {
      name: 'Melissa',
      Chile: { label: 'Chile (Santiago)', rating: 2 },
      Dominican_Republic: { label: 'Dominican Republic (Santo Domingo)', rating: 1 },
      Guadeloupe: { label: 'Guadeloupe (Baie-Mahault)', rating: 2 },
      Paraguay: { label: 'Paraguay (Asunción)', rating: 2 },
      Fiji: { label: 'Fiji (Suva)', rating: 1 },
      Bulgaria: { label: 'Bulgaria (Sofia)', rating: 3 },
      Czech_Republic: { label: 'Czech Republic (Prague)', rating: 5 },
      Finland: { label: 'Finland (Helsinki)', rating: 5 },
      France: { label: 'France (Lyon)', rating: 3 },
      Hungary: { label: 'Hungary (Budapest)', rating: 3 },
      Iceland: { label: 'Iceland (Reykjavík)', rating: 4 },
      Switzerland: { label: 'Switzerland (Zürich)', rating: 5 },
      isSelected: false
    }
    this.updateRating(rating);

  }

  recalculateTotalRating() {
    console.log('recalculating rating');
    // First, reset all total_ratings to 0 in allConventions
    this.allConventions.forEach(convention => convention.total_rating = 0);

    // Fetch the current value of allRatings$ (note: you might also consider using allRatings$.getValue() directly)
    const allRatings = this.allRatings$.getValue();

    // For each rating that is selected, add its value to the corresponding Convention
    allRatings.forEach(rating => {
      if (rating.isSelected) {
        // Iterate through all keys of a rating object (excluding name and isSelected)
        Object.keys(rating).forEach(key => {
          if (key !== 'name' && key !== 'isSelected') {
            // Find the convention that matches the rating's key and add the rating value
            const convention = this.allConventions.find(con => con.label.includes(key));
            if (convention) {
              convention.total_rating += rating[key].rating;
            }
          }
        });
      }
    });

    // Sort allConventions in descending order based on total_rating
    this.allConventions.sort((a, b) => b.total_rating - a.total_rating);
  }


}
