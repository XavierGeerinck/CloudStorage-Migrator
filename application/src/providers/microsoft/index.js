import * as API from './api';
import Configuration from './configuration';
import * as Handlers from './handlers';

class ProviderMicrosoft {
  static api = API;
  static configuration = Configuration;
  static handlers = Handlers;
}

export default ProviderMicrosoft;
