import React, { Component } from 'react';
import { Grid, Popup, Sidebar } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import SVG from 'react-inlinesvg';
import { CancelToken } from 'axios';
import DifferentialSearchCriteria from './DifferentialSearchCriteria';
import TransitionActive from '../Transitions/TransitionActive';
import TransitionStill from '../Transitions/TransitionStill';
import ButtonActions from '../Shared/ButtonActions';
import {
  formatNumberForDisplay,
  splitValue,
  Linkout,
  roundToPrecision,
  limitValues,
} from '../Shared/helpers';
import DOMPurify from 'dompurify';
import { omicNavigatorService } from '../../services/omicNavigator.service';
import DifferentialVolcano from './DifferentialVolcano';
import _ from 'lodash';
import './Differential.scss';
import '../Shared/Table.scss';

let cancelRequestDifferentialResultsGetPlot = () => {};
class Differential extends Component {
  static defaultProps = {
    differentialStudy: '',
    differentialModel: '',
    differentialTest: '',
    differentialFeature: '',
  };

  constructor(props) {
    super(props);
    // this.resizeListener = this.resizeListener.bind(this);
    // this.debouncedResizeListener = _.debounce(this.resizeListener, 100);
    this.state = {
      isValidSearchDifferential: false,
      isSearchingDifferential: false,
      isVolcanoTableLoading: false,
      // differentialResults: [],
      // differentialResultsUnfiltered: [],
      /**
       * @type {QHGrid.ColumnConfig[]}
       */
      // differentialColumns: [],
      filterableColumnsP: [],
      multisetPlotInfoDifferential: {
        title: '',
        svg: [],
      },
      isItemSelected: false,
      isItemSVGLoaded: false,
      // isItemDatatLoaded: false,
      // HighlightedFeaturesArrVolcano: [],
      // volcanoDifferentialTableRowMax: '',
      // volcanoDifferentialTableRowOther: [],
      // maxObjectIdentifier: null,
      imageInfoVolcano: {
        key: null,
        title: '',
        svg: [],
      },
      imageInfoDifferential: {
        key: null,
        title: '',
        svg: [],
      },
      multisetPlotAvailableDifferential: false,
      animation: 'uncover',
      direction: 'left',
      visible: false,
      plotButtonActiveDifferential: false,
      multisetQueriedDifferential: false,
      thresholdColsP: [],
      tabsMessage: 'Select a feature to display plots',
      // differentialPlotTypes: [],
      differentialStudyMetadata: [],
      differentialModelsAndTests: [],
      differentialTestsMetadata: [],
      modelSpecificMetaFeaturesExist: true,
      resultsLinkouts: [],
      resultsFavicons: [],
      isVolcanoPlotSVGLoaded: true,
      metaFeaturesDataDifferential: [],
      allMetaFeaturesDataDifferential: [],
      isDataStreamingResultsTable: false,
      enableMultifeaturePlotting: false,
    };
  }

  differentialViewContainerRef = React.createRef();
  differentialGridRef = React.createRef();

  shouldComponentUpdate(nextProps) {
    return nextProps.tab === 'differential';
  }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.debouncedResizeListener);
  // }

  // resizeListener() {
  //   this.forceUpdate();
  // }

  handleSearchTransitionDifferential = bool => {
    this.setState({
      isSearchingDifferential: bool,
    });
  };

  handleMultisetQueriedDifferential = value => {
    this.setState({
      multisetQueriedDifferential: value,
      // isVolcanoPlotSVGLoaded: !value,
    });
  };

  // handleVolcanoPlotSVGLoaded = bool => {
  //   this.setState({
  //     isVolcanoPlotSVGLoaded: bool,
  //   });
  // };

  setStudyModelTestMetadata = (studyData, modelsAndTests) => {
    this.setState(
      {
        differentialStudyMetadata: studyData,
        differentialModelsAndTests: modelsAndTests,
      },
      function() {
        this.handlePlotTypesDifferential(this.props.differentialModel);
      },
    );
  };

  setTestsMetadata = testsData => {
    this.setState({
      differentialTestsMetadata: testsData,
    });
  };

  handleDifferentialSearchUnfiltered = searchResults => {
    this.setState({
      differentialResultsUnfiltered: searchResults.differentialResults,
      isItemSVGLoaded: false,
      // isItemDatatLoaded: false,
      // isItemSelected: this.props.differentialFeature !== '',
      HighlightedFeaturesArrVolcano: [],
      enableMultifeaturePlotting: false,
    });
  };

  handleDifferentialSearch = searchResults => {
    /**
     * @type {QHGrid.ColumnConfig<{}>[]}
     */
    let columns = [{}];
    // need this check for page refresh
    if (searchResults.differentialResults?.length > 0) {
      columns = this.getConfigCols(searchResults);
    }
    this.setState({
      differentialResults: searchResults.differentialResults,
      differentialColumns: columns,
      isSearchingDifferential: false,
      isValidSearchDifferential: true,
      isVolcanoTableLoading: false,
      plotButtonActiveDifferential: false,
      visible: false,
      // isItemSVGLoaded: false,
      HighlightedFeaturesArrVolcano: [],
      enableMultifeaturePlotting: false,
    });
  };

  handleVolcanoTableLoading = bool => {
    this.setState({
      isVolcanoTableLoading: bool,
    });
  };

  handlePlotTypesDifferential = differentialModel => {
    if (differentialModel !== '') {
      if (this.state.differentialStudyMetadata?.plots != null) {
        const differentialModelData = this.state.differentialStudyMetadata.plots.find(
          model => model.modelID === differentialModel,
        );
        this.setState({
          differentialPlotTypes: differentialModelData?.plots,
        });
      }
    }
  };
  handleSearchCriteriaChangeDifferential = (changes, scChange) => {
    this.props.onHandleUrlChange(changes, 'differential');
    this.setState({
      visible: false,
      plotButtonActiveDifferential: false,
    });
    if (scChange) {
      this.setState({
        multisetPlotAvailableDifferential: false,
        imageInfoVolcano: { key: null, title: '', svg: [] },
        imageInfoDifferential: { key: null, title: '', svg: [] },
        tabsMessage: 'Select a feature to display plots',
        // differentialResults: [],
        // differentialResultsUnfiltered: [],
        // isItemDatatLoaded: false,
        HighlightedFeaturesArrVolcano: [],
        enableMultifeaturePlotting: false,
        volcanoDifferentialTableRowMax: '',
        volcanoDifferentialTableRowOther: [],
        maxObjectIdentifier: null,
        isVolcanoPlotSVGLoaded: true,
        isItemSelected: false,
        isItemSVGLoaded: true,
      });
    }
    if (
      changes.differentialModel !== '' &&
      changes.differentialModel !== this.props.differentialModel
    ) {
      this.doMetaFeaturesExist(
        changes.differentialStudy,
        changes.differentialModel,
      );
      this.getResultsLinkouts(
        changes.differentialStudy,
        changes.differentialModel,
      );
    }
  };

  doMetaFeaturesExist = (differentialStudy, differentialModel) => {
    omicNavigatorService
      .getMetaFeatures(differentialStudy, differentialModel)
      .then(getMetaFeaturesResponseData => {
        const exist = getMetaFeaturesResponseData.length > 0 ? true : false;
        this.setState({
          modelSpecificMetaFeaturesExist: exist,
          allMetaFeaturesDataDifferential: getMetaFeaturesResponseData,
        });
      });
  };

  getResultsLinkouts = (differentialStudy, differentialModel) => {
    const cachedResultsLinkouts = sessionStorage.getItem(
      `ResultsLinkouts-${differentialStudy}_${differentialModel}`,
    );
    if (cachedResultsLinkouts) {
      const parsedResultsLinkouts = JSON.parse(cachedResultsLinkouts);
      this.setState({
        resultsLinkouts: parsedResultsLinkouts,
      });
      const cachedResultsFavicons = sessionStorage.getItem(
        `ResultsFavicons-${differentialStudy}_${differentialModel}`,
      );
      if (cachedResultsFavicons) {
        const parsedResultsFavicons = JSON.parse(cachedResultsFavicons);
        this.setState({
          resultsFavicons: parsedResultsFavicons,
        });
      } else {
        this.setState({
          resultsFavicons: [],
        });
        omicNavigatorService
          .getFavicons(parsedResultsLinkouts)
          .then(getFaviconsResponseData => {
            const favicons = getFaviconsResponseData || [];
            this.setState({
              resultsFavicons: favicons,
            });
            sessionStorage.setItem(
              `ResultsFavicons-${differentialStudy}_${differentialModel}`,
              JSON.stringify(favicons),
            );
          });
      }
    } else {
      this.setState({
        resultsLinkouts: [],
        resultsFavicons: [],
      });
      omicNavigatorService
        .getResultsLinkouts(differentialStudy, differentialModel)
        .then(getResultsLinkoutsResponseData => {
          const linkouts = getResultsLinkoutsResponseData || [];
          this.setState({
            resultsLinkouts: linkouts,
          });
          sessionStorage.setItem(
            `ResultsLinkouts-${differentialStudy}_${differentialModel}`,
            JSON.stringify(linkouts),
          );
          omicNavigatorService
            .getFavicons(linkouts)
            .then(getFaviconsResponseData => {
              const favicons = getFaviconsResponseData || [];
              this.setState({
                resultsFavicons: favicons,
              });
              sessionStorage.setItem(
                `ResultsFavicons-${differentialStudy}_${differentialModel}`,
                JSON.stringify(favicons),
              );
            });
        });
    }
  };

  handleIsDataStreamingResultsTable = bool => {
    this.setState({
      isDataStreamingResultsTable: bool,
    });
  };

  disablePlotDifferential = () => {
    this.setState({
      multisetPlotAvailableDifferential: false,
    });
  };

  handleSearchCriteriaResetDifferential = () => {
    this.setState({
      isValidSearchDifferential: false,
      multisetPlotAvailableDifferential: false,
      plotButtonActiveDifferential: false,
      visible: false,
      isItemSelected: false,
      isItemSVGLoaded: false,
    });
  };

  handlePlotAnimationDifferential = animation => () => {
    this.setState(prevState => ({
      animation,
      visible: !prevState.visible,
      plotButtonActiveDifferential: !prevState.plotButtonActiveDifferential,
    }));
  };

  handleMultisetPlot = multisetPlotResults => {
    this.setState({
      multisetPlotInfoDifferential: {
        title: multisetPlotResults.svgInfo.plotType,
        svg: multisetPlotResults.svgInfo.svg,
      },
      multisetPlotAvailableDifferential: true,
    });
  };

  getProteinData = (
    id,
    dataItem,
    imageInfoDifferential,
    featureidSpecificMetaFeaturesExist,
    useId,
  ) => {
    const { differentialFeatureIdKey } = this.props;
    const differentialFeatureVar = useId
      ? id
      : dataItem[differentialFeatureIdKey];
    const self = this;
    this.setState(
      {
        imageInfoDifferential: imageInfoDifferential,
        imageInfoDifferentialLength: imageInfoDifferential.svg?.length || 0,
        isItemSelected: true,
        isItemSVGLoaded: false,
        // isItemDatatLoaded: false,
        currentSVGs: [],
      },
      function() {
        this.handleSearchCriteriaChangeDifferential(
          {
            differentialStudy: this.props.differentialStudy || '',
            differentialModel: this.props.differentialModel || '',
            differentialTest: this.props.differentialTest || '',
            differentialFeature: differentialFeatureVar || '',
          },
          false,
        );
        self.getPlot('Differential', id, featureidSpecificMetaFeaturesExist);
      },
    );
  };

  getTableHelpers = differentialFeatureIdKeyVar => {
    const self = this;
    let addParams = {};
    addParams.showPlotDifferential = (
      dataItem,
      alphanumericTrigger,
      featureidSpecificMetaFeaturesExist,
    ) => {
      return function() {
        let value = dataItem[alphanumericTrigger];
        let imageInfoDifferential = {
          key: `${value}`,
          title: `${alphanumericTrigger} ${value}`,
          svg: [],
        };
        self.getProteinData(
          dataItem[alphanumericTrigger],
          dataItem,
          imageInfoDifferential,
          featureidSpecificMetaFeaturesExist,
        );
      };
    };
    addParams.elementId = differentialFeatureIdKeyVar;
    this.setState({ additionalTemplateInfoDifferentialTable: addParams });
  };

  getPlot = (
    view,
    featureId,
    featureidSpecificMetaFeaturesExist,
    multiFeatureCall,
  ) => {
    const { differentialPlotTypes } = this.state;
    const {
      differentialStudy,
      differentialModel,
      differentialFeature,
      differentialFeatureIdKey,
    } = this.props;
    let self = this;
    let id = featureId != null ? featureId : differentialFeature;
    let imageInfoVar = {
      key: ``,
      title: ``,
      svg: [],
    };
    if (multiFeatureCall) {
      const featuresLength = featureId?.length || 0;
      imageInfoVar = {
        key: `(${featuresLength}-features)`,
        title: `${differentialFeatureIdKey} (${featuresLength} Features)`,
        svg: [],
      };
    } else {
      imageInfoVar = {
        key: `${featureId}`,
        title: `${differentialFeatureIdKey} ${featureId}`,
        svg: [],
      };
    }
    let currentSVGs = [];
    cancelRequestDifferentialResultsGetPlot();
    let cancelToken = new CancelToken(e => {
      cancelRequestDifferentialResultsGetPlot = e;
    });
    if (featureidSpecificMetaFeaturesExist) {
      this.getMetaFeaturesTable(featureId);
    }
    if (differentialPlotTypes.length !== 0) {
      _.forEach(differentialPlotTypes, function(plot, i) {
        if (
          (differentialPlotTypes[i].plotType === 'singleFeature' &&
            multiFeatureCall) ||
          (differentialPlotTypes[i].plotType === 'multiFeature' &&
            !multiFeatureCall)
        ) {
          return;
        }
        omicNavigatorService
          .plotStudy(
            differentialStudy,
            differentialModel,
            id,
            differentialPlotTypes[i].plotID,
            differentialPlotTypes[i].plotType || 'singleFeature',
            // self.handleItemSelected,
            null,
            cancelToken,
          )
          .then(svgUrl => {
            if (svgUrl) {
              let svgInfo = {
                plotType: differentialPlotTypes[i],
                svg: svgUrl,
              };
              imageInfoVar.svg.push(svgInfo);
              currentSVGs.push(svgUrl);
              self.handleSVG(view, imageInfoVar);
            } else {
              // self.handleItemSelected(false);
            }
          });
        // .catch(error => {
        //   self.handleItemSelected(false);
        // });
      });
    } else {
      this.setState({
        imageInfoVolcano: {
          key: null,
          title: '',
          svg: [],
        },
        isItemSVGLoaded: true,
        isVolcanoPlotSVGLoaded: true,
      });
    }
  };

  getMultifeaturePlot = view => {
    const { HighlightedFeaturesArrVolcano } = this.state;
    const { differentialFeatureIdKey } = this.props;
    if (HighlightedFeaturesArrVolcano.length > 1) {
      const featureIds = HighlightedFeaturesArrVolcano.map(
        featureId => featureId.id,
      );
      this.getProteinDataAlt(featureIds);
      // }
    } else if (HighlightedFeaturesArrVolcano.length === 1) {
      const value = HighlightedFeaturesArrVolcano[0].id;
      let imageInfoDifferential = {
        key: `${value}`,
        title: `${differentialFeatureIdKey} ${value}`,
        svg: [],
      };
      this.getProteinData(value, null, imageInfoDifferential, true, true);
    } else if (HighlightedFeaturesArrVolcano.length === 0) {
      const featureIds = this.state.differentialResults.map(
        featureId => featureId[differentialFeatureIdKey],
      );
      this.getProteinDataAlt(featureIds);
    } else return;
  };

  getProteinDataAlt = featureids => {
    const featuresString = limitValues(featureids, 100);
    this.setState(
      {
        isItemSelected: true,
        isItemSVGLoaded: false,
        // isItemDatatLoaded: false,
        currentSVGs: [],
        featuresString,
      },
      function() {
        this.handleSearchCriteriaChangeDifferential(
          {
            differentialStudy: this.props.differentialStudy || '',
            differentialModel: this.props.differentialModel || '',
            differentialTest: this.props.differentialTest || '',
            differentialFeature: '',
            // differentialFeature: `(${featuresLength} Features)` || '',
            // differentialFeatureLength: featuresLength,
          },
          false,
        );
        this.getPlot('Differential', featureids, false, true);
      },
    );
  };

  getMetaFeaturesTable = featureId => {
    const { differentialStudy, differentialModel } = this.props;
    omicNavigatorService
      .getMetaFeaturesTable(
        differentialStudy,
        differentialModel,
        featureId,
        this.handleGetMetaFeaturesTableError,
      )
      .then(getMetaFeaturesTableResponseData => {
        this.setState({
          metaFeaturesDataDifferential: getMetaFeaturesTableResponseData,
          // areDifferentialPlotTabsReady: true,
        });
      })
      .catch(error => {
        console.error('Error during getMetaFeaturesTable', error);
      });
  };

  handleGetMetaFeaturesTableError = () => {
    const { differentialStudy, differentialModel } = this.props;
    sessionStorage.setItem(
      `${differentialStudy}-${differentialModel}-MetaFeaturesExist`,
      false,
    );
    this.setState({
      areDifferentialPlotTabsReady: true,
    });
  };

  handleSelectedVolcano = toHighlightArr => {
    const enableMultifeature = toHighlightArr.length > 1 ? true : false;
    this.setState({
      HighlightedFeaturesArrVolcano: toHighlightArr,
      enableMultifeaturePlotting: enableMultifeature,
    });
    if (toHighlightArr.length > 0) {
      // unhighlight single row if already highlighted
      if (toHighlightArr.length === 1) {
        if (
          toHighlightArr[0].id === this.state.volcanoDifferentialTableRowMax
        ) {
          this.setState({
            HighlightedFeaturesArrVolcano: [],
            volcanoDifferentialTableRowMax: '',
            volcanoDifferentialTableRowOther: [],
          });
          this.handlePlotVolcano('');
          return;
        }
      }
      const MaxLine = toHighlightArr[0] || null;
      let volcanoDifferentialTableRowMaxVar = '';
      if (MaxLine !== {} && MaxLine != null) {
        volcanoDifferentialTableRowMaxVar = MaxLine.key;
      }
      const HighlightedFeaturesCopy = [...toHighlightArr];
      const SelectedFeatures = HighlightedFeaturesCopy.slice(1);
      let volcanoDifferentialTableRowOtherVar = [];
      if (
        SelectedFeatures.length > 0 &&
        SelectedFeatures != null &&
        SelectedFeatures !== {}
      ) {
        SelectedFeatures.forEach(element => {
          volcanoDifferentialTableRowOtherVar.push(element.key);
        });
      }
      const maxId = toHighlightArr[0].id || '';
      this.setState({
        volcanoDifferentialTableRowMax: volcanoDifferentialTableRowMaxVar,
        volcanoDifferentialTableRowOther: volcanoDifferentialTableRowOtherVar,
        updateVolcanoLabels: true,
      });
      this.handlePlotVolcano(maxId);
    } else {
      this.setState({
        volcanoDifferentialTableRowMax: '',
        volcanoDifferentialTableRowOther: [],
      });
      this.handlePlotVolcano('');
    }
    //}
  };

  updateVolcanoLabels = bool => {
    this.setState({
      updateVolcanoLabels: bool,
    });
  };

  handlePlotVolcano = maxId => {
    if (maxId !== '') {
      if (this.state.maxObjectIdentifier !== maxId) {
        this.setState({
          isVolcanoPlotSVGLoaded: false,
          maxObjectIdentifier: maxId,
        });
        this.getPlot('Volcano', maxId);
      }
    } else {
      this.setState({
        isVolcanoPlotSVGLoaded: true,
        maxObjectIdentifier: '',

        imageInfoVolcano: {
          key: null,
          title: '',
          svg: [],
        },
      });
    }
  };

  handleItemSelected = bool => {
    this.setState({
      isItemSelected: bool,
    });
  };

  handleSVG = (view, imageInfoArg) => {
    const imageInfoKey = `imageInfo${view}`;
    const imageInfoLengthKey = `imageInfo${view}Length`;
    this.setState({
      [imageInfoKey]: imageInfoArg,
      [imageInfoLengthKey]: imageInfoArg.svg?.length || 0,
      isItemSVGLoaded: true,
      isVolcanoPlotSVGLoaded: true,
    });
  };

  backToTable = () => {
    this.setState({
      isItemSelected: false,
      // isItemDatatLoaded: false,
      isItemSVGLoaded: false,
    });
    this.handleSearchCriteriaChangeDifferential(
      {
        differentialStudy: this.props.differentialStudy || '',
        differentialModel: this.props.differentialModel || '',
        differentialTest: this.props.differentialTest || '',
        differentialFeature: '',
      },
      false,
    );
  };

  getConfigCols = testData => {
    const differentialResultsVar = testData.differentialResults;
    const { differentialFeature } = this.props;
    const {
      resultsLinkouts,
      resultsFavicons,
      allMetaFeaturesDataDifferential,
      differentialPlotTypes,
      modelSpecificMetaFeaturesExist,
    } = this.state;
    // let differentialPlotTypes = [];
    const TableValuePopupStyle = {
      backgroundColor: '2E2E2E',
      borderBottom: '2px solid var(--color-primary)',
      color: '#FFF',
      padding: '1em',
      maxWidth: '50vw',
      fontSize: '13px',
      wordBreak: 'break-all',
    };
    let differentialAlphanumericFields = [];
    let differentialNumericFields = [];
    const firstObject = differentialResultsVar[0];
    for (let [key, value] of Object.entries(firstObject)) {
      if (typeof value === 'string' || value instanceof String) {
        differentialAlphanumericFields.push(key);
      } else {
        differentialNumericFields.push(key);
      }
    }
    const alphanumericTrigger = differentialAlphanumericFields[0];
    if (differentialFeature !== '') {
      // on page refresh, handle if differential features is selected
      let imageInfoDifferential = {
        key: `${differentialFeature}`,
        title: `${alphanumericTrigger} ${differentialFeature}`,
        svg: [],
      };
      this.setState({
        imageInfoDifferential: imageInfoDifferential,
        imageInfoDifferentialLength: imageInfoDifferential.svg?.length || 0,
        isItemSelected: true,
        isItemSVGLoaded: false,
        // isItemDatatLoaded: false,
        currentSVGs: [],
      });
      this.getPlot('Differential', differentialFeature, true);
    }
    this.props.onHandleDifferentialFeatureIdKey(
      'differentialFeatureIdKey',
      alphanumericTrigger,
    );
    this.getTableHelpers(alphanumericTrigger);
    const self = this;
    const differentialAlphanumericColumnsMapped = differentialAlphanumericFields.map(
      (f, { index }) => {
        const noPlots = differentialPlotTypes.length === 0;

        if (noPlots) {
          self.setState({
            tabsMessage: 'No plots available',
          });
        }
        if (noPlots && !modelSpecificMetaFeaturesExist) {
          self.setState({
            tabsMessage: 'No plots available',
          });
        }
        return {
          title: f,
          field: f,
          filterable: { type: 'multiFilter' },
          template: (value, item, addParams) => {
            const keyVar = `${item[f]}-${item[alphanumericTrigger]}`;
            const mappedMetafeaturesFeatureIds = allMetaFeaturesDataDifferential.map(
              meta => meta[alphanumericTrigger],
            );
            const featureidSpecificMetaFeaturesExist = mappedMetafeaturesFeatureIds.includes(
              item[alphanumericTrigger],
            );
            const featureIdClass =
              noPlots && !featureidSpecificMetaFeaturesExist
                ? 'TableCellBold NoSelect'
                : 'TableCellLink NoSelect';
            const featureIdClick =
              noPlots && !featureidSpecificMetaFeaturesExist
                ? null
                : addParams.showPlotDifferential(
                    item,
                    alphanumericTrigger,
                    featureidSpecificMetaFeaturesExist,
                  );
            const resultsLinkoutsKeys = Object.keys(resultsLinkouts);
            let linkoutWithIcon = null;
            if (resultsLinkoutsKeys.includes(f)) {
              if (item[f] != null && item[f] !== '') {
                const columnLinkoutsObj = resultsLinkouts[f];
                const columnFaviconsObj = resultsFavicons[f];
                const columnLinkoutsIsArray = Array.isArray(columnLinkoutsObj);
                let favicons = [];
                if (columnFaviconsObj != null) {
                  const columnFaviconsIsArray = Array.isArray(
                    columnFaviconsObj,
                  );
                  favicons = columnFaviconsIsArray
                    ? columnFaviconsObj
                    : [columnFaviconsObj];
                }
                const linkouts = columnLinkoutsIsArray
                  ? columnLinkoutsObj
                  : [columnLinkoutsObj];

                const itemValue = item[f];
                linkoutWithIcon = (
                  <Linkout {...{ keyVar, itemValue, linkouts, favicons }} />
                );
              }
            }
            if (f === alphanumericTrigger) {
              return (
                <div className="NoSelect" key={keyVar}>
                  <Popup
                    trigger={
                      <span className={featureIdClass} onClick={featureIdClick}>
                        {splitValue(value)}
                      </span>
                    }
                    style={TableValuePopupStyle}
                    className="TablePopupValue"
                    content={value}
                    inverted
                    basic
                    closeOnTriggerClick
                  />
                  {linkoutWithIcon}
                </div>
              );
            } else {
              return (
                <div className="NoSelect" key={keyVar}>
                  <Popup
                    trigger={<span className="">{splitValue(value)}</span>}
                    style={TableValuePopupStyle}
                    className="TablePopupValue"
                    content={value}
                    inverted
                    basic
                  />
                  {linkoutWithIcon}
                </div>
              );
            }
          },
        };
      },
    );
    const thresholdColsDifferential = this.listToJson(
      differentialNumericFields,
    );
    this.setState({
      thresholdColsP: thresholdColsDifferential,
      filterableColumnsP: [...differentialNumericFields],
    });
    const differentialNumericColumnsMapped = differentialNumericFields.map(
      c => {
        return {
          title: c,
          field: c,
          type: 'number',
          filterable: { type: 'numericFilter' },
          exportTemplate: value => (value ? `${value}` : 'N/A'),
          template: (value, item, addParams) => {
            return (
              <div className="NoSelect">
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
              </div>
            );
          },
        };
      },
    );
    const configCols = differentialAlphanumericColumnsMapped.concat(
      differentialNumericColumnsMapped,
    );
    return configCols;
  };

  listToJson(list) {
    var valueJSON = [];
    for (var i = 0; i < list.length; i++) {
      valueJSON.push({
        key: list[i],
        text: list[i],
        value: list[i],
      });
    }
    return valueJSON;
  }

  getMessage = () => {
    const {
      differentialStudy,
      differentialModel,
      differentialTest,
    } = this.props;
    if (differentialStudy === '') {
      return 'study';
    } else if (differentialModel === '') {
      return 'model';
    } else if (differentialTest === '') {
      return 'test';
    } else return '';
  };

  getView = () => {
    const message = this.getMessage();
    if (this.state.isSearchingDifferential) {
      return <TransitionActive />;
    } else if (
      this.state.isValidSearchDifferential &&
      !this.state.isSearchingDifferential
    ) {
      return (
        <DifferentialVolcano
          {...this.state}
          {...this.props}
          onHandleSelectedVolcano={this.handleSelectedVolcano}
          onVolcanoSVGSizeChange={this.handleVolcanoSVGSizeChange}
          onHandleVolcanoTableLoading={this.handleVolcanoTableLoading}
          onBackToTable={this.backToTable}
          onUpdateVolcanoLabels={this.updateVolcanoLabels}
          fwdRefDVC={this.differentialViewContainerRef}
          onGetMultifeaturePlot={this.getMultifeaturePlot}
        />
      );
    } else return <TransitionStill stillMessage={message} />;
  };

  render() {
    const differentialView = this.getView();
    const {
      multisetPlotInfoDifferential,
      animation,
      direction,
      visible,
    } = this.state;
    const { tab, differentialStudy, differentialModel } = this.props;
    const pxToPtRatio = 105;
    const pointSize = 12;
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    // const divWidth =
    //   this.differentialViewContainerRef?.current?.parentElement?.offsetWidth ||
    //   width - 310;
    const divWidth = width * 0.75;
    const divHeight = height * 0.85;
    const divWidthPt = roundToPrecision(divWidth / pxToPtRatio, 1);
    const divHeightPt = roundToPrecision(divHeight / pxToPtRatio, 1);
    const divWidthPtString = `width=${divWidthPt}`;
    const divHeightPtString = `&height=${divHeightPt}`;
    const pointSizeString = `&pointsize=${pointSize}`;
    const dimensions = `?${divWidthPtString}${divHeightPtString}${pointSizeString}`;
    const srcUrl = `${multisetPlotInfoDifferential.svg}${dimensions}`;
    const VerticalSidebar = ({ animation, visible }) => (
      <Sidebar
        as={'div'}
        animation={animation}
        direction={direction}
        icon="labeled"
        vertical="true"
        visible={visible}
        width="very wide"
        className="VerticalSidebarPlot"
      >
        <Grid className="">
          <Grid.Row className="ActionsRow">
            <Grid.Column
              mobile={16}
              tablet={16}
              largeScreen={16}
              widescreen={16}
            >
              <ButtonActions
                exportButtonSize={'small'}
                excelVisible={false}
                pngVisible={true}
                pdfVisible={false}
                svgVisible={true}
                txtVisible={false}
                plot={'differentialMultisetAnalysisSVG'}
                tab={tab}
                study={differentialStudy}
                model={differentialModel}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div className="MultisetSvgOuter">
          <SVG
            cacheRequests={true}
            // description=""
            // loader={<span>{loadingDimmer}</span>}
            // onError={error => console.log(error.message)}
            // onLoad={(src, hasCache) => console.log(src, hasCache)}
            // preProcessor={code => code.replace(/fill=".*?"/g, 'fill="currentColor"')}
            src={srcUrl}
            // title={`${s.plotType.plotDisplay}`}
            uniqueHash="b2g9e2"
            uniquifyIDs={true}
          />
        </div>
      </Sidebar>
    );
    return (
      <Grid>
        <Grid.Row className="DifferentialContainer">
          <Grid.Column
            className="SidebarContainer"
            mobile={16}
            tablet={16}
            largeScreen={4}
            widescreen={4}
          >
            <DifferentialSearchCriteria
              {...this.state}
              {...this.props}
              onSearchTransitionDifferential={
                this.handleSearchTransitionDifferential
              }
              onDifferentialSearch={this.handleDifferentialSearch}
              onDifferentialSearchUnfiltered={
                this.handleDifferentialSearchUnfiltered
              }
              onSearchCriteriaChangeDifferential={
                this.handleSearchCriteriaChangeDifferential
              }
              onSearchCriteriaResetDifferential={
                this.handleSearchCriteriaResetDifferential
              }
              onDisablePlotDifferential={this.disablePlotDifferential}
              onGetMultisetPlotDifferential={this.handleMultisetPlot}
              onHandlePlotAnimationDifferential={
                this.handlePlotAnimationDifferential
              }
              onMultisetQueriedDifferential={
                this.handleMultisetQueriedDifferential
              }
              onSetStudyModelTestMetadata={this.setStudyModelTestMetadata}
              onSetTestsMetadata={this.setTestsMetadata}
              onHandlePlotTypesDifferential={this.handlePlotTypesDifferential}
              onHandleVolcanoTableLoading={this.handleVolcanoTableLoading}
              onDoMetaFeaturesExist={this.doMetaFeaturesExist}
              onGetResultsLinkouts={this.getResultsLinkouts}
              onHandleIsDataStreamingResultsTable={
                this.handleIsDataStreamingResultsTable
              }
            />
          </Grid.Column>
          <Grid.Column
            className="DifferentialContentContainer"
            mobile={16}
            tablet={16}
            largeScreen={12}
            widescreen={12}
          >
            <Sidebar.Pushable as={'span'}>
              <VerticalSidebar
                animation={animation}
                direction={direction}
                visible={visible}
              />
              <Sidebar.Pusher>
                <div
                  className="DifferentialViewContainer"
                  ref={this.differentialViewContainerRef}
                >
                  {differentialView}
                </div>
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withRouter(Differential);
