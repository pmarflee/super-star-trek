import Prando from 'prando';

export const quadrantNames = shuffleInPlace([
    'Aaamazzara',
    'Altair IV',
    'Aurelia',
    'Bajor',
    'Benthos',
    'Borg Prime',
    'Cait',
    'Cardassia Prime',
    'Cygnia Minor',
    'Daran V',
    'Duronom',
    'Dytallix B',
    'Efros',
    'El-Adrel IV',
    'Epsilon Caneris III',
    'Ferenginar',
    'Finnea Prime',
    'Freehaven',
    'Gagarin IV',
    'Gamma Trianguli VI',
    'Genesis',
    'H\'atoria',
    'Holberg 917-G',
    'Hurkos III',
    'Iconia',
    'Ivor Prime',
    'Iyaar',
    'Janus VI',
    'Jouret IV',
    'Juhraya',
    'Kabrel I',
    'Kelva',
    'Ktaris',
    'Ligillium',
    'Loval',
    'Lyshan',
    'Magus III',
    'Matalas',
    'Mudd',
    'Nausicaa',
    'New Bajor',
    'Nova Kron',
    'Ogat',
    'Orion III',
    'Oshionion Prime',
    'Pegos Minor',
    'P\'Jem',
    'Praxillus',
    'Qo\'noS',
    'Quadra Sigma III',
    'Quazulu VIII',
    'Rakosa V',
    'Rigel VII',
    'Risa',
    'Romulus',
    'Rura Penthe',
    'Sauria',
    'Sigma Draconis',
    'Spica',
    'Talos IV',
    'Tau Alpha C',
    'Ti\'Acor',
    'Udala Prime',
    'Ultima Thule',
    'Uxal',
    'Vacca VI',
    'Volan II',
    'Vulcan',
    'Wadi',
    'Wolf 359',
    'Wysanti',
    'Xanthras III',
    'Xendi Sabu',
    'Xindus',
    'Yadalla Prime',
    'Yadera II',
    'Yridian',
    'Zalkon',
    'Zeta Alpha II',
    'Zytchin III'
], new Prando());

function shuffleInPlace<T>(array: T[], rng: Prando): T[] {
  // if it's 1 or 0 items, just return
  if (array.length <= 1) return array;

  // For each index in array
  for (let i = 0; i < array.length; i++) {

    // choose a random not-yet-placed item to place there
    // must be an item AFTER the current item, because the stuff
    // before has all already been placed
    const randomChoiceIndex = rng.nextInt(i, array.length - 1);

    // place our random choice in the spot by swapping
    [array[i], array[randomChoiceIndex]] = [array[randomChoiceIndex], array[i]];
  }

  return array;
}
