module.exports = function (state, action) {

     var newstate = Object.assign({}, state);
     switch (action.type) {

         case constants.CLEAR_ALL_PAGES_TRY:
             newstate.current.loading = true;
             newstate.my.loading = true;
			 
         case constants.FETCH_SERVICEORDER_STATUSES_DONE:
             newstate.statuses = action.data;
             return newstate;

        case constants.FETCH_SOLOGS_DONE:
            newstate.sologs.results = action.data;
            newstate.sologs.loading = false;
            newstate.sologs.initLoad = false;
            return newstate;

        case constants.CLEAR_SOLOGS_TRY:
            newstate.sologs.results = [];
            newstate.sologs.loading = true;
            newstate.sologs.initLoad = true;
            return newstate;

         default:
             return state || initialState
     }
}