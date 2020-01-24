// index.js
import React from "react";
import ReactDOM from "react-dom";
import SolrFacetedSearch from "./components/solr-faceted-search";
import defaultComponentPack from "./components/component-pack";
import { SolrClient } from "./api/solr-client";
import queryString from 'query-string';
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
	{label: "OCR Text", field: "text", type: "text-highlight"},
	{label: "Alle Felder", field: "*", type: "text"},
    {label: "Titel", field: "md_UF_titel_txt_s", type: "show", collapse: true},
	{label: "Archiv", field: "md_UF_archiv__txt_s", type: "show"},
	//{label: "Abteilung", field: "md_akten_bestand_abteilung_bezeichnung_txts_s", type: "show"},
	{label: "Bestand", field: "md_UF_bestand_txt_s", type: "show"},
	{label: "Signatur", field: "md_UF_signatur_txt_s", type: "show"},
	{label: "Alt-Signatur", field: "md_UF_altsignatur_txt_s", type: "show"},
	{label: "Laufzeit Start", field: "md_UF_laufzeit_von_txt_l", type: "range-facet"},
	{label: "Laufzeit End", field: "md_UF_laufzeit_bis_txt_l", type: "range-facet"},
	{label: "Laufzeit Start", field: "md_UF_laufzeit_von_txt", type: "show"},
	{label: "Laufzeit End", field: "md_UF_laufzeit_bis_txt", type: "show"},

	//{label: "Archiv", field: "md_akten_bestand_archiv_bezeichnung_txts_s,md_akten_bestand_abteilung_bezeichnung_txts_s,md_akten_bestand_bezeichnung_txts_s", type: "pivot-facet"},
	{label: "Signatur sortiert nach Archiv", field: "md_UF_archiv__txt_s,md_UF_bestand_txt_s,md_UF_signatur_txt_s", type: "pivot-facet"},
	{label: "Titel sortiert nach Archiv", field: "md_UF_archiv__txt_s,md_UF_bestand_txt_s,md_UF_titel_txt_s", type: "pivot-facet"},
	{label: "Alt-Signatur sortiert by Archiv", field: "md_UF_archiv__txt_s,md_UF_altsignatur_txt_s", type: "pivot-facet"},
	{label: "Titel", field: "md_UF_titel_txt_s", type: "list-facet", collapse: true},
	{label: "Klassifikation (Archiv-DB)", field: "md_AR_klassifikationRootStored_txt_s,md_AR_klassifikationLeaveStored_txt_s", type: "pivot-facet", collapse : true},
	//{label: "Klassifikation (Archiv-DB)", field: "md_AR_klassifikationRootStored_txt_s,md_AR_klassifikationLeaveStored_txt_s", type: "pivot-facet", collapse : true},
	//{label: "Klassifikation (Registratur)", field: "md_AR_klassifikationRootStored_txt_s,md_AR_klassifikationLeaveStored_txt_s", type: "pivot-facet", collapse : true},
	{label: "Klassifikation", field: "md_UF_klassifikation_serie_txt_s", type: "list-facet", collapse : true},
	{label: "Klassifikation", field: "md_UF_klassifikation_serie_txt_s", type: "show", collapse : true},
	{label: "Ort", field: "md_UF_ort_txt_s", type: "list-facet", collapse : true},
	{label: "Ort", field: "md_UF_ort_txt_s", type: "show"},
	//{label: "Path", field: "path_1,path_2,path_3,path_4,path_5,path_6,path_7", type: "pivot-facet"},
	{label: "Barcode", field: "md_UF_barcode_i", type: "text", collapse : true},
	{label: "Id", field: "id", type: "text", exact: true},
	{label: "Akten ID", field: "md_akten_id_is", type: "text",link:"http://gmpg-intern.mpiwg-berlin.mpg.de:8888/admin/Archiv/akte/" , collapse : true},
	//{label: "Url", field: "url", type: "show"},
	{label: "Aktenzeichen", field: "md_UF_aktenzeichen_txt", type: "text", collapse: true},
	{label: "Type", field: "django_ct", type: "list-facet", collapse: true},
	{label: "Stufe III", field: "stufe_III", type: "list-facet", collapse: true},
	{label: "CD Star id", field: "documentIdentifier", type: "text", collapse: true},
	{label: "Pfad", field: "path_1,path_2,path_3,path_4,path_5,path_6", type: "pivot-facet"},
	{label: "Pfad", field: "url", type: "show"},
	{label: "Stufe III", field: "stufe_III", type: "show"},
	{label: "url", field: "url_part1,url_part2,url_part3,url_part4", type: "pivot-facet"},
	//{label: "Ort (only Archiv-DB)", field: "md_AR_bestand_archiv_ort_txt_s", type: "list-facet"},
	//{label: "Date of birth", field: "birthDate_i", type: "range-facet"},
	//{label: "Date of death", field: "deathDate_i", type: "range-facet"}
];

// The sortable fields you want
const sortFields = [
	{label: "Laufzeit Start", field: "md_UF_laufzeit_von_txt_l"},
	{label: "Laufzeit End", field: "md_UF_laufzeit_von_txt_l"},
	{label: "Bestand", field: "md_UF_bestand_txt_s"},
	//{label: "Date of birth", field: "birthDate_i"},
	//{label: "Date of death", field: "deathDate_i"}
];

document.addEventListener("DOMContentLoaded", () => {
	// The client class



	var sc = new SolrClient({
		// The solr index url to be queried by the client
		url: "/ds/solr/",
		//url:"http://localhost:8889/ds/solr/",
		last_search_url:"http://localhost:8889/ds",
		//diva_url: "http://localhost:8889/",
		diva_url:"/",
		searchFields: pivotTypeToFields(fields),
		sortFields: sortFields,
        rows: 10,
		restrictions: "fq=+django_ct:*&fq=-django_ct:documents.pdfsource&fq=-django_ct:djangoZotero*&" +
             "fq=+documentIdentifier:*&" +
            //"fq=+md_UF_archiv__txt_s:*&" +
        "fq=-django_ct:documents.page&fq=-django_ct:documents.pdfpage&facet.mincount=1&" +
		"hl.maxAnalyzedChars=1000000&hl.highlightMultiTerm=true",
		// The change handler passes the current query- and result state for render
		// as well as the default handlers for interaction with the search component
		onChange: (state, handlers) =>
			// Render the faceted search component
			ReactDOM.render(
				<SolrFacetedSearch
					{...state}
					{...handlers}
					bootstrapCss={true}
					diva_url = "/"
					onSelectDoc={(doc) => console.log(doc)}
					showCsvExport = {true}
				/>,
				document.getElementById("app")
			)
	});

	//sc.setGroup({"field":"django_ct"});


	let search = queryString.parse(window.location.search);
	let params = new URLSearchParams(search);
	let searchString = params.get("search");

	if (searchString) {
		sc.setSearchFieldValue("*", searchString);
	} else {
		sc.initialize(); // this will send an initial search, fetching all results from solr
	}
	//sc.setGroup({"field":"source_i"});

});
