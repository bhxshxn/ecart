import React from 'react';

export default function MessageBox(props) {
  return (
    <div style={props.style}>
      <div className={`alert alert-${props.variant || 'info'}`}>
        {props.children}
      </div>
    </div>
  );
}