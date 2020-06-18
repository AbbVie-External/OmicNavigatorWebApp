import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Form,
  Select,
  Icon,
  Popup,
  Divider,
  Radio,
  Transition,
} from 'semantic-ui-react';
import { CancelToken } from 'axios';
import '../Shared/SearchCriteria.scss';
import { phosphoprotService } from '../../services/phosphoprot.service';
import PepplotMultisetFilters from './PepplotMultisetFilters';

let cancelRequestPSCGetResultsTable = () => {};
let cancelRequestMultisetInferenceData = () => {};
let cancelRequestInferenceMultisetPlot = () => {};
class PepplotSearchCriteria extends Component {
  state = {
    pepplotStudies: [],
    pepplotStudyHrefVisible: false,
    pepplotStudyHref: '',
    pepplotModels: [],
    pepplotTests: [],
    pepplotModelTooltip: '',
    pepplotTestTooltip: '',
    pepplotStudiesDisabled: true,
    pepplotModelsDisabled: true,
    pepplotTestsDisabled: true,
    uAnchorP: '',
    selectedColP: [
      {
        key: 'adj_P_Val',
        text: 'Adjusted P Value',
        value: 'adj_P_Val',
      },
    ],
    selectedOperatorP: [
      {
        key: '<',
        text: '<',
        value: '<',
      },
    ],
    sigValueP: [0.05],
    reloadPlot: true,
    uSettingsP: {
      defaultselectedColP: {
        key: 'adj_P_Val',
        text: 'Adjusted P',
        value: 'adj_P_Val',
      },
      defaultselectedOperatorP: {
        key: '<',
        text: '<',
        value: '<',
      },
      defaultsigValueP: 0.05,
      useAnchorP: true,
      hoveredFilter: -1,
      mustP: [],
      notP: [],
      displayMetaDataP: true,
      templateName: 'pepplot-multiset',
      numElementsP: undefined,
      maxElementsP: undefined,
      indexFiltersP: [0],
      metaSvgP: '',
      heightScalarP: 1,
      thresholdOperatorP: [
        {
          key: '<',
          text: '<',
          value: '<',
        },
        {
          key: '>',
          text: '>',
          value: '>',
        },
        {
          key: '|<|',
          text: '|<|',
          value: '|<|',
        },
        {
          key: '|>|',
          text: '|>|',
          value: '|>|',
        },
      ],
    },
    multisetFiltersVisibleP: false,
    activateMultisetFiltersP: false,
    uDataP: [],
    // loadingPepplotMultisetFilters: false,
    pepplotStudyMetadata: [],
    pepplotModelsAndTests: [],
    pepplotTestsMeta: [],
  };

  componentDidMount() {
    this.setState({
      pepplotStudiesDisabled: false,
    });
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.allStudiesMetadata !== prevProps.allStudiesMetadata ||
      this.props.pepplotStudy !== prevProps.pepplotStudy
    ) {
      this.populateDropdowns();
    }
  }

  populateDropdowns = () => {
    const {
      allStudiesMetadata,
      pepplotStudy,
      pepplotModel,
      pepplotTest,
      pepplotProteinSite,
      onSearchCriteriaChange,
      onSearchTransitionPepplot,
    } = this.props;
    const studies = allStudiesMetadata.map(study => {
      const studyName = study.name;
      return { key: `${studyName}Pepplot`, text: studyName, value: studyName };
    });
    this.setState({
      pepplotStudies: studies,
    });
    if (pepplotStudy !== '') {
      this.setState({
        pepplotStudyHrefVisible: true,
        pepplotStudyHref: `http://www.localhost:3000/${pepplotStudy}.html`,
      });

      // loop through allStudiesMetadata to find the object with the name matching pepplotStudy
      const allStudiesMetadataCopy = [...allStudiesMetadata];
      const pepplotStudyData = allStudiesMetadataCopy.find(
        study => study.name === pepplotStudy,
      );
      const pepplotModelsAndTests = pepplotStudyData?.results || [];
      this.setState({
        pepplotStudyMetadata: pepplotStudyData,
        pepplotModelsAndTests: pepplotModelsAndTests,
      });
      const pepplotModelsMapped = pepplotModelsAndTests.map(result => {
        return {
          key: `${result.modelID}Pepplot`,
          text: result.modelID,
          value: result.modelID,
        };
      });

      this.setState({
        pepplotModelsDisabled: false,
        pepplotModels: pepplotModelsMapped,
      });

      if (pepplotModel !== '') {
        const pepplotModelWithTests = pepplotModelsAndTests.find(
          model => model.modelID === pepplotModel,
        );
        const pepplotModelTooltip = pepplotModelWithTests?.modelDisplay || '';
        this.setState({
          pepplotModelTooltip: pepplotModelTooltip,
        });
        const pepplotTestsMeta = pepplotModelWithTests?.tests || [];
        const pepplotTestsMapped = pepplotTestsMeta.map(test => {
          return {
            key: `${test.testID}Pepplot`,
            text: test.testID,
            value: test.testID,
          };
        });
        const uDataPMapped = pepplotTestsMeta.map(t => t.testID);
        this.setState({
          pepplotTestsDisabled: false,
          pepplotTests: pepplotTestsMapped,
          pepplotTestsMeta,
          uDataP: uDataPMapped,
        });

        if (pepplotTest !== '') {
          onSearchCriteriaChange(
            {
              pepplotStudy: pepplotStudy,
              pepplotModel: pepplotModel,
              pepplotTest: pepplotTest,
              pepplotProteinSite: pepplotProteinSite,
            },
            false,
          );
          const pepplotTestMeta = pepplotTestsMeta.find(
            test => test.testID === pepplotTest,
          );
          const pepplotTestTooltip = pepplotTestMeta?.testDisplay || '';
          this.setState({
            pepplotTestTooltip,
            uAnchorP: pepplotTest,
          });
          onSearchTransitionPepplot(true);
          phosphoprotService
            .getResultsTable(
              pepplotStudy,
              pepplotModel,
              pepplotTest,
              onSearchTransitionPepplot,
            )
            .then(getResultsTableData => {
              this.handleGetResultsTableData(
                getResultsTableData,
                false,
                true,
                pepplotTest,
              );
            })
            .catch(error => {
              console.error('Error during getResultsTable', error);
            });
        }
      }
    }
  };

  handleStudyChange = (evt, { name, value }) => {
    console.log(
      '[PepplotSearchCriteria.jsx] handleStudyChange ',
      window.location.href,
    );

    const { onSearchCriteriaChange, onSearchCriteriaReset } = this.props;
    onSearchCriteriaChange(
      {
        [name]: value,
        pepplotModel: '',
        pepplotTest: '',
      },
      true,
    );
    onSearchCriteriaReset({
      isValidSearchPepplot: false,
    });
    this.setState({
      pepplotStudyHrefVisible: true,
      pepplotStudyHref: `http://www.localhost:3000/${value}.html`,
      pepplotModelsDisabled: true,
      pepplotTestsDisabled: true,
      pepplotModelTooltip: '',
      pepplotTestTooltip: '',
    });
  };

  handleModelChange = (evt, { name, value }) => {
    console.log(
      '[PepplotSearchCriteria.jsx] handleModelChange ',
      window.location.href,
    );
    console.log(this.props);
    const {
      pepplotStudy,
      onSearchCriteriaChange,
      onSearchCriteriaReset,
    } = this.props;

    console.log(
      '[PepplotSearchCriteria.jsx] handleModelChange 1.10 ',
      window.location.href,
    );
    debugger;
    onSearchCriteriaChange(
      {
        pepplotStudy: pepplotStudy,
        [name]: value,
        pepplotTest: '',
      },
      true,
    );
    console.log(
      '[PepplotSearchCriteria.jsx] handleModelChange 1.11 ',
      window.location.href,
    );
    onSearchCriteriaReset({
      isValidSearchPepplot: false,
    });
    console.log(
      '[PepplotSearchCriteria.jsx] handleModelChange 1.12 ',
      window.location.href,
    );
    const { pepplotModelsAndTests } = this.state;
    const pepplotModelsAndTestsCopy = [...pepplotModelsAndTests];
    const pepplotModelWithTests = pepplotModelsAndTestsCopy.find(
      model => model.modelID === value,
    );
    console.log(
      '[PepplotSearchCriteria.jsx] handleModelChange 1.25 ',
      window.location.href,
    );
    const pepplotModelTooltip = pepplotModelWithTests?.modelDisplay || '';
    const pepplotTestsMeta = pepplotModelWithTests?.tests || [];
    const pepplotTestsMapped = pepplotTestsMeta.map(test => {
      return {
        key: test.testID,
        text: test.testID,
        value: test.testID,
      };
    });
    console.log(
      '[PepplotSearchCriteria.jsx] handleModelChange 1.5 ',
      window.location.href,
    );
    const uDataP = pepplotTestsMeta.map(t => t.testID);
    this.setState({
      pepplotTestsDisabled: false,
      pepplotTestsMeta: pepplotTestsMeta,
      pepplotTests: pepplotTestsMapped,
      uDataP: uDataP,
      pepplotModelTooltip: pepplotModelTooltip,
      pepplotTestTooltip: '',
    });
    console.log(
      '[PepplotSearchCriteria.jsx] handleModelChange 2 ',
      window.location.href,
    );
  };

  handleTestChange = (evt, { name, value }) => {
    console.log(
      '[PepplotSearchCriteria.jsx] handleTestChange ',
      window.location.href,
    );

    const {
      pepplotStudy,
      pepplotModel,
      onMultisetQueried,
      onSearchCriteriaChange,
      onSearchTransitionPepplot,
    } = this.props;
    const pepplotTestMeta = this.state.pepplotTestsMeta.find(
      test => test.testID === value,
    );
    const pepplotTestTooltip = pepplotTestMeta?.testDisplay || '';
    this.setState({
      pepplotTestTooltip: pepplotTestTooltip,
      reloadPlot: true,
      multisetFiltersVisibleP: false,
    });
    onMultisetQueried(false);
    onSearchCriteriaChange(
      {
        pepplotStudy: pepplotStudy,
        pepplotModel: pepplotModel,
        [name]: value,
      },
      true,
    );
    onSearchTransitionPepplot(true);
    cancelRequestPSCGetResultsTable();
    let cancelToken = new CancelToken(e => {
      cancelRequestPSCGetResultsTable = e;
    });
    phosphoprotService
      .getResultsTable(
        pepplotStudy,
        pepplotModel,
        value,
        onSearchTransitionPepplot,
        cancelToken,
      )
      .then(getResultsTableData => {
        this.handleGetResultsTableData(getResultsTableData, true, true, value);
      })
      .catch(error => {
        console.error('Error during getResultsTable', error);
      });
  };

  handleGetResultsTableData = (
    tableData,
    resetMultiset,
    handleMaxElements,
    pepplotTest,
  ) => {
    const { onPepplotSearchUnfiltered, onPepplotSearch } = this.props;
    if (resetMultiset) {
      this.setState({
        uSettingsP: {
          ...this.state.uSettingsP,
          mustP: [],
          notP: [],
          defaultsigValueP: 0.05,
          maxElementsP: handleMaxElements ? tableData.length : undefined,
        },
        sigValueP: [0.05],
        uAnchorP: pepplotTest,
      });
    }
    onPepplotSearchUnfiltered({ pepplotResults: tableData });
    onPepplotSearch({ pepplotResults: tableData });
  };

  handleMultisetToggle = () => {
    return evt => {
      if (this.state.multisetFiltersVisibleP === false) {
        // on toggle open
        this.setState({
          multisetFiltersVisibleP: true,
        });
        this.props.onMultisetQueried(true);
        this.updateQueryDataP({
          mustP: this.state.uSettingsP.mustP,
          notP: this.state.uSettingsP.notP,
          sigValueP: this.state.sigValueP,
          selectedColP: this.state.selectedColP,
          selectedOperatorP: this.state.selectedOperatorP,
        });
      } else {
        // on toggle close
        this.setState({
          multisetFiltersVisibleP: false,
          reloadPlot: false,
        });
        this.props.onMultisetQueried(false);
        const pepplotTestName = 'pepplotTest';
        const pepplotTestVar = this.props.pepplotTest;
        this.multisetTriggeredTestChange(pepplotTestName, pepplotTestVar);
      }
    };
  };

  handleMultisetPOpenError = () => {
    cancelRequestInferenceMultisetPlot();
    this.setState({
      multisetFiltersVisibleP: false,
    });
    console.log('Error during getResultsIntersection');
  };

  handleMultisetPCloseError = () => {
    this.props.onSearchTransitionPepplot(false);
    this.setState(
      {
        multisetFiltersVisibleP: true,
        reloadPlot: true,
      },
      this.updateQueryDataP(),
    );
    console.log('Error during getResultsTable');
  };

  multisetTriggeredTestChange = (name, value) => {
    const {
      pepplotStudy,
      pepplotModel,
      onSearchCriteriaChange,
      onSearchTransitionPepplot,
    } = this.props;
    onSearchCriteriaChange(
      {
        pepplotStudy: pepplotStudy,
        pepplotModel: pepplotModel,
        [name]: value,
      },
      true,
    );
    onSearchTransitionPepplot(true);
    cancelRequestPSCGetResultsTable();
    let cancelToken = new CancelToken(e => {
      cancelRequestPSCGetResultsTable = e;
    });
    phosphoprotService
      .getResultsTable(
        pepplotStudy,
        pepplotModel,
        value,
        this.handleMultisetPCloseError,
        cancelToken,
      )
      .then(getResultsTableData => {
        this.handleGetResultsTableData(
          getResultsTableData,
          false,
          false,
          value,
        );
      })
      .catch(error => {
        console.error('Error during getResultsTable', error);
      });
  };

  addFilterPepplot = () => {
    // this.setState({ loadingPepplotMultisetFilters: true });
    // const uSetVP = _.cloneDeep(this.state.uSettingsP);
    const uSetVP = { ...this.state.uSettingsP };
    uSetVP.indexFiltersP = [...this.state.uSettingsP.indexFiltersP].concat(
      this.state.uSettingsP.indexFiltersP.length,
    );
    this.setState({
      selectedColP: [...this.state.selectedColP].concat(
        this.state.uSettingsP.defaultselectedColP,
      ),
      selectedOperatorP: [...this.state.selectedOperatorP].concat(
        this.state.uSettingsP.defaultselectedOperatorP,
      ),
      sigValueP: [...this.state.sigValueP].concat(
        this.state.uSettingsP.defaultsigValueP,
      ),
      uSettingsP: uSetVP,
    });
  };

  removeFilterPepplot = index => {
    // this.setState({ loadingPepplotMultisetFilters: true });
    const uSetVP = { ...this.state.uSettingsP };
    uSetVP.indexFiltersP = [...uSetVP.indexFiltersP]
      .slice(0, index)
      .concat([...uSetVP.indexFiltersP].slice(index + 1));
    for (var i = index; i < uSetVP.indexFiltersP.length; i++) {
      uSetVP.indexFiltersP[i]--;
    }
    this.setState({
      selectedColP: [...this.state.selectedColP]
        .slice(0, index)
        .concat([...this.state.selectedColP].slice(index + 1)),
      selectedOperatorP: [...this.state.selectedOperatorP]
        .slice(0, index)
        .concat([...this.state.selectedOperatorP].slice(index + 1)),
      sigValueP: [...this.state.sigValueP]
        .slice(0, index)
        .concat([...this.state.sigValueP].slice(index + 1)),
      uSettingsP: uSetVP,
    });
  };
  changeHoveredFilter = index => {
    const uSetVP = { ...this.state.uSettingsP };
    uSetVP.hoveredFilter = index;
    this.setState({ uSettingsP: uSetVP });
  };
  handleDropdownChange = (evt, { name, value, index }) => {
    const uSelVP = [...this.state[name]];
    uSelVP[index] = {
      key: value,
      text: value,
      value: value,
    };
    this.setState(
      {
        [name]: uSelVP,
        reloadPlot: false,
      },
      function() {
        this.updateQueryDataP();
      },
    );
  };
  handleSigValuePInputChange = (evt, { name, value, index }) => {
    const uSelVP = [...this.state[name]];
    uSelVP[index] = parseFloat(value);
    this.setState(
      {
        [name]: uSelVP,
        reloadPlot: true,
      },
      function() {
        this.updateQueryDataP();
      },
    );
  };
  handleSetChange = ({ mustP, notP }) => {
    const uSettingsVP = this.state.uSettingsP;
    uSettingsVP.mustP = mustP;
    uSettingsVP.notP = notP;
    this.setState(
      {
        uSettingsP: uSettingsVP,
        reloadPlot: false,
      },
      function() {
        this.updateQueryDataP();
      },
    );
  };

  updateQueryDataP = () => {
    const {
      pepplotStudy,
      pepplotModel,
      pepplotTest,
      onPepplotSearch,
      onDisablePlot,
    } = this.props;
    const {
      selectedOperatorP,
      reloadPlot,
      sigValueP,
      selectedColP,
    } = this.state;
    const eMustP = this.state.uSettingsP.mustP;
    const eNotP = this.state.uSettingsP.notP;

    if (reloadPlot === true) {
      onDisablePlot();
      this.getMultisetPlot(
        sigValueP,
        pepplotModel,
        pepplotStudy,
        this.jsonToList(selectedOperatorP),
        this.jsonToList(selectedColP),
      );
    }
    cancelRequestMultisetInferenceData();
    let cancelToken = new CancelToken(e => {
      cancelRequestMultisetInferenceData = e;
    });
    phosphoprotService
      .getResultsIntersection(
        pepplotStudy,
        pepplotModel,
        pepplotTest,
        eMustP,
        eNotP,
        sigValueP,
        this.jsonToList(selectedOperatorP),
        this.jsonToList(selectedColP),
        this.handleMultisetPOpenError,
        cancelToken,
      )
      .then(inferenceData => {
        const multisetResultsP = inferenceData;
        this.setState({
          uSettingsP: {
            ...this.state.uSettingsP,
            numElementsP: multisetResultsP.length,
            maxElementsP: this.state.uSettingsP.maxElementsP,
            mustP: eMustP,
            notP: eNotP,
          },
          activateMultisetFiltersP: true,
          reloadPlot: false,
          // loadingPepplotMultisetFilters: false,
        });
        onPepplotSearch({
          pepplotResults: multisetResultsP,
        });
      })
      .catch(error => {
        console.error('Error during getResultsIntersection', error);
      });
  };

  jsonToList(json) {
    var valueList = [];
    for (var i = 0; i < json.length; i++) {
      valueList.push(json[i].value);
    }
    return valueList;
  }

  getMultisetPlot(sigVal, pepplotModel, pepplotStudy, eOperatorP, eColP) {
    cancelRequestInferenceMultisetPlot();
    let cancelToken = new CancelToken(e => {
      cancelRequestInferenceMultisetPlot = e;
    });
    let heightCalculation = this.calculateHeight;
    let widthCalculation = this.calculateWidth;
    phosphoprotService
      .getResultsUpset(
        pepplotStudy,
        pepplotModel,
        sigVal,
        eOperatorP,
        eColP,
        undefined,
        cancelToken,
      )
      .then(svgMarkupRaw => {
        let svgMarkup = svgMarkupRaw.data;
        svgMarkup = svgMarkup.replace(
          /<svg/g,
          '<svg preserveAspectRatio="xMinYMid meet" style="width:' +
            widthCalculation() * 0.8 +
            'px; height:' +
            heightCalculation() * 0.8 +
            'px;" id="multisetAnalysisSVG"',
        );
        let svgInfo = { plotType: 'Multiset', svg: svgMarkup };
        this.props.onGetMultisetPlot({
          svgInfo,
        });
      })
      .catch(error => {
        console.error('Error during getResultsUpset', error);
      });
  }

  calculateHeight() {
    var h = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0,
    );
    return h;
  }

  calculateWidth() {
    var w = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0,
    );
    return w;
  }

  render() {
    const {
      pepplotStudies,
      pepplotStudyHref,
      pepplotStudyHrefVisible,
      pepplotModels,
      pepplotModelTooltip,
      pepplotTests,
      pepplotTestTooltip,
      pepplotStudiesDisabled,
      pepplotModelsDisabled,
      pepplotTestsDisabled,
      multisetFiltersVisibleP,
      activateMultisetFiltersP,
    } = this.state;

    const {
      pepplotStudy,
      pepplotModel,
      pepplotTest,
      isValidSearchPepplot,
      multisetPlotAvailable,
      plotButtonActive,
    } = this.props;

    const StudyPopupStyle = {
      backgroundColor: '2E2E2E',
      borderBottom: '2px solid var(--color-primary)',
      color: '#FFF',
      padding: '1em',
      fontSize: '13px',
    };

    let studyIcon;
    let studyName = `${pepplotStudy} Analysis Details`;

    if (pepplotStudyHrefVisible) {
      studyIcon = (
        <Popup
          trigger={
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={pepplotStudyHref}
            >
              <Icon
                name="line graph"
                size="large"
                className="StudyHtmlIcon"
                inverted
                circular
              />
            </a>
          }
          style={StudyPopupStyle}
          className="CustomTooltip"
          inverted
          basic
          position="bottom center"
          content={studyName}
          mouseEnterDelay={0}
          mouseLeaveDelay={0}
        />
      );
    } else {
      studyIcon = (
        <Popup
          trigger={
            <a target="_blank" rel="noopener noreferrer" href={'/'}>
              <Icon name="line graph" size="large" circular inverted disabled />
            </a>
          }
          style={StudyPopupStyle}
          basic
          inverted
          className="CustomTooltip"
          position="bottom center"
          content="Select a study to view Analysis Details"
          mouseEnterDelay={0}
          mouseLeaveDelay={0}
        />
      );
    }

    let PMultisetFilters;
    if (
      isValidSearchPepplot &&
      activateMultisetFiltersP &&
      multisetFiltersVisibleP
    ) {
      PMultisetFilters = (
        <PepplotMultisetFilters
          {...this.props}
          {...this.state}
          onHandleDropdownChange={this.handleDropdownChange}
          onHandleSigValuePInputChange={this.handleSigValuePInputChange}
          onHandleSetChange={this.handleSetChange}
          onAddFilterPepplot={this.addFilterPepplot}
          onRemoveFilterPepplot={this.removeFilterPepplot}
          onChangeHoveredFilter={this.changeHoveredFilter}
        />
      );
    }

    let PlotRadio;
    let MultisetRadio;

    if (isValidSearchPepplot) {
      PlotRadio = (
        <Transition
          visible={!multisetPlotAvailable}
          animation="flash"
          duration={1500}
        >
          <Radio
            toggle
            label="View Plot"
            className={multisetPlotAvailable ? 'ViewPlotRadio' : ''}
            checked={plotButtonActive}
            onChange={this.props.onHandlePlotAnimation('uncover')}
            disabled={!multisetPlotAvailable}
          />
        </Transition>
      );

      MultisetRadio = (
        <React.Fragment>
          <Divider />
          <Radio
            toggle
            label="Set Analysis"
            checked={multisetFiltersVisibleP}
            onChange={this.handleMultisetToggle()}
          />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Form className="SearchCriteriaContainer">
          <Form.Field
            control={Select}
            name="pepplotStudy"
            value={pepplotStudy}
            options={pepplotStudies}
            placeholder="Select A Study"
            onChange={this.handleStudyChange}
            disabled={pepplotStudiesDisabled}
            label={{
              children: 'Study',
              htmlFor: 'form-select-control-pstudy',
            }}
            search
            searchInput={{ id: 'form-select-control-pstudy' }}
            width={13}
            selectOnBlur={false}
            selectOnNavigation={false}
          />
          <span className="StudyHtmlIconDivP">{studyIcon}</span>
          <Popup
            trigger={
              <Form.Field
                control={Select}
                name="pepplotModel"
                value={pepplotModel}
                options={pepplotModels}
                placeholder="Select Model"
                onChange={this.handleModelChange}
                disabled={pepplotModelsDisabled}
                label={{
                  children: 'Model',
                  htmlFor: 'form-select-control-pmodel',
                }}
                search
                searchInput={{ id: 'form-select-control-pmodel' }}
                selectOnBlur={false}
                selectOnNavigation={false}
              />
            }
            style={StudyPopupStyle}
            disabled={pepplotModelTooltip === ''}
            className="CustomTooltip"
            inverted
            position="bottom right"
            content={pepplotModelTooltip}
            mouseEnterDelay={1000}
            mouseLeaveDelay={0}
          />
          <Popup
            trigger={
              <Form.Field
                control={Select}
                name="pepplotTest"
                value={pepplotTest}
                options={pepplotTests}
                placeholder="Select Test"
                onChange={this.handleTestChange}
                disabled={pepplotTestsDisabled}
                label={{
                  children: 'Test',
                  htmlFor: 'form-select-control-ptest',
                }}
                search
                searchInput={{ id: 'form-select-control-ptest' }}
                selectOnBlur={false}
                selectOnNavigation={false}
              />
            }
            style={StudyPopupStyle}
            disabled={pepplotTestTooltip === ''}
            className="CustomTooltip"
            inverted
            position="bottom right"
            content={pepplotTestTooltip}
            mouseEnterDelay={1000}
            mouseLeaveDelay={0}
          />
        </Form>
        <div className="MultisetContainer">
          <div className="SliderDiv">
            <span className="MultisetRadio">{MultisetRadio}</span>
            <span className="PlotRadio">{PlotRadio}</span>
          </div>
          <div className="MultisetFiltersDiv">{PMultisetFilters}</div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(PepplotSearchCriteria);
