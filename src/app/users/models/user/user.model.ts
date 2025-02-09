export interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  address: {
    address: string;
    city: string;
  };
}
