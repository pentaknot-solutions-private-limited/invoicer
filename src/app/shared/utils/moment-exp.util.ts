import * as moment from "moment";

function exp(){return}
export function evalMomentExp(expString): moment.Moment{
      const functionString = `function(exp){ return ${expString} }`
      return Function('"use strict";return (' + functionString + ')')()(
          moment
      );
}