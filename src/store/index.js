import { combineReducers } from 'redux';
const config = {
    login: 'admin',
    password: '123',
}

const initialState = {
    isAdmin: true,
    tasks: [],
    total: 0,
    loadingStatus: 'fetching',
}

function updateTasks(state = initialState.tasks, action) {
    switch (action.type) {
        case 'create':
            return [
                ...state,
                action.data
            ];

        case 'edit':
            const res =  state.map(task => {
                if (task.id === action.id) {
                    return { ...task, ...action.data};
                }
                return task;
            });
            return res;

        case 'updateAll':
            return action.list;
    }
    return state;
}

function getLoadingState(state = initialState.loadingStatus, action) {
    switch (action.type) {
        case 'loading':
            return action.loadingStatus;
    }
    return state;
}

function authorize(state = initialState.isAdmin, action) {

    switch (action.type) {
        case 'signIn':
          const { data } = action;

            if (data.password === config.password && data.login === config.login) {
                return true;
            } else {
                return false;
            }
    }

    return state;
}
function updateTotal(state = initialState.total, action) {

    switch (action.type) {
        case 'updateTotal':
            return action.total;
    }

    return state;
}


export default combineReducers({
    isAdmin: authorize,
    tasks: updateTasks,
    loadingStatus: getLoadingState,
    total: updateTotal,
})
