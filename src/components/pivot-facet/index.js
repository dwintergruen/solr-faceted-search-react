import PropTypes from 'prop-types';
import React from "react";
import cx from "classnames";

import CheckedIcon from "../icons/checked";
import UncheckedIcon from "../icons/unchecked";
import ListFacet from "../list-facet";

class PivotFacet extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			filter: "",
			truncateFacetListsAt: props.truncateFacetListsAt
		};
	}

	handleClick(value,field) {
		const foundIdx = this.props.value.indexOf(value);
		//var fields_str = this.props.field;
		//var fields = fields_str.split(","); //if pivot list of fields

		//var field;
		//if (fields.length > 0) {
		//	field = fields[0]
		//} else {
		//	field = ""
		//}
		if (foundIdx < 0) {
			this.props.onChange(field, this.props.value.concat(value));
		} else {
			this.props.onChange(field, this.props.value.filter((v, i) => i !== foundIdx));
		}
	}

	toggleExpand() {
		this.props.onSetCollapse(this.props.field, !(this.props.collapse || false));
		var level = this.props.level || 0
		console.log(level,this.state.collapse);
		this.state.collapse = !this.state.collapse;
		console.log(level,this.state.collapse);
	}

	render() {
		const { query, label, pivotFacets, field, value, bootstrapCss, facetSort, collapse, count, level } = this.props;
		const { truncateFacetListsAt } = this.state;
		//console.log(pivotFacets);
		//console.log(field);
		console.log("COL",this.props.key,collapse);
		//var expanded = !collapse    //(collapse || false);
		//expanded = expanded || this.state.collapse;
		var expanded = this.state.collapse;
		var currentLevel = level || 0
			return (
			<li className={cx("list-facet", {"list-group-item": bootstrapCss})} id={`solr-list-facet-${field}`}>
				{ pivotFacets.length > 0 ? (
				<header >
					<h5>
						<span onClick={this.toggleExpand.bind(this)}>
							<span className={cx("glyphicon", {
								"glyphicon-collapse-down": expanded,
								"glyphicon-collapse-up": !expanded
							})} />{" "}
						</span>
                        {currentLevel > 0 ? (
                        	<span onClick={() => this.handleClick(label, field)}>
                                   {label} <span className="facet-item-amount">{count}</span>
							</span>
                            ) :
                            (<span>
                                   {label} <span className="facet-item-amount">{count}</span>
							</span>)
                        }

					</h5>
				</header> ) : null }
				{ expanded ? (

						<ul className={"list-group list-group-pivot"}>
                            {pivotFacets.map((facetValue, i) =>
                                <li className={cx(`facet-item-type-${field}`, `list-group-item`)}
                                    key={`${facetValue.value}_${i}`}>

										{ facetValue.pivot ? (
									<ul className={"list-group list-group-pivot"}>
                                    	<PivotFacet key={`${facetValue.value}_${i}`}
													pivotFacets={facetValue.pivot}
													field={facetValue.field}
													query={query}
													onSetCollapse={this.props.onSetCollapse}
													collapse={true}
													label= {facetValue.value}
													count = {facetValue.count}
													level = {currentLevel + 1}
													//bootstrapCss={bootstrapCss}
													//label = {facetValue.value}
										onChange={this.props.onChange}/>
									</ul> ) : (
										<span onClick={() => this.handleClick(facetValue.value,facetValue.field)}>
											{facetValue.value} <span className="facet-item-amount">{facetValue.count}</span>
										</span>
										)


										}
                                </li>)
                            }
						</ul>

				) : null }
			</li>
		);
	}
}

PivotFacet.defaultProps = {
	value: []
};

PivotFacet.propTypes = {
	bootstrapCss: PropTypes.bool,
	children: PropTypes.array,
	collapse: PropTypes.bool,
	facetSort: PropTypes.string,
	pivotFacets: PropTypes.array.isRequired,
	field: PropTypes.string.isRequired,
	label: PropTypes.string,
	level: PropTypes.number,
	onChange: PropTypes.func,
	onFacetSortChange: PropTypes.func,
	onSetCollapse: PropTypes.func,
	query: PropTypes.object,
	truncateFacetListsAt: PropTypes.number,
	value: PropTypes.array,
	count:PropTypes.number

};

export default PivotFacet;