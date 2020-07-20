import React, { Component } from 'react';
import { Popup } from 'semantic-ui-react';
// import _ from 'lodash';
import { formatNumberForDisplay, splitValue } from '../Shared/helpers';
import './MetafeaturesTable.scss';
// import { CancelToken } from 'axios';
import QHGrid from '../utility/QHGrid';
import EZGrid from '../utility/EZGrid';
import QuickViewModal from '../utility/QuickViewModal';
import {
  getFieldValue,
  getField,
  typeMap,
} from '../utility/selectors/QHGridSelector';
// import { data } from 'pdfkit/js/reference';
export * from '../utility/FilterTypeConfig';
export * from '../utility/selectors/quickViewSelector';
export { QHGrid, EZGrid, QuickViewModal };
export { getField, getFieldValue, typeMap };

class MetafeaturesTable extends Component {
  state = {
    metafeaturesTableConfigCols: [],
    metafeaturesTableData: [],
    filteredBarcodeData: [],
    itemsPerPageMetafeaturesTable: 20,
    additionalTemplateInfo: [],
  };
  metafeaturesGridRef = React.createRef();

  componentDidMount() {
    this.getMetafeaturesTableConfigCols(this.props.metafeaturesData);
  }

  componentDidUpdate = (prevProps, prevState) => {
    // if (this.props.metafeaturesData !== prevProps.metafeaturesData) {
    //   this.setState({
    //     metafeaturesTableData: this.props.metafeaturesTableData
    //   })
    // }
  };

  getMetafeaturesTableConfigCols = data => {
    let configCols = [];
    if (data.length > 0) {
      const TableValuePopupStyle = {
        backgroundColor: '2E2E2E',
        borderBottom: '2px solid var(--color-primary)',
        color: '#FFF',
        padding: '1em',
        maxWidth: '50vw',
        fontSize: '13px',
        wordBreak: 'break-all',
      };
      let metafeaturesAlphanumericFields = [];
      let metafeaturesNumericFields = [];
      const firstObject = data[0];
      for (let [key, value] of Object.entries(firstObject)) {
        if (typeof value === 'string' || value instanceof String) {
          metafeaturesAlphanumericFields.push(key);
        } else {
          metafeaturesNumericFields.push(key);
        }
      }
      const metafeaturesAlphanumericColumnsMapped = metafeaturesAlphanumericFields.map(
        f => {
          return {
            title: f,
            field: f,
            filterable: { type: 'alphanumericFilter' },
            template: (value, item, addParams) => {
              return (
                <div className="NoSelect">
                  <Popup
                    trigger={
                      <span className="NoSelect">{splitValue(value)}</span>
                    }
                    style={TableValuePopupStyle}
                    className="TablePopupValue"
                    content={value}
                    inverted
                    basic
                  />
                </div>
              );
            },
          };
        },
      );
      const metafeaturesNumericColumnsMapped = metafeaturesNumericFields.map(
        c => {
          return {
            title: c,
            field: c,
            type: 'number',
            filterable: { type: 'numericFilter' },
            exportTemplate: value => (value ? `${value}` : 'N/A'),
            template: (value, item, addParams) => {
              return (
                <p>
                  <Popup
                    trigger={
                      <span className="TableValue NoSelect">
                        {formatNumberForDisplay(value)}
                      </span>
                    }
                    style={TableValuePopupStyle}
                    className="TablePopupValue"
                    content={value}
                    inverted
                    basic
                  />
                </p>
              );
            },
          };
        },
      );
      configCols = metafeaturesAlphanumericColumnsMapped.concat(
        metafeaturesNumericColumnsMapped,
      );
    }
    this.setState({
      metafeaturesTableConfigCols: configCols,
      metafeaturesTableData: data,
    });
  };

  render() {
    const {
      metafeaturesTableConfigCols,
      itemsPerPageMetafeaturesTable,
      metafeaturesTableData,
    } = this.state;

    // const { metafeaturesData } = this.props;

    return (
      <div className="MetafeaturesTableDiv">
        <EZGrid
          ref={this.metafeaturesGridRef}
          data={metafeaturesTableData}
          columnsConfig={metafeaturesTableConfigCols}
          totalRows={15}
          // use "differentialRows" for itemsPerPage if you want all results. For dev, keep it lower so rendering is faster
          itemsPerPage={itemsPerPageMetafeaturesTable}
          // onInformItemsPerPage={this.informItemsPerPage}
          exportBaseName="metaFeatures"
          // quickViews={quickViews}
          disableGeneralSearch
          // disableGrouping
          // disableSort
          disableColumnVisibilityToggle
          disableColumnReorder
          // disableFilters={false}
          min-height="5vh"
          // additionalTemplateInfo={this.state.additionalTemplateInfo}
          // headerAttributes={<ButtonActions />}
        />
      </div>
    );
  }
}

export default MetafeaturesTable;
