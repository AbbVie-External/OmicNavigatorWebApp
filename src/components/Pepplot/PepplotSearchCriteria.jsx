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
import _ from 'lodash';
import PepplotMultisetFilters from './PepplotMultisetFilters';

let cancelRequestPSCGetTestData = () => {};
let cancelRequestMultisetInferenceData = () => {};
let cancelRequestInferenceMultisetPlot = () => {};
class PepplotSearchCriteria extends Component {
  state = {
    pepplotStudies: [],
    pepplotStudyHrefVisible: false,
    pepplotStudyHref: '',
    pepplotModels: [],
    pepplotTests: [],
    pepplotStudiesDisabled: false,
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
  };

  componentDidMount() {
    const s = this.props.pepplotStudy || '';
    const m = this.props.pepplotModel || '';
    const t = this.props.pepplotTest || '';
    const p = this.props.pepplotProteinSite || '';
    if (s !== '') {
      this.setState({
        pepplotStudyHrefVisible: true,
        pepplotStudyHref: `http://www.localhost:3000/${s}.html`,
      });
      phosphoprotService
        .getModelNames('inferenceNames', s + 'plots')
        .then(modelsFromService => {
          this.allNames = modelsFromService;
          const modelsArr = _.map(_.keys(modelsFromService), function(
            modelName,
          ) {
            return { key: modelName, text: modelName, value: modelName };
          });
          this.setState({
            pepplotModelsDisabled: false,
            pepplotModels: modelsArr,
          });
          if (m !== '') {
            const testsArr = _.map(this.allNames[m], function(testName) {
              return { key: testName, text: testName, value: testName };
            });
            const uDataPArr = this.allNames[m];
            this.setState({
              pepplotTestsDisabled: false,
              pepplotTests: testsArr,
              uDataP: uDataPArr,
            });
          }
        })
        .catch(error => {
          console.error('Error during getModelNames', error);
        });
    }

    if (t !== '') {
      this.props.onSearchCriteriaChange(
        {
          pepplotStudy: s,
          pepplotModel: m,
          pepplotTest: t,
          pepplotProteinSite: p,
        },
        false,
      );
      this.setState({
        uAnchorP: t,
      });
      this.props.onSearchTransitionPepplot(true);
      phosphoprotService
        .getTestData(m, t, s + 'plots', this.props.onSearchTransitionPepplot)
        .then(dataFromService => {
          this.setState({
            uSettingsP: {
              ...this.state.uSettingsP,
              maxElementsP: dataFromService.length,
            },
          });
          this.testdata = dataFromService;
          this.props.onPepplotSearchUnfiltered({
            pepplotResults: this.testdata,
          });
          this.props.onPepplotSearch({ pepplotResults: this.testdata });
        })
        .catch(error => {
          console.error('Error during getTestData', error);
        });
    }
    this.populateStudies();
  }

  // used when test is updated by clicking on the bulleye within enrichment, triple pane
  componentDidUpdate(prevProps) {
    if (this.props.pepplotTest !== prevProps.pepplotTest) {
      const s = this.props.pepplotStudy || '';
      const m = this.props.pepplotModel || '';
      const t = this.props.pepplotTest || '';
      const p = '';

      if (s !== '') {
        this.setState({
          pepplotStudyHrefVisible: true,
          pepplotStudyHref: `http://www.localhost:3000/${s}.html`,
        });
        phosphoprotService
          .getModelNames('inferenceNames', s + 'plots')
          .then(modelsFromService => {
            this.allNames = modelsFromService;
            const modelsArr = _.map(_.keys(modelsFromService), function(
              modelName,
            ) {
              return { key: modelName, text: modelName, value: modelName };
            });
            this.setState({
              pepplotModelsDisabled: false,
              pepplotModels: modelsArr,
            });
            if (m !== '') {
              const testsArr = _.map(this.allNames[m], function(testName) {
                return { key: testName, text: testName, value: testName };
              });
              const uDataPArr = this.allNames[m];
              this.setState({
                pepplotTestsDisabled: false,
                pepplotTests: testsArr,
                uDataP: uDataPArr,
              });
            }
          })
          .catch(error => {
            console.error('Error during getModelNames', error);
          });
      }
      if (t !== '') {
        this.props.onSearchCriteriaChange(
          {
            pepplotStudy: s,
            pepplotModel: m,
            pepplotTest: t,
            pepplotProteinSite: p,
          },
          false,
        );
        this.setState({
          uAnchorP: t,
        });
        this.props.onSearchTransitionPepplot(true);
        cancelRequestPSCGetTestData();
        let cancelToken = new CancelToken(e => {
          cancelRequestPSCGetTestData = e;
        });
        phosphoprotService
          .getTestData(
            m,
            t,
            s + 'plots',
            this.props.onSearchTransitionPepplot,
            cancelToken,
          )
          .then(dataFromService => {
            this.setState({
              uSettingsP: {
                ...this.state.uSettingsP,
                maxElementsP: dataFromService.length,
              },
            });
            this.testdata = dataFromService;
            this.props.onPepplotSearchUnfiltered({
              pepplotResults: this.testdata,
            });
            this.props.onPepplotSearch({ pepplotResults: this.testdata });
          })
          .catch(error => {
            console.error('Error during getTestData', error);
          });
      }
      this.populateStudies();
    }
  }

  populateStudies = () => {
    phosphoprotService
      .listStudies()
      .then(listStudiesResponseData => {
        debugger;
        const studiesArr = listStudiesResponseData.map(study => {
          const studyName = study.name[0];
          return { key: studyName, text: studyName, value: studyName };
        });
        this.setState({
          pepplotStudies: studiesArr,
        });
        this.props.onHandleListStudiesData(listStudiesResponseData);
      })
      .catch(error => {
        console.error('Error during listStudies', error);
      });
  };

  handleStudyChange = (evt, { name, value }) => {
    this.setState({
      pepplotStudyHrefVisible: true,
      pepplotStudyHref: `http://www.localhost:3000/${value}.html`,
      pepplotModelsDisabled: true,
      pepplotTestsDisabled: true,
    });
    this.props.onSearchCriteriaChange(
      {
        [name]: value,
        pepplotModel: '',
        pepplotTest: '',
      },
      true,
    );
    this.props.onSearchCriteriaReset({
      isValidSearchPepplot: false,
    });
    phosphoprotService
      .getModelNames('inferenceNames', value + 'plots')
      .then(modelsFromService => {
        this.allNames = modelsFromService;
        const modelsArr = _.map(_.keys(modelsFromService), function(modelName) {
          return { key: modelName, text: modelName, value: modelName };
        });
        this.setState({
          pepplotModelsDisabled: false,
          pepplotModels: modelsArr,
        });
      })
      .catch(error => {
        console.error('Error during getModelNames', error);
      });
  };

  handleModelChange = (evt, { name, value }) => {
    this.props.onSearchCriteriaChange(
      {
        pepplotStudy: this.props.pepplotStudy,
        [name]: value,
        pepplotTest: '',
      },
      true,
    );
    this.props.onSearchCriteriaReset({
      isValidSearchPepplot: false,
    });
    const testsArr = _.map(this.allNames[value], function(testName) {
      return { key: testName, text: testName, value: testName };
    });
    const uDataPObj = this.allNames[value];
    this.setState({
      pepplotTestsDisabled: false,
      pepplotTests: testsArr,
      uDataP: uDataPObj,
    });
  };

  handleTestChange = (evt, { name, value }) => {
    this.setState({
      reloadPlot: true,
      multisetFiltersVisibleP: false,
    });
    this.props.onMultisetQueried(false);
    this.props.onSearchCriteriaChange(
      {
        pepplotStudy: this.props.pepplotStudy,
        pepplotModel: this.props.pepplotModel,
        [name]: value,
      },
      true,
    );
    this.props.onSearchTransitionPepplot(true);
    cancelRequestPSCGetTestData();
    let cancelToken = new CancelToken(e => {
      cancelRequestPSCGetTestData = e;
    });
    phosphoprotService
      .getTestData(
        this.props.pepplotModel,
        value,
        this.props.pepplotStudy + 'plots',
        this.props.onSearchTransitionPepplot,
        cancelToken,
      )
      .then(dataFromService => {
        this.setState({
          uSettingsP: {
            ...this.state.uSettingsP,
            mustP: [],
            notP: [],
            defaultsigValueP: 0.05,
            maxElementsP: dataFromService.length,
          },
          sigValueP: [0.05],
          uAnchorP: value,
        });
        this.testdata = dataFromService;
        this.props.onPepplotSearchUnfiltered({ pepplotResults: this.testdata });
        this.props.onPepplotSearch({ pepplotResults: this.testdata });
      })
      .catch(error => {
        console.error('Error during getTestData', error);
      });
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
    console.log('Error during getMultisetInferenceData');
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
    console.log('Error during getTestData');
  };

  multisetTriggeredTestChange = (name, value) => {
    this.props.onSearchCriteriaChange(
      {
        pepplotStudy: this.props.pepplotStudy,
        pepplotModel: this.props.pepplotModel,
        [name]: value,
      },
      true,
    );
    this.props.onSearchTransitionPepplot(true);
    cancelRequestPSCGetTestData();
    let cancelToken = new CancelToken(e => {
      cancelRequestPSCGetTestData = e;
    });
    phosphoprotService
      .getTestData(
        // .getPlot(
        this.props.pepplotModel,
        value,
        this.props.pepplotStudy + 'plots',
        this.handleMultisetPCloseError,
        cancelToken,
      )
      .then(dataFromService => {
        this.testdata = dataFromService;
        this.props.onPepplotSearchUnfiltered({ pepplotResults: this.testdata });
        this.props.onPepplotSearch({ pepplotResults: this.testdata });
      })
      .catch(error => {
        console.error('Error during getTestData', error);
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

  // handleSigValuePInputChange = (name, value, index) => {
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
    const eSigVP = this.state.sigValueP;
    const eMustP = this.state.uSettingsP.mustP;
    const eNotP = this.state.uSettingsP.notP;
    const eOperatorP = this.state.selectedOperatorP;
    const eColP = this.state.selectedColP;

    if (this.state.reloadPlot === true) {
      this.props.onDisablePlot();
      this.getMultisetPlot(
        eSigVP,
        this.props.pepplotModel,
        this.props.pepplotStudy + 'plots',
        this.jsonToList(eOperatorP),
        this.jsonToList(eColP),
      );
    }
    cancelRequestMultisetInferenceData();
    let cancelToken = new CancelToken(e => {
      cancelRequestMultisetInferenceData = e;
    });
    phosphoprotService
      .getMultisetInferenceData(
        this.props.pepplotModel,
        eMustP,
        eNotP,
        this.props.pepplotStudy + 'plots',
        eSigVP,
        this.props.pepplotTest,
        this.jsonToList(eOperatorP),
        this.jsonToList(eColP),
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
        this.props.onPepplotSearch({
          pepplotResults: multisetResultsP,
        });
      })
      .catch(error => {
        console.error('Error during getMultisetInferenceData', error);
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
      .getInferenceMultisetPlot(
        sigVal,
        eOperatorP,
        eColP,
        pepplotModel,
        pepplotStudy,
        undefined,
        cancelToken,
      )
      .then(svgMarkupObj => {
        let svgMarkup = svgMarkupObj.data;
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
        console.error('Error during getInferenceMultisetPlot', error);
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
      pepplotTests,
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
