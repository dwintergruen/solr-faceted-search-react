import PropTypes from 'prop-types';
import React from "react";
import cx from "classnames";

class GroupResult extends React.Component {


	renderValue(field, doc) {



		const value = [].concat(doc[field] || null).filter((v) => v !== null);



		return value.join(", ");
	}


	renderHighLightValue(field, doc, highlighting) {

		if (typeof highlighting == "undefined") {return ""};

		var ret = "<ul>";
		var value = highlighting[doc["id"]][field] || null; //.filter((v) => v !== null);

		if (!value || value == "") {
            ret = [].concat(doc[field] || null).filter((v) => v !== null)
        } else {
            for (var v in value) {
                ret = ret + "<li>" + value[v] + "</li>";
            }
        }
		return ret;
		//return value.join(", ");

	}
	render() {
		const { bootstrapCss, doc, fields, highlighting, diva_url } = this.props;
		//console.log(doc.doclist.docs);
		var docs = doc.doclist.docs;
		if (typeof docs == "undefined"){
			docs = [];
		}
		console.log(docs);
		var thumb_url = diva_url + 'docs/thumb/' + doc.id;
		var page_link = diva_url + 'diva/show/' + doc.id;
		return (
			<div>
            {docs.map((doc) => {
            	return(
                <ul key={doc.id}>
                    <li className={cx({"list-group-item": bootstrapCss})}><a href={page_link}> show </a></li>

                    <li className={cx({"list-group-item": bootstrapCss})}><img src={thumb_url}/></li>

                    <li className={cx({"list-group-item": bootstrapCss})} onClick={() => this.props.onSelect(doc)}>
                        <ul>
                            {fields.filter((field) => field.field !== "*" && field.type !== "text-highlight").map((field, i) =>
                                <li key={i}>
                                    <label>{field.label || field.field}</label>
                                    {this.renderValue(field.field, doc)}
                                </li>
                            )}
                            {fields.filter((field) => field.field !== "*" && field.type === "text-highlight").map((field, i) =>
                                <li key={i}>
                                    <label>{field.label || field.field}</label>
                                    <div
                                        dangerouslySetInnerHTML={{__html: this.renderHighLightValue(field.field, doc, highlighting)}}/>
                                </li>
                            )}
                        </ul>
                    </li>
                </ul>)
            })}
			</div>);
	}

}

GroupResult.propTypes = {
	bootstrapCss: PropTypes.bool,
	doc: PropTypes.object,
	fields: PropTypes.array,
	onSelect: PropTypes.func.isRequired
};

export default GroupResult;