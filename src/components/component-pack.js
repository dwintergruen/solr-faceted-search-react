import Result from "./results/result";
import TextSearch from "./text-search";
import TextHighlightSearch from "./text-highlight-search";
import ListFacet from "./list-facet";
import PivotFacet from "./pivot-facet";
import ResultHeader from "./results/header";
import ResultList from "./results/list";
import ResultPending from "./results/pending";
import ResultContainer from "./results/container";
import ResultPagination from "./results/pagination";
import GroupResultPagination from "./results/grouppagination";
import PreloadIndicator from "./results/preload-indicator";
import GroupResult from "./results/groupresult";
import CsvExport from "./results/csv-export";
import SearchFieldContainer from "./search-field-container";
import RangeFacet from "./range-facet";
import Show from "./show";
import CountLabel from "./results/count-label";
import SortMenu from "./sort-menu";
import CurrentQuery from "./current-query";

export default {
	searchFields: {
		text: TextSearch,
		"text-highlight": TextHighlightSearch,
		"list-facet": ListFacet,
		"pivot-facet": PivotFacet,
		"range-facet": RangeFacet,
		"period-range-facet": RangeFacet,
		"show":Show,
		container: SearchFieldContainer,
		currentQuery: CurrentQuery
	},
	results: {
		result: Result,
		groupresult : GroupResult,
		resultCount: CountLabel,
		header: ResultHeader,
		list: ResultList,
		container: ResultContainer,
		pending: ResultPending,
		preloadIndicator: PreloadIndicator,
		csvExport: CsvExport,
		paginate: ResultPagination,
		grouppaginate: GroupResultPagination
	},
	sortFields: {
		menu: SortMenu
	}
};