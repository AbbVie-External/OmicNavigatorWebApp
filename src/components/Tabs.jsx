import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Tab, Menu } from 'semantic-ui-react';
import { phosphoprotService } from '../services/phosphoprot.service';
import Differential from './Differential/Differential';
import omicAnalyzerIcon from '../resources/icon.png';
import Enrichment from './Enrichment/Enrichment';
import { updateUrl } from './Shared/UrlControl';

class Tabs extends Component {
  constructor(props) {
    super(props);
    const baseUrl = window.location.origin || 'http://localhost:3000';
    const pathnameInit = this.props.location.pathname.substring(1) || null;
    const pathname =
      pathnameInit !== null ? pathnameInit.replace(/–/gi, ' ') : pathnameInit;
    const params = pathname ? pathname.split('/') : '';
    const tabFromUrl = params[0] || '';
    const studyFromUrl = params[1] || '';
    const modelFromUrl = params[2] || '';
    const testOrAnnotationFromUrl = params[3] || '';
    const featureOrTestfromUrl = params[4] || '';
    const descriptionFromUrl = params[5] || '';
    const featureOrTestAndDescription =
      descriptionFromUrl !== ''
        ? `${featureOrTestfromUrl}/${descriptionFromUrl}`
        : featureOrTestfromUrl;
    const decodedStudy = decodeURI(studyFromUrl);
    const decodedModel = decodeURI(modelFromUrl);
    const decodedTest = decodeURI(testOrAnnotationFromUrl);
    const decodedFeatureOrTestAndDescription = decodeURI(
      featureOrTestAndDescription,
    );
    const isEnrichment = tabFromUrl === 'enrichment';
    this.state = {
      baseUrl: baseUrl,
      activeIndex: isEnrichment ? 2 : 1,
      tab: tabFromUrl,
      enrichmentStudy: isEnrichment ? decodedStudy : '',
      enrichmentModel: isEnrichment ? decodedModel : '',
      enrichmentAnnotation: isEnrichment ? decodedTest : '',
      enrichmentTestAndDescription: isEnrichment
        ? decodedFeatureOrTestAndDescription
        : '',
      differentialStudy: !isEnrichment ? decodedStudy : '',
      differentialModel: !isEnrichment ? decodedModel : '',
      differentialTest: !isEnrichment ? decodedTest : '',
      differentialFeature: !isEnrichment
        ? decodedFeatureOrTestAndDescription
        : '',
      pValueType: 'nominal',
      featureToHighlightInDiffTable: '',
      allStudiesMetadata: [],
      differentialFeatureIdKey: '',
      filteredDifferentialFeatureIdKey: '',
      bullseyeHighlightInProgress: false,
    };
  }

  componentDidMount() {
    updateUrl(
      this.props,
      this.state,
      null,
      'tabInit',
      this.setTabIndex,
      false,
      null,
    );
    this.getStudies();
  }

  setTabIndex = tabIndex => {
    this.setState({
      activeIndex: tabIndex,
    });
  };

  handlePValueTypeChange = type => {
    this.setState({
      pValueType: type,
    });
  };

  handleTabChange = (e, { activeIndex }) => {
    let newTab = activeIndex === 2 ? 'differential' : 'enrichment';
    this.setState({
      tab: newTab,
    });
    updateUrl(
      this.props,
      this.state,
      null,
      'tabChange',
      this.setTabIndex,
      false,
      null,
    );
  };

  handleSearchCriteriaToTop = (changes, tab) => {
    if (tab === 'differential') {
      this.setState({
        tab: 'differential',
        differentialStudy: changes.differentialStudy || '',
        differentialModel: changes.differentialModel || '',
        differentialTest: changes.differentialTest || '',
        differentialFeature: changes.differentialFeature || '',
      });
    } else if (tab === 'enrichment') {
      this.setState({
        tab: 'enrichment',
        enrichmentStudy: changes.enrichmentStudy || '',
        enrichmentModel: changes.enrichmentModel || '',
        enrichmentAnnotation: changes.enrichmentAnnotation || '',
        enrichmentTestAndDescription:
          changes.enrichmentTestAndDescription || '',
      });
    }
    updateUrl(
      this.props,
      this.state,
      changes,
      'tabInit',
      this.setTabIndex,
      true,
      tab,
    );
  };
  handleDifferentialFeatureIdKey = (name, id) => {
    this.setState({
      [name]: id,
    });
  };
  findDifferentialFeature = (test, featureID) => {
    this.setState({
      activeIndex: 1,
      tab: 'differential',
      differentialStudy: this.state.enrichmentStudy || '',
      differentialModel: this.state.enrichmentModel || '',
      differentialTest: test || '',
      differentialFeature: '',
      bullseyeHighlightInProgress: true,
      featureToHighlightInDiffTable: featureID,
    });
    let changes = {
      differentialStudy: this.state.enrichmentStudy || '',
      differentialModel: this.state.enrichmentModel || '',
      differentialTest: test || '',
      differentialFeature: '',
    };
    updateUrl(
      this.props,
      this.state,
      changes,
      'tabChange',
      this.setTabIndex,
      true,
      'differential',
    );
  };

  handlePagedToFeature = () => {
    this.setState({
      bullseyeHighlightInProgress: false,
      featureToHighlightInDiffTable: '',
    });
  };

  getStudies = () => {
    phosphoprotService
      .listStudies()
      .then(listStudiesResponseData => {
        this.setState({
          allStudiesMetadata: listStudiesResponseData,
        });
      })
      .catch(error => {
        console.error('Error during listStudies', error);
      });
  };

  resetApp = () => {
    this.setState(
      {
        activeIndex: 1,
        tab: 'differential',
        enrichmentStudy: '',
        enrichmentModel: '',
        enrichmentAnnotation: '',
        enrichmentTestAndDescription: '',
        differentialStudy: '',
        differentialModel: '',
        differentialTest: '',
        differentialFeature: '',
        pValueType: 'nominal',
        featureToHighlightInDiffTable: '',
        allStudiesMetadata: [],
        differentialFeatureIdKey: '',
        filteredDifferentialFeatureIdKey: '',
        bullseyeHighlightInProgress: false,
      },
      function() {
        updateUrl(
          this.props,
          this.state,
          null,
          'tabInit',
          this.setTabIndex,
          false,
          null,
        );
        window.location.reload(false);
      },
    );
  };

  render() {
    const { activeIndex } = this.state;
    const panes = [
      {
        menuItem: (
          <Menu.Item key="1" disabled header className="LogoAndTitle">
            <span id="ResetApp" onClick={this.resetApp}>
              <span className="LogoElement">
                <img
                  alt="Omic Analyzer"
                  src={omicAnalyzerIcon}
                  className="LogoImage"
                />
              </span>
              <span className="Header HeaderFirst">Omic&nbsp;</span>
              <span className="Header HeaderSecond">Analyzer</span>
            </span>
          </Menu.Item>
        ),
      },
      {
        menuItem: 'Differential Analysis',
        pane: (
          <Tab.Pane key="2" className="">
            <Differential
              {...this.props}
              {...this.state}
              onSearchCriteriaToTop={this.handleSearchCriteriaToTop}
              onHandleDifferentialFeatureIdKey={
                this.handleDifferentialFeatureIdKey
              }
              onPagedToFeature={this.handlePagedToFeature}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Enrichment Analysis',
        pane: (
          <Tab.Pane key="3" className="">
            <Enrichment
              {...this.props}
              {...this.state}
              onSearchCriteriaToTop={this.handleSearchCriteriaToTop}
              onPValueTypeChange={this.handlePValueTypeChange}
              onFindDifferentialFeature={this.findDifferentialFeature}
              onHandleDifferentialFeatureIdKey={
                this.handleDifferentialFeatureIdKey
              }
            />
          </Tab.Pane>
        ),
      },
    ];

    return (
      <Tab
        onTabChange={this.handleTabChange}
        panes={panes}
        activeIndex={activeIndex}
        renderActiveOnly={false}
        menu={{
          stackable: true,
          secondary: true,
          pointing: true,
          inverted: true,
          className: 'MenuContainer',
        }}
      />
    );
  }
}

export default withRouter(Tabs);
