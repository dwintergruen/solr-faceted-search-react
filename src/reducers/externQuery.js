const initialState = {
	searchFields: [],
	sortFields: [],
	rows: 0,
	url: null,
	pageStrategy: null,
	start: null,
	group: null
};

const setQueryFields = (state, action) => {
	return {
		...state,
		searchFields: action.searchFields,
		sortFields: action.sortFields,
		url: action.url,
		rows: action.rows,
		pageStrategy: action.pageStrategy,
		start: action.start,
		group: action.group
	};
};

export default function(state=initialState, action) {
	switch (action.type) {
		case "SET_QUERY_FIELDS":
			return setQueryFields(state, action);
		case "SET_SEARCH_FIELDS":
			return {...state, searchFields: action.newFields, start: state.pageStrategy === "paginate" ? 0 : null};
		case "SET_SORT_FIELDS":
			return {...state, sortFields: action.newSortFields, start: state.pageStrategy === "paginate" ? 0 : null};
		case "SET_FILTERS":
			return {...state, filters: action.newFilters, start: state.pageStrategy === "paginate" ? 0 : null};
		case "SET_START":
			return {...state, start: action.newStart};
		case "SET_RESULTS": {
            var searchFields_new = {}
            for (let sf_key in state.searchFields)
			{
				 searchFields_new[state.searchFields[sf_key].field] = state.searchFields[sf_key];
			}

            for (let key in  action.data) {
                let value = action.data[key]
				if (searchFields_new[key]) {
                    searchFields_new[key].value = value;
                }

            };

            var searchField_new_list = [];
            for (let key in searchFields_new) {
            	searchField_new_list.push(searchFields_new[key])
			};

			state.searchFields = searchField_new_list;
            return action.data.nextCursorMark ? {...state, cursorMark: action.data.nextCursorMark} : state;
        	}
		case "SET_GROUP":
			return {...state, group: action.group};
	}

	return state;
}