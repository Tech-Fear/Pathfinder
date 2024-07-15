// src/components/Grid.jsx

import React, { useState, useEffect } from 'react';
import Node from './Node';
import dijkstra from '../algorithms/dijkstra';
import '../styles/styles.css';

const Grid = () => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [startNode, setStartNode] = useState(null);
  const [finishNode, setFinishNode] = useState(null);
  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const rows = 20;
    const cols = 50; 
    const initialGrid = [];
    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let col = 0; col < cols; col++) {
        const newNode = {
          row,
          col,
          // isStart: row === Math.floor(rows / 2) && col === Math.floor(cols / 4),
          isStart: row===4 && col===5,
          isFinish: row === Math.floor(rows / 2) && col === Math.floor(3 * cols / 4),
          distance: Infinity,
          isVisited: false,
          isWall: false,
          previousNode: null,
        };
        if (newNode.isStart) setStartNode(newNode);
        if (newNode.isFinish) setFinishNode(newNode);
        currentRow.push(newNode);
      }
      initialGrid.push(currentRow);
    }
    setGrid(initialGrid);
  };

  const handleMouseDown = (row, col) => {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  const visualizeDijkstra = async () => {
    const visitedNodesInOrder = await dijkstra(grid, startNode, finishNode);
    animateDijkstra(visitedNodesInOrder);
  };

  const animateDijkstra = (visitedNodesInOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          visualizeShortestPath();
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const newGrid = [...grid];
        const updatedNode = {
          ...node,
          isVisited: true,
        };
        newGrid[node.row][node.col] = updatedNode;
        setGrid(newGrid);
      }, 10 * i);
    }
  };

  const visualizeShortestPath = () => {
    const shortestPathNodes = getNodesInShortestPathOrder(finishNode);
    animateShortestPath(shortestPathNodes);
  };

  const animateShortestPath = (shortestPathNodes) => {
    for (let i = 1; i < shortestPathNodes.length - 1; i++) {
      setTimeout(() => {
        const node = shortestPathNodes[i];
        const newGrid = [...grid];
        const updatedNode = {
          ...node,
          isShortestPath: true,
        };
        newGrid[node.row][node.col] = updatedNode;
        setGrid(newGrid);
      }, 50 * i);
    }
  };

  const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = [...grid];
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  const getNodesInShortestPathOrder = () => {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  };

  return (
    <div className="grid">
      <button onClick={visualizeDijkstra} className='Hell'>Visualize Dijkstra</button>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((node, nodeIndex) => (
            <Node
              key={nodeIndex}
              node={node}
              onMouseDown={(row, col) => handleMouseDown(row, col)}
              onMouseEnter={(row, col) => handleMouseEnter(row, col)}
              onMouseUp={() => handleMouseUp()}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
