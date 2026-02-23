import { CreateBandRequest } from "./createBand-request";
import { CreatePersonRequest } from "./createPerson-request";
import { CreateSimpleDateRequest } from "./createSimpleDate-request"


export interface CreateArtistRequest {
  id: number;
  type: 'PERSON' | 'BAND';
  startDate: CreateSimpleDateRequest;
  endDate: CreateSimpleDateRequest;
  person?: CreatePersonRequest;
  band?: CreateBandRequest;
}