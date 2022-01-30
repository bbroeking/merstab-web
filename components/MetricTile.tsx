import React from 'react';

export interface MetricTileProps {
    metric: string,
    metricTitle: string
}
const MetricTile = (props: MetricTileProps) => {
  return <div style={{display: 'flex', flexDirection: 'column', margin: 20, flexGrow: 1, alignItems: 'center'}}>
      <div style={{ fontSize: '16', color: '#FFF' }}>{props.metric}</div>
      <div style={{fontSize: '12', color: '#bfb6b6'}}>{props.metricTitle}</div>
  </div>;
};

export default MetricTile;
