import { combineReducers } from 'redux';

const initialState = {
    isAdmin: false,
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
            return state.map(task => {
                if (task.id === action.id) {
                    return { ...task, ...action.data};
                }
                return task;
            });

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
            return true;
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
