import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';

import PepplotSearchCriteria from './PepplotSearchCriteria';
import PepplotResults from './PepplotResults';
// import ButtonActions from './ButtonActions';
import SearchPrompt from './SearchPrompt';
import _ from 'lodash';

class PepplotContainer extends Component {
  state = {
    tab: this.props.tab || 'pepplot',
    study: this.props.study || '',
    studies: this.props.studies || [],
    model: this.props.model || '',
    models: this.props.models || [],
    test: this.props.test || '',
    tests: this.props.tests || [],
    modelsDisabled: this.props.modelsDisabled,
    testsDisabled: this.props.testsDisabled || true,
    isValidSearchPepplot: this.props.isValidSearchPepplot || false,
    pepplotColumns: [],
    pepplotResults: []
  };

  componentDidMount() {
    this.phosphorylationData = this.phosphorylationData.bind(this);
    this.handlePepplotSearch = this.handlePepplotSearch.bind(this);
  }

  handlePepplotSearch = searchResults => {
    const columns = this.getCongfigCols(searchResults);
    this.setState({
      study: searchResults.study,
      model: searchResults.model,
      test: searchResults.test,
      pepplotResults: searchResults.pepplotResults,
      pepplotColumns: columns,
      isValidSearchPepplot: true
    });
  };

  hidePGrid = () => {
    this.setState({
      isValidSearchPepplot: false
    });
  };

  getCongfigCols = testData => {
    this.testData = testData.pepplotResults;
    // var configCols = ['F', 'logFC', 't', 'P_Value', 'adj_P_Val'];
    const model = testData.model;
    let configCols = [];
    if (model === 'Differential Expression') {
      configCols = [
        {
          title: 'MajorityProteinIDsHGNC',
          field: 'MajorityProteinIDsHGNC',
          // type: 'number',
          filterable: { type: 'multiFilter' },
          template: (value, item, addParams) => {
            return (
              <p>
                {value}
                <img
                  src="phosphosite.ico"
                  alt="Phosophosite"
                  className="PhosphositeIcon"
                  // data-manifest={item}
                  onClick={addParams.showPhosphositePlus(item)}
                />
              </p>
            );
          }
        },
        {
          title: 'MajorityProteinIDs',
          field: 'MajorityProteinIDs',
          field: {
            field: 'MajorityProteinIDs',
            sortAccessor: (item, field) =>
              item[field] && item[field].toFixed(2),
            groupByAccessor: (item, field) =>
              item[field] && item[field].toFixed(2),
            accessor: (item, field) => item[field] && item[field].toFixed(2)
          },
          // type: 'number',
          filterable: { type: 'multiFilter' }
        },
        {
          title: 'logFC',
          field: {
            field: 'logFC',
            sortAccessor: (item, field) =>
              item[field] && item[field].toFixed(2),
            groupByAccessor: (item, field) =>
              item[field] && item[field].toFixed(2),
            accessor: (item, field) => item[field] && item[field].toFixed(2)
          },
          // type: 'number',
          filterable: { type: 'multiFilter' }
        },
        {
          title: 't',
          field: {
            field: 't',
            sortAccessor: (item, field) =>
              item[field] && item[field].toFixed(2),
            groupByAccessor: (item, field) =>
              item[field] && item[field].toFixed(2),
            accessor: (item, field) => item[field] && item[field].toFixed(2)
          },
          // type: 'number'
          filterable: { type: 'multiFilter' }
        },
        {
          title: 'P_Value',
          field: {
            field: 'P_Value'
          },
          // type: 'number',
          filterable: { type: 'multiFilter' }
        },
        {
          title: 'adj_P_Val',
          field: {
            field: 'adj_P_Val',
            sortAccessor: (item, field) =>
              item[field] && item[field].toFixed(4),
            groupByAccessor: (item, field) =>
              item[field] && item[field].toFixed(4),
            accessor: (item, field) => item[field] && item[field].toFixed(4)
          },
          // type: 'number'
          filterable: { type: 'multiFilter' }
        }
      ];
    } else {
      configCols = [
        {
          title: 'Protein_Site',
          field: 'Protein_Site',
          // type: 'number',
          filterable: { type: 'multiFilter' },
          template: (value, item, addParams) => {
            return (
              <p>
                {value}
                <img
                  src="phosphosite.ico"
                  alt="Phosophosite"
                  className="PhosphositeIcon"
                  // data-manifest={item}
                  onClick={addParams.showPhosphositePlus(item)}
                />
              </p>
            );
          }
        },
        {
          title: 'logFC',
          field: {
            field: 'logFC',
            sortAccessor: (item, field) =>
              item[field] && item[field].toFixed(2),
            groupByAccessor: (item, field) =>
              item[field] && item[field].toFixed(2),
            accessor: (item, field) => item[field] && item[field].toFixed(2)
          },
          // type: 'number',
          filterable: { type: 'multiFilter' }
        },
        {
          title: 't',
          field: {
            field: 't',
            sortAccessor: (item, field) =>
              item[field] && item[field].toFixed(2),
            groupByAccessor: (item, field) =>
              item[field] && item[field].toFixed(2),
            accessor: (item, field) => item[field] && item[field].toFixed(2)
          },
          // type: 'number',
          filterable: { type: 'multiFilter' }
        },
        {
          title: 'P_Value',
          field: {
            field: 'P_Value'
          },
          // type: 'number',
          filterable: { type: 'multiFilter' }
        },
        {
          title: 'adj_P_Val',
          field: {
            field: 'adj_P_Val',
            sortAccessor: (item, field) =>
              item[field] && item[field].toFixed(4),
            groupByAccessor: (item, field) =>
              item[field] && item[field].toFixed(4),
            accessor: (item, field) => item[field] && item[field].toFixed(4)
          },
          // type: 'number'
          filterable: { type: 'multiFilter' }
        }
      ];
    }
    return configCols;
    // var orderedTestData = JSON.parse(
    //   JSON.stringify(this.testData[0], configCols)
    // );
    // P_Value: 0.00001367510918
    // adj_P_Val: 0.024064375844
    // logFC: 1.8698479717
    // t: 7.7253981892

    // 0: "logFC"
    // 1: "t"
    // 2: "P_Value"
    // 3: "adj_P_Val"

    // this.columns = _.map(
    //   _.filter(_.keys(orderedTestData), function(d) {
    //     return _.includes(configCols, d);
    //   }),
    //   function(d) {
    //     return { field: d };
    //   }
    // );
  };

  render() {
    return (
      <Grid.Row className="PepplotContainer">
        <Grid.Column
          className="SidebarContainer"
          mobile={16}
          tablet={16}
          largeScreen={3}
          widescreen={3}
        >
          <PepplotSearchCriteria
            searchCriteria={this.state}
            onPepplotSearch={this.handlePepplotSearch}
            onSearchCriteriaReset={this.hidePGrid}
          />
        </Grid.Column>

        <Grid.Column
          className="ContentContainer"
          mobile={16}
          tablet={16}
          largeScreen={13}
          widescreen={13}
        >
          {this.state.isValidSearchPepplot ? (
            <PepplotResults searchCriteria={this.state} />
          ) : (
            <SearchPrompt />
          )}
        </Grid.Column>
      </Grid.Row>
    );
  }

  /* <Switch>
  <Route exact path="/pepplot" component={PepplotContainer} />
  <Route exact path="/enrichment" component={EnrichmentContainer} />
  <Route exact path="/" render={() => <Redirect to="/pepplot" />} />
  <Route component={NoMatch} />
  </Switch> */

  phosphorylationData() {
    const result = {
      data: process(this.testData, this.stateExcelExport).data
    };
    return result;
  }
}

export default PepplotContainer;