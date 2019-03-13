import PropTypes from 'prop-types';
import React from "react";
import cx from "classnames";

class Result extends React.Component {


	renderValue(field, doc) {
		const value = [].concat(doc[field] || null).filter((v) => v !== null);

		return value.join(", ");
	}


	renderHighLightValue(field, doc, highlighting) {

		if (typeof highlighting == "undefined") {return ""};

		var ret = "<ul class ='highlight-list'>";
		const value = highlighting[doc["id"]][field] || null; //.filter((v) => v !== null);

		for (var v in value){
			ret = ret + "<li>" + value[v] + "</li>";
		}

		return ret;
		//return value.join(", ");

	}
	render() {
		const { bootstrapCss, doc, fields, highlighting, diva_url, search_text } = this.props;

		var thumb_url = diva_url + 'docs/thumb/' + doc.id;
		var st = search_text || '';
		var simple_link = diva_url + 'docs/simplePDFSource/' + doc.id + "?search=" + st;
		var diva_link = diva_url + 'diva/diva/' + doc.id;
		return (
			<ul>


			<li className={cx({"list-group-item": bootstrapCss})}><img src={thumb_url}/><img src={thumb_url + '?pn=2'}/><img src={thumb_url + '?pn=3'}/></li>

			<li className={cx({"list-group-item": bootstrapCss})} onClick={() => this.props.onSelect(doc)}>
				<ul>
					{fields.filter((field) => field.field !== "*" && field.type !== "text-highlight" && !field.exact && field.type != "pivot-facet" && field.type != "list-facet" && field.type != "range-facet").map((field, i) =>
						<li key={i}>
							<label>{field.label || field.field}</label>
                            {!field.link ? (this.renderValue(field.field, doc)) :
								(<a href={field.link + this.renderValue(field.field, doc)}>{this.renderValue(field.field, doc)}</a>)
                            }
						</li>
					)}
					{fields.filter((field) => field.field !== "*" && field.type === "text-highlight").map((field, i) =>
						<li key={i}>
							<label><a href={ diva_url + 'docs/simplePDFSource/' + doc.id + "?search=" + field.value}>{field.label || field.field}</a></label>
							<div dangerouslySetInnerHTML={{__html: this.renderHighLightValue(field.field, doc, highlighting)}}/>
						</li>
					)}
					<li  className={cx({"list-group-item": bootstrapCss})}><a href={simple_link}> all </a> | <a href={diva_link}> page by page </a></li>
				</ul>
			</li>
			</ul>
		);
	}

}

Result.propTypes = {
	bootstrapCss: PropTypes.bool,
	doc: PropTypes.object,
	fields: PropTypes.array,
	onSelect: PropTypes.func.isRequired,
	search_text: PropTypes.string
};

export default Result;