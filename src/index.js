// index.js
import React from "react";
import ReactDOM from "react-dom";
import SolrFacetedSearch from "./components/solr-faceted-search";
import defaultComponentPack from "./components/component-pack";
import { SolrClient } from "./api/solr-client";

//import {
//	SolrFacetedSearch,
//	SolrClient
//}; //from "gmpg-search";



function pivotTypeToFields(fields) {
	var searchFields = [];
	fields.forEach( function(field) {
		searchFields.push(field);
        if (field.type === "pivot-facet") {
            var newFields = field.field.split(",");

            newFields.forEach(function(newField) {
                searchFields.push({label: newField, field: newField, type: "text", exact:true})
            } );
        };
    });

	return searchFields


}
// The search fields and filterable facets you want
const fields = [
	{label: "All text fields", field: "*", type: "text"},
    {label: "Text", field: "text", type: "text-highlight"},
	{label: "Archiv", field: "md_akten_bestand_archiv_bezeichnung_txts_s,md_akten_bestand_abteilung_bezeichnung_txts_s,md_akten_bestand_bezeichnung_txts_s", type: "pivot-facet"},
	{label: "Signatur", field: "md_akten_bestand_archiv_signatur_txts_s,md_akten_bestand_abteilung_signatur_txts_s,md_akten_bestand_signatur_txts_s", type: "pivot-facet"},
	{label: "Url", field: "url_part1,url_part2,url_part3", type: "pivot-facet"},
	{label: "Barcode", field: "barcode", type: "text"},
	{label: "Id", field: "id", type: "text"},
	{label: "Type", field: "django_ct", type: "list-facet"},

	//{label: "Date of birth", field: "birthDate_i", type: "range-facet"},
	//{label: "Date of death", field: "deathDate_i", type: "range-facet"}
];

// The sortable fields you want
const sortFields = [
	{label: "Aktensignatur", field: "md_akten_aktensignatur_box_txts_s"},
	//{label: "Date of birth", field: "birthDate_i"},
	//{label: "Date of death", field: "deathDate_i"}
];

document.addEventListener("DOMContentLoaded", () => {
	// The client class



	var sc = new SolrClient({
		// The solr index url to be queried by the client
		url: "http://localhost:8889/ds/solr/",
		diva_url: "http://localhost:8889/",
		searchFields: pivotTypeToFields(fields),
		sortFields: sortFields,
        rows: 10,

		// The change handler passes the current query- and result state for render
		// as well as the default handlers for interaction with the search component
		onChange: (state, handlers) =>
			// Render the faceted search component
			ReactDOM.render(
				<SolrFacetedSearch
					{...state}
					{...handlers}
					bootstrapCss={true}
					diva_url = "http://localhost:8889/"
					onSelectDoc={(doc) => console.log(doc)}
				/>,
				document.getElementById("app")
			)
	});

	//sc.setGroup({"field":"django_ct"});
	sc.initialize(); // this will send an initial search, fetching all results from solr
	sc.setGroup({"field":"source_i"});
});
