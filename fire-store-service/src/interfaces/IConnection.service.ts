export interface IConnectionService {
  // connectDB(): Promise<string>; //method style signature
  connectDB: () => Promise<string>; // property signature
}
