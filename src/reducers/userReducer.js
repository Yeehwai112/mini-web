import * as userAction from '../actions/user';

const { UPDATE_PLACE_SEARCH } = userAction

const defaultState = {
    search_List: []
};

export const userReducer = (state = defaultState, action) => {

    switch (action.type) {
        case UPDATE_PLACE_SEARCH:
            return {
                ...state,
                search_List: action.data 
            };

        default:
            return state;
    }
};

export default userReducer;