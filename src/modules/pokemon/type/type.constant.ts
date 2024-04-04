export interface ITypeConstant {
  id: number;
  name: string;
  backgroundColor: string;
  textColor: string;
}
export const TYPE_COLORS: ITypeConstant[] = [
  { id: 1, name: 'grass', backgroundColor: '#b9cc50', textColor: '#8b4513'},
  { id: 2, name: 'poison', backgroundColor: '#8b008b', textColor: '#f5f5f5'},
  { id: 3, name: 'fire', backgroundColor: '#ff2400', textColor: '#fff'},
  { id: 4, name: 'flying', backgroundColor: '#3dc7ef', textColor: '#424242'},
  { id: 5, name: 'water', backgroundColor: '#72c8dd', textColor: '#fff'},
  { id: 6, name: 'bug', backgroundColor: '#482d53', textColor: '#b5d7a7'},
  { id: 7, name: 'normal', backgroundColor: '#fff', textColor: '#000'},
  { id: 8, name: 'electric', backgroundColor: '#ffff40', textColor: '#0000ff'},
  { id: 9, name: 'ground', backgroundColor: '#bc5e00', textColor: '#f5f5f5'},
  { id: 10, name: 'fairy', backgroundColor: '#c8a2c8', textColor: '#cb3fa0'},
  { id: 11, name: 'fighting', backgroundColor: '#d56723', textColor: '#fff'},
  { id: 12, name: 'psychic', backgroundColor: '#f366b9', textColor: '#fff'},
  { id: 13, name: 'rock', backgroundColor: '#a38c21', textColor: '#fff'},
  { id: 14, name: 'steel', backgroundColor: '#9eb7b8', textColor: '#fff'},
  { id: 15, name: 'ice', backgroundColor: '#51c4e7', textColor: '#fff'},
  { id: 16, name: 'ghost', backgroundColor: '#7b62a3', textColor: '#fff'},
  { id: 17, name: 'dragon', backgroundColor: '#FF8C00', textColor: '#fff'},
  { id: 18, name: 'dark', backgroundColor: '#707070', textColor: '#fff'},
];