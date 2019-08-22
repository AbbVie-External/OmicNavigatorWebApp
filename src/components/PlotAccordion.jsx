import React from 'react';
import { Accordion } from 'semantic-ui-react';

const Peptide1Panels = [
  { key: 'protein_site', title: 'Protein_Site', content: 'HMGA1_S44' },
  { key: 'ccds', title: 'CCDS', content: 'CCDS4789' },
  {
    key: 'positions_within_proteins',
    title: 'PositionsWithinProteins',
    content: '44;44'
  },
  {
    key: 'modified_sequence',
    title: 'Modified_sequence',
    content: '_KQPPVSPGTALVGS(ph)QKEPSEVPTPK_'
  },
  { key: 'phosphates', title: 'Phosphates', content: '1' },
  {
    key: 'proteins',
    title: 'Proteins',
    content: 'ENSP00000399888.1;ENSP00000308227.4'
  },
  {
    key: 'leading_proteins',
    title: 'LeadingProteins',
    content: 'ENSP00000399888.1'
  },
  {
    key: 'leading_razor_protein',
    title: 'Leading Razor Protein',
    content: 'ENSP00000399888.1'
  },
  { key: 'modifications', title: 'Modifications', content: 'Phospho (STY)' },
  {
    key: 'experiments',
    title: 'Experiments',
    content:
      'D3_AB095_30_min_2_1;D3_AB095_30_min_2_1;D3_***REMOVED***_60_min_1_1;D3_***REMOVED***_60_min_1_1;D3_***REMOVED***_60_min_1_1;D2_AB095_5_min_2_1;D2_AB095_5_min_2_1;D3_***REMOVED***_2.5_min_2_1;D3_***REMOVED***_2.5_min_2_1;D1_AB095_2.5_min_1_1;D1_AB095_2.5_min_1_1;D1_***REMOVED***_30_min_1_1;D1_***REMOVED***_30_min_1_1;D2_AB095_5_min_1_1;D2_AB095_2.5_min_2_1;D3_***REMOVED***_15_min_1_1;D3_***REMOVED***_15_min_1_1;D1_***REMOVED***_2.5_min_1_1;D1_0_min_IV_1;D1_0_min_IV_1;D2_AB095_30_min_1_1;D2_AB095_30_min_1_1;D2_AB095_30_min_1_1;D2_***REMOVED***_15_min_1_1;D2_***REMOVED***_15_min_1_1;D1_AB095_15_min_2_1;D1_AB095_15_min_2_1;D1_AB095_30_min_2_1;D1_AB095_30_min_2_1;D1_AB095_30_min_2_2;D1_AB095_30_min_2_2;D3_***REMOVED***_60_min_2_1;D3_***REMOVED***_60_min_2_1;D3_***REMOVED***_60_min_2_2;D3_***REMOVED***_60_min_2_2;D3_***REMOVED***_60_min_2_2;D3_***REMOVED***_60_min_2_3;D3_***REMOVED***_60_min_2_3;D3_***REMOVED***_60_min_2_4;D3_***REMOVED***_60_min_2_4;D3_***REMOVED***_15_min_2_1;D3_***REMOVED***_15_min_2_1;D3_***REMOVED***_15_min_2_2;D3_***REMOVED***_15_min_2_2;D2_AB095_60_min_2_1;D2_AB095_60_min_2_1;D2_AB095_60_min_2_2;D2_AB095_60_min_2_2;D3_0_min_II_1;D3_0_min_II_2;D3_0_min_II_2;D3_0_min_I_1;D3_0_min_I_1;D3_0_min_I_2;D2_***REMOVED***_60_min_1_1;D2_***REMOVED***_60_min_1_1;D2_***REMOVED***_60_min_1_2;D2_***REMOVED***_60_min_1_2;D3_AB095_60_min_2_1;D3_AB095_60_min_2_2;D3_AB095_60_min_2_2;D3_0_min_III_1;D3_0_min_III_1;D3_0_min_III_2;D3_0_min_III_2;D3_0_min_III_2;D3_0_min_III_2;D1_AB095_30_min_1_2;D1_AB095_30_min_1_2;D2_0_min_III_2;D2_0_min_III_2;D2_0_min_III_2;D2_***REMOVED***_2.5_min_2_2;D1_AB095_15_min_1_2;D1_AB095_15_min_1_2;D3_***REMOVED***_5_min_2_2;D2_***REMOVED***_5_min_2_2;D2_***REMOVED***_5_min_2_2;D3_AB095_15_min_2_1;D3_AB095_15_min_2_1;D3_AB095_5_min_1_1;D3_AB095_5_min_1_1;D2_***REMOVED***_30_min_2_1;D2_***REMOVED***_30_min_2_1;D3_***REMOVED***_30_min_2_1;D2_***REMOVED***_2.5_min_1_1;D3_***REMOVED***_5_min_1_1;D3_***REMOVED***_5_min_1_1;D2_AB095_15_min_1_1;D1_***REMOVED***_5_min_1_1;D2_AB095_2.5_min_1_1;D2_AB095_2.5_min_1_1;D3_AB095_60_min_1_1;D3_AB095_60_min_1_1;D1_***REMOVED***_5_min_2_1;D3_AB095_15_min_1_1;D3_AB095_15_min_1_2;D3_AB095_15_min_1_2;D1_AB095_60_min_2_2;D1_AB095_60_min_2_2;D1_0_min_III_2;D2_AB095_60_min_1_2;D2_AB095_60_min_1_2;D1_AB095_60_min_1_2;D1_***REMOVED***_15_min_1_2;D1_***REMOVED***_15_min_1_2;D3_0_min_IV_1;D3_0_min_IV_2;D3_0_min_IV_2;D2_***REMOVED***_60_min_1_3;D2_***REMOVED***_60_min_1_3;D1_***REMOVED***_60_min_1_1;D1_***REMOVED***_60_min_1_1;D2_AB095_30_min_2_1;D2_AB095_30_min_2_1;D3_AB095_5_min_2_1;D3_AB095_5_min_2_1;D2_0_min_IV_1;D2_0_min_IV_1;D2_***REMOVED***_60_min_2_1;D2_***REMOVED***_60_min_2_1;D2_0_min_II_1;D2_0_min_II_1;D1_AB095_5_min_2_1;D1_AB095_5_min_2_1;D3_***REMOVED***_30_min_1_1;D3_***REMOVED***_30_min_1_1;D1_0_min_II_1;D1_0_min_II_1;D1_***REMOVED***_15_min_2_1;D1_***REMOVED***_15_min_2_1;D2_***REMOVED***_15_min_2_1;D2_***REMOVED***_15_min_2_1;D3_AB095_2.5_min_2_1;D3_AB095_2.5_min_2_1;D2_***REMOVED***_5_min_1_1;D2_***REMOVED***_5_min_1_1;D1_0_min_I_1;D1_0_min_I_1;D3_AB095_30_min_1_1;D3_AB095_30_min_1_1;D1_***REMOVED***_30_min_2_1;D3_***REMOVED***_2.5_min_1_1;D3_***REMOVED***_2.5_min_1_1;D1_AB095_2.5_min_2_1;D1_AB095_2.5_min_2_1;D2_0_min_I_1;D2_0_min_I_1;D1_***REMOVED***_60_min_2_1;D1_***REMOVED***_60_min_2_1;D1_***REMOVED***_2.5_min_2_1;D1_***REMOVED***_2.5_min_2_1;D3_AB095_30_min_2_1;D3_***REMOVED***_60_min_1_1;D1_***REMOVED***_30_min_1_1;D2_AB095_5_min_1_1;D2_AB095_2.5_min_2_1;D1_***REMOVED***_2.5_min_1_1;D1_0_min_IV_1;D1_0_min_IV_1;D1_AB095_15_min_2_1;D1_AB095_30_min_2_1;D1_AB095_30_min_2_1;D3_***REMOVED***_60_min_2_1;D3_***REMOVED***_60_min_2_3;D3_***REMOVED***_60_min_2_3;D3_***REMOVED***_15_min_2_1;D3_***REMOVED***_15_min_2_2;D2_AB095_60_min_2_1;D3_0_min_II_1;D3_0_min_II_1;D3_0_min_II_1;D3_0_min_II_1;D3_0_min_I_1;D3_0_min_I_1;D2_***REMOVED***_60_min_1_1;D2_***REMOVED***_60_min_1_1;D2_***REMOVED***_60_min_1_1;D3_AB095_60_min_2_1;D3_0_min_III_1;D1_AB095_30_min_1_1;D1_AB095_30_min_1_1;D1_AB095_30_min_1_1;D2_0_min_III_1;D2_0_min_III_1;D2_0_min_III_1;D2_***REMOVED***_2.5_min_2_1;D2_***REMOVED***_2.5_min_2_1;D1_AB095_15_min_1_1;D1_AB095_15_min_1_1;D1_AB095_15_min_1_1;D3_***REMOVED***_5_min_2_1;D2_***REMOVED***_5_min_2_1;D2_***REMOVED***_5_min_2_1;D2_***REMOVED***_5_min_2_1;D2_***REMOVED***_5_min_2_1;D3_AB095_5_min_1_1;D1_***REMOVED***_5_min_2_1;D2_AB095_15_min_2_1;D3_AB095_15_min_1_1;D3_AB095_15_min_1_1;D3_AB095_15_min_1_2;D3_AB095_15_min_1_2;D1_AB095_60_min_2_1;D1_AB095_60_min_2_1;D1_AB095_60_min_2_1;D1_AB095_60_min_2_1;D1_0_min_III_1;D2_AB095_60_min_1_1;D1_AB095_60_min_1_2;D1_***REMOVED***_15_min_1_1;D1_***REMOVED***_15_min_1_1;D1_***REMOVED***_15_min_1_1;D3_0_min_IV_1;D3_0_min_IV_1;D3_0_min_IV_2;D1_***REMOVED***_30_min_2_1'
  },
  { key: 'observations', title: 'Observations', content: '217' },
  {
    key: 'observation_types',
    title: 'ObservationTypes',
    content:
      'MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MSMS;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH;MULTI-MATCH'
  },
  { key: 'median_intensity', title: 'MedianIntensity', content: '30412000' }
];

const Peptide1Content = <Accordion.Accordion panels={Peptide1Panels} />;

const rootPanels = [
  {
    key: 'peptide1',
    title: ' Peptide1  (_KQPPVSPGTALVGS(ph)QKEPSEVPTPK_) ',
    content: { content: Peptide1Content }
  }
];

const PlotAccordion = () => (
  <Accordion
    defaultActiveIndex={[0]}
    panels={rootPanels}
    exclusive={false}
    fluid
  />
);

export default PlotAccordion;