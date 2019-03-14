import PropTypes from 'prop-types';
import React from "react";
import cx from "classnames";

import componentPack from "./component-pack";

const getFacetValues = (type, results, field, lowerBound, upperBound) =>
	type === "period-range-facet" ? (results.facets[lowerBound] || []).concat(results.facets[upperBound] || []) :
		type === "list-facet" || type === "range-facet" ? results.facets[field] || [] : null;

//const getPivotFacetValues = (type, results, field, lowerBound, upperBound) =>
//		type === "pivot-facet" ? results.facets["facet_pivot"][field] || [] : null;

function getPivotFacetValues (type, results, field, lowerBound, upperBound) {
    console.log(results);
    var pivotFields = results.pivotFacets[field];
    return pivotFields || []

}

const getHighlightValues = (type, results, field) =>
	type === "text-highlight" ? getHighlightValuesForField(results,field): null;


function getHighlightValuesForField(results,field) {
	var highlights = [];
	for (var key in results["highlighting"]) {
		highlights.push({
            key: key,
            value: results["highlighting"]["key"][field]
        });
	}
	return highlights;
}


function getText(searchFields) {
	var text = ""
	for (var key in searchFields) {
		if (searchFields[key]["type"] == "text-highlight") {
			text = text + searchFields[key]["value"] + " "
		}
	}
	return text;
}


class SolrFacetedSearch extends React.Component {

	render() {
		const { customComponents, bootstrapCss, query, results, truncateFacetListsAt,diva_url} = this.props;
		const { onSearchFieldChange, onSortFieldChange, onPageChange, onCsvExport, onGetLastSearch } = this.props;

		const { searchFields, sortFields, start, rows } = query;

		const SearchFieldContainerComponent = customComponents.searchFields.container;
		const ResultContainerComponent = customComponents.results.container;

		const ResultComponent = customComponents.results.result;
		const GroupResultComponent = customComponents.results.groupresult;
		const ResultCount = customComponents.results.resultCount;
		const ResultHeaderComponent = customComponents.results.header;
		const ResultListComponent = customComponents.results.list;
		const ResultPendingComponent = customComponents.results.pending;
		const PaginateComponent = customComponents.results.paginate;
		const GroupPaginateComponent = customComponents.results.grouppaginate;
		const PreloadComponent = customComponents.results.preloadIndicator;
		const CsvExportComponent = customComponents.results.csvExport;
		const LastSearchComponent = customComponents.searches.lastSearch;
		const CurrentQueryComponent = customComponents.searchFields.currentQuery;
		const SortComponent = customComponents.sortFields.menu;
		const resultPending = results.pending ? (<ResultPendingComponent bootstrapCss={bootstrapCss} />) : null;
        var grouped = results.pending ? null : results.grouped["source_i"] ;


        if (grouped === null || typeof (grouped) === "undefined") {
            grouped = [];
        } else {
        	grouped = grouped.groups;
		}


		const pagination = query.pageStrategy === "paginate" ?
			<PaginateComponent {...this.props} bootstrapCss={bootstrapCss} onChange={onPageChange} /> :
			null;

		const preloadListItem = query.pageStrategy === "cursor" && results.docs.length < results.numFound ?
			<PreloadComponent {...this.props} /> : null;

		var search_text = getText(searchFields);
		return (
			<div className={cx("solr-faceted-search", {"container": bootstrapCss, "col-md-12": bootstrapCss})}>
				<SearchFieldContainerComponent bootstrapCss={bootstrapCss} onNewSearch={this.props.onNewSearch}>
					{searchFields.filter(function (searchField) {return !searchField.exact}).map((searchField, i) => {
						const { type, field, lowerBound, upperBound } = searchField;
						const SearchComponent = customComponents.searchFields[type];
						const facets = getFacetValues(type, results, field, lowerBound, upperBound);
						const pivotFacets = getPivotFacetValues(type, results, field, lowerBound, upperBound);
						return (<SearchComponent
							key={i} {...this.props} {...searchField}
							bootstrapCss={bootstrapCss}
							facets={facets}
							pivotFacets={pivotFacets}
							truncateFacetListsAt={truncateFacetListsAt}
							onChange={onSearchFieldChange}
							/>
						);
					})}
				</SearchFieldContainerComponent>

				<ResultContainerComponent bootstrapCss={bootstrapCss}>
					<ResultHeaderComponent bootstrapCss={bootstrapCss}>
						<ResultCount bootstrapCss={bootstrapCss} numFound={results.numFound} />
						{resultPending}
						<SortComponent bootstrapCss={bootstrapCss} onChange={onSortFieldChange} sortFields={sortFields} />
						{this.props.showCsvExport
							? <CsvExportComponent bootstrapCss={bootstrapCss} onClick={onCsvExport} />
							: null}
					</ResultHeaderComponent>
					<CurrentQueryComponent {...this.props} onChange={onSearchFieldChange} />
					{pagination}
						<ResultListComponent bootstrapCss={bootstrapCss}>
						{results.docs.map((doc, i) => (
							<ResultComponent bootstrapCss={bootstrapCss}
											 highlighting={results.highlighting}
											doc={doc}
											fields={searchFields}
											key={doc.id || i}
											onSelect={this.props.onSelectDoc}
											resultIndex={i}
											rows={rows}
											start={start}
											 diva_url={diva_url}
											 search_text={search_text}

							/>

						))}
					{preloadListItem}
					</ResultListComponent>


					{pagination}
				</ResultContainerComponent>
			</div>
		);
	}
}

SolrFacetedSearch.defaultProps = {
	bootstrapCss: true,
	diva_url: "",
	customComponents: componentPack,
	pageStrategy: "paginate",
	rows: 20,
	searchFields: [
		{type: "text", field: "*"}
	],
	sortFields: [],
	truncateFacetListsAt: -1,
	showCsvExport: false
};

SolrFacetedSearch.propTypes = {
	bootstrapCss: PropTypes.bool,
	customComponents: PropTypes.object,
	onCsvExport: PropTypes.func,
	onNewSearch: PropTypes.func,
	onPageChange: PropTypes.func,
	onSearchFieldChange: PropTypes.func.isRequired,
	onSelectDoc: PropTypes.func,
	onSortFieldChange: PropTypes.func.isRequired,
	query: PropTypes.object,
	results: PropTypes.object,
	showCsvExport: PropTypes.bool,
	truncateFacetListsAt: PropTypes.number
};

export default SolrFacetedSearch;


/*{	<ResultListComponent bootstrapCss={bootstrapCss}>
						{results.docs.map((doc, i) => (
							<ResultComponent bootstrapCss={bootstrapCss}
											 highlighting={results.highlighting}
											doc={doc}
											fields={searchFields}
											key={doc.id || i}
											onSelect={this.props.onSelectDoc}
											resultIndex={i}
											rows={rows}
											start={start}
											 diva_url={diva_url}


							/>
						))}
					{preloadListItem}
					</ResultListComponent> */