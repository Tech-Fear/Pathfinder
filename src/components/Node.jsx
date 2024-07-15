// src/components/Node.jsx

import React from 'react';
import '../styles/styles.css';

const Node = ({ node, onMouseDown, onMouseEnter, onMouseUp }) => {
  const {
    row,
    col,
    isStart,
    isFinish,
    isVisited,
    isWall,
    isShortestPath,
  } = node;

  const nodeClass = isStart
    ? 'node-start'
    : isFinish
    ? 'node-finish'
    : isWall
    ? 'node-wall'
    : isShortestPath
    ? 'node-shortest-path'
    : isVisited
    ? 'node-visited'
    : '';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${nodeClass}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
};

export default Node;
